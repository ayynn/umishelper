import { start as startPortalInjection } from './portalListeners'
import { registerAllPageListeners } from './allPageListeners'

const init = () => {
    window.addEventListener('load', () => {
        const url = new URL(window.location.href)
        //the part for portal
        if (url.pathname == '/portal/') {
            startPortalInjection()
        } else if (url.pathname == '/portal/sso') {
            const interval = setInterval(() => {
                if (window.location.pathname == '/portal/') {
                    startPortalInjection()
                    clearInterval(interval)
                }
            }, 500)
        }
        registerAllPageListeners()
    })
}
init()
