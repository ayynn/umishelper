console.log('this is service worker file')
chrome.management.getSelf(self => {
    // if (self.installType === 'development') {
    //     // 监听的文件列表
    //     const fileList = [
    //         'http://127.0.0.1:5500/dist/manifest.json',
    //         'http://127.0.0.1:5500/dist/popup/popup.js',
    //         'http://127.0.0.1:5500/dist/background/service-worker.js',
    //         'http://127.0.0.1:5500/dist/content/content.js',
    //         'http://127.0.0.1:5500/dist/contentPage/contentPage.js'
    //     ]
    //     // 文件列表内容字段
    //     const fileObj: {
    //         [prop: string]: string
    //     } = {}
    //     /**
    //      * reload 重新加载
    //      */
    //     const reload = () => {
    //         chrome.tabs.query(
    //             {
    //                 active: true,
    //                 currentWindow: true
    //             },
    //             (tabs: chrome.tabs.Tab[]) => {
    //                 console.log('tab in reload', tabs)
    //                 if (tabs[0]) {
    //                     chrome.tabs.reload(tabs[0].id);
    //                 }
    //                 // 强制刷新页面
    //                 chrome.runtime.reload();
    //             }
    //         );
    //     };

    //     /**
    //      * 遍历监听的文件，通过请求获取文件内容，判断是否需要刷新
    //      */
    //     const checkReloadPage = () => {
    //         fileList.forEach((item) => {
    //             fetch(item).then((res) => res.text())
    //                 .then(files => {
    //                     if (fileObj[item] && fileObj[item] !== files) {
    //                         reload()
    //                     } else {
    //                         fileObj[item] = files
    //                     }
    //                 })
    //                 .catch(error => {
    //                     console.error('Error checking folder changes:', error);
    //                 });
    //         })
    //     }

    //     // setInterval(() => {
    //     //   checkReloadPage()
    //     // }, 1000)

    //     /**
    //      * 设置闹钟(定时器)
    //      */
    //     // 闹钟名称
    //     const ALARM_NAME = 'LISTENER_FILE_TEXT_CHANGE';
    //     /**
    //      * 创建闹钟
    //      */
    //     const createAlarm = async () => {
    //         const alarm = await chrome.alarms.get(ALARM_NAME);
    //         if (typeof alarm === 'undefined') {
    //             chrome.alarms.create(ALARM_NAME, {
    //                 periodInMinutes: 0.1
    //             });
    //             checkReloadPage();
    //         }
    //     }
    //     createAlarm();
    //     // 监听闹钟
    //     chrome.alarms.onAlarm.addListener(checkReloadPage);
    // }


    // const ALARM_NAME = 'LISTENER_FILE_TEXT_CHANGE';
    // const now = Date.now()
    // /**
    //  * 创建闹钟
    //  */
    // const createAlarm = async () => {
    //     const alarm = await chrome.alarms.get(ALARM_NAME);
    //     if (typeof alarm === 'undefined') {
    //         chrome.alarms.create(ALARM_NAME, {
    //             periodInMinutes: 0.1
    //         });
    //     }
    // }
    // createAlarm();
    // function onAlarmEvent() {
    //     console.log('on alarm', Date.now() - now)
    // }
    // chrome.alarms.onAlarm.addListener(onAlarmEvent);
})

export const enum ContextMenuEvents {
    UMIS_GPT_SEARCH = 'UMIS_GPT_SEARCH',
    TTS_READ = 'TTS_READ',
}

// 监听菜单项点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log('contextmenu click', info, tab)
    const { menuItemId } = info
    if (menuItemId === ContextMenuEvents.UMIS_GPT_SEARCH) {
        // 可以通过 sendMessage 将信息发送到content_script.js处理 或 在此处处理
        chrome.tabs.sendMessage(tab.id, { type: 'UMIS_GPT_SEARCH', selectedText: info.selectionText });
    } else if (menuItemId === ContextMenuEvents.TTS_READ) {
        chrome.tts.speak(info.selectionText, {
            lang: 'zh-CN',
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0
        })
    }
});

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        "id": ContextMenuEvents.UMIS_GPT_SEARCH,
        "title": "使用UMIS-GPT搜索",
        "contexts": ["selection"]  // all 右键菜单都会显示，page 仅页面菜单会显示，selection 仅选中文本右键菜单显示，link 链接右键菜单显示，image 图片右键菜单显示，audio 音频，video视频，editable编辑
    });
    chrome.contextMenus.create({
        "id": ContextMenuEvents.TTS_READ,
        "title": "语音阅读",
        "contexts": ["selection"]  // all 右键菜单都会显示，page 仅页面菜单会显示，selection 仅选中文本右键菜单显示，link 链接右键菜单显示，image 图片右键菜单显示，audio 音频，video视频，editable编辑
    });
    // chrome.contextMenus.create({
    //     "id": "en_translate",
    //     "title": "翻译成英文",
    //     "contexts": ["selection"]
    // });
});