import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { useUserStore } from "@/contentPage/store/user";
import { ElMessage } from "element-plus";

const instance = axios.create()

interface CommonResponse<T = any> {
    success: boolean,
    message: string,
    data: T
}

instance.interceptors.request.use(
    (config) => {
        const store = useUserStore()
        config.headers.Authorization = `Bearer ${store.token}`
        console.log('store in request', store.token, config)
        config.baseURL=store.urlOrigin
        return config;
    }
)

instance.interceptors.response.use(
    (response) => {
        const returnObj = {
            data: response.data.data,
            success: response.data.flag === 0,
            message: response.data.message
        }
        response.data = returnObj
        return response
    }, (error) => {
        // 错误处理
        ElMessage.error(error.message)
    })

function request<T = any>(config: AxiosRequestConfig) {
    return instance.request<any, AxiosResponse<CommonResponse<T>>>(config).then(res => {
        console.log('!!!', res.data)
        return res.data
    })
}

export default request