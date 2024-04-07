export function openMenu(data) {
    const { privilegeCode, appCode } = data
    const clickElement = document.querySelector(`[data-tab-id=${privilegeCode || appCode}]`) as HTMLLIElement
    clickElement && clickElement.click()
}


export function getMainTabChildNodes() {
    const ulMain = document.getElementById('nabTabsBox') as HTMLUListElement
    const childrens = ulMain.children
    return childrens
}


export function closeMenu(data) {
    const { appCode } = data
    const nodes = getMainTabChildNodes()
    const removeItem: HTMLLIElement = nodes[`tabId_${appCode}`] || nodes[appCode]
    if (removeItem) {
        removeItem.getElementsByTagName('a')[0].click()
    }
}
