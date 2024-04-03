import { toggleHelper } from "./toggleHelper"
import { createFloatingActionButton } from "./createFloatingActionButton";
export const FRAMEID = 'content-start-iframe'

const addIframe = (id: string, pagePath: string) => {
    const contentIframe = document.createElement("iframe");
    contentIframe.id = id;
    contentIframe.style.cssText = "transform:translateX(100%);transition:all 0.5s;display:none;opacity:0;width: 50vh; height: calc(100vh - 62px); position: fixed; z-index: 10000002;background-color:rgba(255,255,255,1);right:0;top:62px;border:none;";
    const getContentPage = chrome.runtime.getURL(pagePath);
    contentIframe.src = getContentPage;
    document.body.appendChild(contentIframe);
    createFloatingActionButton()
}

function openMenu(data) {
    const { privilegeCode, appCode } = data
    const clickElement = document.querySelector(`[data-tab-id=${privilegeCode || appCode}]`) as HTMLLIElement
    clickElement && clickElement.click()
}

function getMainTabChildNodes(){
    const ulMain = document.getElementById('nabTabsBox') as HTMLUListElement
    const childrens = ulMain.children
    return childrens
}

function closeMenu(data) {
    const { appCode } = data
    const nodes=getMainTabChildNodes()
    const removeItem:HTMLLIElement=nodes[`tabId_${appCode}`]||nodes[appCode]
    if(removeItem){
        removeItem.getElementsByTagName('a')[0].click()
    }
}


export function start() {
    window.addEventListener('message', (event: MessageEvent) => {
        if (event.data?.source == 'umishelper-contentpage') {
            const { type, status, data } = event.data?.message
            console.log('messageevent', event)
            switch (type) {
                case 'toggleHelper':
                    toggleHelper(status)
                    break;
                case 'openmenu': {
                    openMenu(data)
                }
                    break;
                case 'closemenu': {
                    closeMenu(data)
                }
                    break;
                default:
                    break;
            }
        }
    })
    chrome.runtime.onMessage.addListener((message, sender, sendResponse: (para: any) => void) => {
        console.log('on message in listeners', message, sender)
        const { type } = message
        if (!type) return false
        if (type == 'getCurrentOpenMenu') {
            getCurrentOpenMenu(sendResponse)
        }
        return true
    })
    addIframe(FRAMEID, 'contentPage/index.html')
}

async function getCurrentOpenMenu(send) {
    const childrens = getMainTabChildNodes()
    const nodeInfoList = []
    for (let index = 0; index < childrens.length; index++) {
        const element: any = childrens[index];
        nodeInfoList.push(element.id)
    }
    send(nodeInfoList)
}