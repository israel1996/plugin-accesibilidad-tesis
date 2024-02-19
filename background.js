

chrome.tabs.onActivated.addListener(function(activeInfo) {
    applySettingsToTab(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        applySettingsToTab(tabId);
    }
});

function applySettingsToTab(tabId) {
    chrome.tabs.get(tabId, function(tab) {
        if (tab && tab.url && tab.url.startsWith('http')) {
            chrome.storage.sync.get(['fontSize', 'buttonSize', 'lineHeight'], function(data) {
                if (data.fontSize) {
                    sendMessageToTab(tab.id, { action: "changeFontSize", fontSize: data.fontSize });
                }
                if (data.buttonSize) {
                    sendMessageToTab(tab.id, { action: "changeButtonSize", buttonSize: data.buttonSize });
                }
                if (data.lineHeight) {
                    sendMessageToTab(tab.id, { action: "changeLineHeight", lineHeight: data.lineHeight });
                }
            });
        }
    });
}

function sendMessageToTab(tabId, message) {
    chrome.tabs.sendMessage(tabId, message, function(response) {
        if (chrome.runtime.lastError) {
            // Manejar el error o ignorarlo
            console.log("Error al enviar mensaje: ", chrome.runtime.lastError.message);
        }
    });
}
