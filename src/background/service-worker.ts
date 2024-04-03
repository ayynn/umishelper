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
})