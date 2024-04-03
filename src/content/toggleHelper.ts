import {showFrame,hideFrame} from './hideShowFrame'
import { FRAMEID } from './content'
export function toggleHelper(){
    const contentIframe = document.getElementById(FRAMEID)
    if (!contentIframe) return
    if (status) {
        showFrame(contentIframe)
    } else {
        hideFrame(contentIframe)
    }
}