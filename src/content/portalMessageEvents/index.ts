import { toggleHelper } from './toggleHelper'
import { openMenu, closeMenu, getMainTabChildNodes } from './openCloseMenu'
import { selectGlobalBoxItem, getGlobalBoxItems } from './selectGlobalBoxItem'
import { toggleExpandFold } from './toggleExpandFold'

export function registerMessageEvents() {
    window.addEventListener('message', (event: MessageEvent) => {
        if (event.data?.source == 'umishelper-contentpage') {
            const { type, data } = event.data?.message
            console.log('messageevent', event)
            switch (type) {
                case 'toggleHelper':
                    toggleHelper()
                    break;
                case 'openmenu': {
                    openMenu(data)
                }
                    break;
                case 'closemenu': {
                    closeMenu(data)
                }
                case 'selectGlobalBoxItem': {
                    selectGlobalBoxItem(data)
                }
                    break;
                default:
                    break;
            }
        }
    })
}

export function registerChromeRuntimeEvents() {
    async function getCurrentOpenMenu(send) {
        const childrens = getMainTabChildNodes()
        const nodeInfoList = []
        for (let index = 0; index < childrens.length; index++) {
            const element: any = childrens[index];
            nodeInfoList.push(element.dataset.tabId)
        }
        send(nodeInfoList)
    }
    chrome.runtime.onMessage.addListener((message, sender, sendResponse: (para: any) => void) => {
        console.log('on message in listeners', message, sender)
        const { type } = message
        if (!type) return false
        if (type == 'getCurrentOpenMenu') {
            getCurrentOpenMenu(sendResponse)
        } else if (type == 'getGlobalBoxItems') {
            getGlobalBoxItems(sendResponse)
            return true
        } else if (type == 'toggleExpandFold') {
            toggleExpandFold(sendResponse)
            return true
        } else {
            return false
        }
    })
}

