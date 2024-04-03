import { defineStore } from 'pinia'

interface State {
    url: InstanceType<typeof URL> | null,
    urlOrigin: string,
    userInfo: any | null
}

export const useUserStore = defineStore('user', {
    state: () => {
        const state: State = {
            url: null,
            urlOrigin: '',
            userInfo: null
        }
        return state
    },
    actions: {
        increment() {
            this.count++
        },
    },
})
