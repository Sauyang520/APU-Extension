// Collect the parameters from TradingView
function getParameter() {
    let results = [];
    document.querySelectorAll('.cell-tBgV1m0B.first-tBgV1m0B').forEach(cell => {
        let labelText = cell.querySelector('.inner-tBgV1m0B').textContent;
        let valueElement = cell.nextElementSibling.querySelector('input.input-RUSovanF');

        if (valueElement) {
            let value = valueElement.value;
            results.push([labelText, value]);
        }
    });
    console.log(results);
    return results;
}

function sanitizeFilename(filename) {
    return filename.replace(/\//g, '-').replace(/[^a-zA-Z0-9\-_ ]/g, '');  // replace '/' with '-' and remove other non-alphanumeric characters except underscore and space
}

// Convert the extracted data into csv format
function convertToCSVFormat(data) {
    // Convert to CSV
    let content = 'Parameter,Start,End,Step,Priority\n';

    let start = 1;
    let end = 10;
    let step = 1;
    let priority = 1;
    for (let i in data) {
        const row = [
            data[i][0],                // Parameter
            start,                // Start
            end,               // End
            step,                // Step
            // data[key],          // Default
            priority // Priority
        ];
        content += row.join(',') + '\n';
        priority += 1;
    }

    return content;
}

// Download the Parameter
function downloadCSV(csvString, fileName) {
    const blob = new Blob([csvString], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
        url: url,
        filename: fileName,
        conflictAction: 'uniquify',
        saveAs: true
    });

    URL.revokeObjectURL(url);  // Cleanup the object URL once done.
}

function get() {
    console.log("getpara clicked");
    clearDataFromChromeStorage();

    if (checkDisclaimer()) {
        checkTradingView(async function (condition) {
            if (condition) {
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    const tabId = tabs[0].id;

                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        function: function () {
                            const coinElement = document.querySelector('div.js-button-text.text-GwQQdU8S.text-cq__ntSC');
                            const coinName = coinElement ? coinElement.textContent.trim() : "DefaultCoinName";

                            const strategyElement = document.querySelector('.ellipsis-BZKENkhT');
                            const strategyName = strategyElement ? strategyElement.textContent.trim() : "DefaultStrategyName";

                            const timeFrameElement = document.querySelector('.menuContent-S_1OCXUK.wrap-n5bmFxyX .value-gwXludjS');
                            const timeFrame = timeFrameElement ? timeFrameElement.textContent.trim() : "DefaultTimeFrame";

                            return {coinName, strategyName, timeFrame};
                        }
                    }, ([data]) => {
                        if (data && data.result) {
                            const {coinName, strategyName, timeFrame} = data.result;
                            const fileName = sanitizeFilename(`${coinName}_${strategyName}_${timeFrame}`);

                            chrome.scripting.executeScript({
                                target: {tabId: tabId},
                                function: getParameter
                            }, (results) => {
                                if (results && results[0] && results[0].result) {
                                    if (Object.keys(results[0].result).length === 0 && results[0].result.constructor === Object) {
                                        showNotice("Please open parameter setting.");
                                    } else {
                                        console.log(JSON.stringify(results[0].result, null, 2));
                                        let csv = convertToCSVFormat(results[0].result);
                                        console.log(fileName);
                                        downloadCSV(csv, `${fileName}.csv`);
                                        console.log(JSON.stringify(csv, null, 2));
                                    }
                                } else {
                                    showNotice("No result found.");
                                }
                            });
                        } else {
                            showNotice("Failed to fetch required data.");
                        }
                    });
                });
            }
        });
    } else {
        showNotice('Please accept the terms & conditions before using this extension.');
    }
}