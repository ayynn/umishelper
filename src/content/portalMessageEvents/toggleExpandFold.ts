import { FRAMEID } from "../portalListeners"

export function toggleExpandFold(sendResponse) {
    console.log('toggle expand fold')
    const contentFrame = document.getElementById(FRAMEID)
    if (contentFrame.style.width == '25vw') {
        contentFrame.style.width = '50vw'
        sendResponse(true)
    } else {
        contentFrame.style.width = '25vw'
        sendResponse(false)
    }
}