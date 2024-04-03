import { useUserStore } from "../store/user"
import { storeToRefs } from "pinia"
export function postHelperMessage(message:{
    type:string,
    data?:any,
    status?:boolean
}) {
    const store=useUserStore()
    const { urlOrigin } = storeToRefs(store)
    window.parent.postMessage({
        source: 'umishelper-contentpage',
        message
    }, urlOrigin.value)
}