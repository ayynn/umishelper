console.log("this is content js", this)
import { showFrame } from './hideShowFrame'
import { toggleHelper } from './toggleHelper'

export const FRAMEID = 'content-start-iframe'
const floatingActionButtonId = 'floating-action-button'

const init = () => {
    const addIframe = (id: string, pagePath: string) => {
        const contentIframe = document.createElement("iframe");
        contentIframe.id = id;
        contentIframe.style.cssText = "transform:translateX(100%);transition:all 0.5s;display:none;opacity:0;width: 50vh; height: calc(100vh - 62px); position: fixed; z-index: 10000002;background-color:rgba(255,255,255,1);right:0;top:62px;border:none;";
        const getContentPage = chrome.runtime.getURL(pagePath);
        contentIframe.src = getContentPage;
        document.body.appendChild(contentIframe);

        const floatingActionButton = document.createElement("button");
        floatingActionButton.id = floatingActionButtonId
        floatingActionButton.style.position = 'fixed'
        floatingActionButton.style.zIndex = '10000000'
        floatingActionButton.style.right = '0'
        floatingActionButton.style.top = '80%'
        floatingActionButton.style.transform = 'translateY(-50%) translateX(50%)'
        floatingActionButton.style.backgroundColor = '#4a90e2'
        floatingActionButton.style.color = '#fff'
        floatingActionButton.style.borderRadius = '50%'
        floatingActionButton.style.border = 'none'
        floatingActionButton.style.width = '48px'
        floatingActionButton.style.height = '48px'
        floatingActionButton.style.padding = '5px'
        floatingActionButton.style.fontSize = '12px'
        floatingActionButton.style.cursor = 'pointer'
        floatingActionButton.style.transition = 'all 0.3s'
        floatingActionButton.classList.add('umis-helper-button')

        const styleSheet = document.createElement('style')
        styleSheet.innerHTML = `
        .umis-helper-button::before{
            content:'U';
            position:absolute;
            top:50%;
            left:30%;
            transform:translateY(-50%) translateX(-50%);
        }
        .umis-helper-button:hover{
            transform:translateY(-50%) translateX(0%) !important;
        }
        .umis-helper-button:hover::before{
            content:'UMIS';
            top:50%;
            left:50%;
            transform:translateY(-50%) translateX(-50%);
        }
        `

        floatingActionButton.addEventListener('click', () => {
            const contentIframe = document.getElementById(FRAMEID)
            if (!contentIframe) return
            showFrame(contentIframe)
        })
        document.body.appendChild(floatingActionButton);
        document.body.appendChild(styleSheet);
    }
    window.addEventListener('load', () => {
        const url = new URL(window.location.href)
        console.log('windowload', url)
        function start() {
            window.addEventListener('message', (event: MessageEvent) => {
                if (event.data?.source == 'umishelper-contentpage') {
                    const { type, status, data } = event.data?.message
                    console.log('messageevent', event)
                    switch (type) {
                        case 'toggleHelper':
                            toggleHelper()
                            break;
                        case 'openmenu': {
                            const { privilegeCode, appCode } = data
                            const clickElement = document.querySelector(`[data-tab-id=${privilegeCode || appCode}]`) as HTMLLIElement
                            clickElement && clickElement.click()
                            console.log('clickElement',data,clickElement)
                        }
                            break;
                        default:
                            break;
                    }
                }
            })
            addIframe(FRAMEID, 'contentPage/index.html')
        }
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
