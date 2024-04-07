import { toggleHelper } from "./portalMessageEvents/toggleHelper"

export function replaceMenuButton(){
    const startTime=Date.now()
    const interval=setInterval(()=>{
        const menuButton = document.querySelector('[title="应用"]') as HTMLLIElement
        if(menuButton||Date.now()-startTime>10000){
            clearInterval(interval)
            console.log(menuButton)
            const clonedElement=menuButton.cloneNode(true) as Element
            menuButton.insertAdjacentElement('beforebegin',clonedElement)
            menuButton.remove()
            clonedElement.addEventListener('click',e=>{
                e.preventDefault()
                toggleHelper()
            })
            
        }
    },500)
}