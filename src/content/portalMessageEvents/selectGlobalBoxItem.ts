export function selectGlobalBoxItem(data:any){
   const li= document.querySelector(`[title=${data.title}]`) as HTMLLIElement
   console.log('lieee',li)
   li&&li.click()
}
export function getGlobalBoxItems(sendResponse){
    console.log('get global box items',sendResponse)
    const interval =setInterval(()=>{
        const h5s= document.getElementsByTagName('h5')
        if(h5s.length>0){
            // console.log('h5s',h5s)
            const lis=h5s[0].parentElement?.getElementsByTagName('li')
            console.log('lis',lis)
            const returnTitle=[]
            let defaultTitle=''
            Array.from(lis).forEach((li:any)=>{
                returnTitle.push(li.title)
                if(li.classList.length>0){
                    defaultTitle=li.title
                }
            })
            sendResponse({titleArr:returnTitle,defaultTitle})
            clearInterval(interval)
        }
    },500)
}