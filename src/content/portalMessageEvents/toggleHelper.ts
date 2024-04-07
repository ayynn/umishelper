import { showFrame, hideFrame } from './hideShowFrame'
import { FRAMEID } from '../portalListeners'
export function toggleHelper() {
    const contentIframe = document.getElementById(FRAMEID)
    let tempStatus= contentIframe.style.display === 'none' 
    tempStatus?showFrame(contentIframe):hideFrame(contentIframe)
}