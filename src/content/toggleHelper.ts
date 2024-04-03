import { showFrame, hideFrame } from './hideShowFrame'
import { FRAMEID } from './listeners'
export function toggleHelper(status: boolean) {
    const contentIframe = document.getElementById(FRAMEID)
    if (!contentIframe) return
    if (status) {
        showFrame(contentIframe)
    } else {
        hideFrame(contentIframe)
    }
}