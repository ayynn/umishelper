console.log("this is content js", this)
import { start } from './listeners'

const init = () => {
    window.addEventListener('load', () => {
        const url = new URL(window.location.href)
        console.log('windowload', url)
        if (url.pathname == '/portal/') {
            start()
        } else if (url.pathname == '/portal/sso') {
            const interval = setInterval(() => {
                if (window.location.pathname == '/portal/') {
                    start()
                    clearInterval(interval)
                }
            }, 500)
        }
    })
}
init()
