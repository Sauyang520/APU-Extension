function saveToChromeStorage(data) {
    chrome.storage.local.set({'csvData': data}, function () {
        if (chrome.runtime.lastError) {
            console.error("Error saving to Chrome storage:", chrome.runtime.lastError);
        } else {
            console.log(data)
            console.log("Data saved to Chrome storage successfully!");
        }
    });
}

function parseCSV(data) {
    const rows = data.split('\n');
    const result = [];

    for (let i = 1; i < rows.length; i++) {
        const currentRow = rows[i].split(',').map(value => value.trim()); // Trim to remove any leading/trailing spaces
        result.push(currentRow);
    }
    result.pop();
    return result;
}

function clearDataFromChromeStorage() {
    chrome.storage.local.remove('csvData', function () {
        if (chrome.runtime.lastError) {
            console.error("Error clearing data from Chrome storage:", chrome.runtime.lastError);
        } else {
            console.log("Data cleared from Chrome storage successfully!");
        }
    });
}