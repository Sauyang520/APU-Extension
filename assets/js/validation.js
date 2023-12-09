// To ensure the disclaimer is checked
function checkDisclaimer() {
    return document.getElementById("disclaimer").checked;
}

// Popup Notice
function showNotice(msg) {
    document.getElementById('msg-text')
        .innerHTML = msg
    document.getElementById('shim')
        .style.display = 'block'
    document.getElementById('shim')
        .style.height = document.body && document.body.scrollHeight ? document.body.scrollHeight + 'px' : '100%';
    document.getElementById('msgbx')
        .style.display = 'block'
}

// To ensure TradingView is opened
function checkTradingView(callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        let condition = false;
        if (!tabs[0].url.includes('tradingview.com')) {
            showNotice('Please open <a href="https://www.tradingview.com/chart" target="_blank">Tradingview Strategy</a>.');
        } else if (!tabs[0].url.startsWith('https://www.tradingview.com') && !tabs[0].url.startsWith('https://en.tradingview.com')) {
            showNotice('Please change the language to English. <a href="https://en.tradingview.com/chart" target="_blank">Change to English</a>.');
        } else {
            condition = true;
        }
        callback(condition);
    });
}

// Close the Notice
document.getElementById('closeMsg').addEventListener('click', function () {
    document.getElementById('shim')
        .style.display = 'none'
    document.getElementById('msgbx')
        .style.display = 'none';
});