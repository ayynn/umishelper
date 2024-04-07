import { FRAMEID } from "./portalListeners";
import { toggleHelper } from "./portalMessageEvents/toggleHelper";

export function createFloatingActionButton() {
    const floatingActionButtonId = 'floating-action-button'
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
        toggleHelper()
    })
    document.body.appendChild(floatingActionButton);
    document.body.appendChild(styleSheet);
}
