export function showFrame(contentIframe) {
    contentIframe.style.display = 'block'
    setTimeout(() => {
        contentIframe.style.opacity = '1'
        contentIframe.style.transform = 'translateX(0%)'
    }, 100);
}
export function hideFrame(contentIframe) {
    setTimeout(() => {
        contentIframe.style.display = 'none'
    }, 500);
    contentIframe.style.opacity = '0'
    contentIframe.style.transform = 'translateX(-100%)'
}