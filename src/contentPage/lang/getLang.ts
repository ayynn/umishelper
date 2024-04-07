import { provide, inject, ComputedRef, computed } from 'vue'
import type { InjectionKey } from 'vue'

export const getLangKey = Symbol() as InjectionKey<ComputedRef<(key: any) => any>>

export function useGetLang(key: string) {
    const getLang = inject(getLangKey)
    const lang = computed(() => {
        return getLang.value(key)
    })
    return lang
}