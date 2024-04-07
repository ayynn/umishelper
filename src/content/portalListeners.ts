import { registerChromeRuntimeEvents, registerMessageEvents } from "./portalMessageEvents"
import { createFloatingActionButton } from "./createFloatingActionButton";
import { replaceMenuButton } from "./replaceMenuButton";
export const FRAMEID = 'content-start-iframe'

const addIframe = (id: string, pagePath: string) => {
    const contentIframe = document.createElement("iframe");
    contentIframe.id = id;
    contentIframe.style.cssText = "transform:translateX(-100%);transition:all 0.5s;display:none;opacity:0;width: 25vw;min-width:300px; height: calc(100vh - 62px); position: fixed; z-index: 10000002;background-color:rgba(255,255,255,1);left:0;top:62px;border:none;";
    const getContentPage = chrome.runtime.getURL(pagePath);
    contentIframe.src = getContentPage;
    document.body.appendChild(contentIframe);

    replaceMenuButton()
    createFloatingActionButton()
}


export function start() {
    registerMessageEvents()
    registerChromeRuntimeEvents()

    addIframe(FRAMEID, 'contentPage/index.html')
}

