// Retrieve data from chrome.storage
function retrieveFromStorage(key, callback) {
    chrome.storage.local.get([key], function (result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }
        callback(result[key]);
    });
}

function insertToValue(arrays, currentCombination) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            function: async (arrays, currentCombination) => {
                const array = [];
                for (let i = 0; i < arrays.length; i++) {
                    array.push(arrays[i][0])
                }

                // Initialize a CSV string
                let csv = array.join(",") + "Net Profit: All,Net Profit %: All,Net Profit: Long,Net Profit %: Long,Net Profit: Short," +
                    "Net Profit %: Short,Gross Profit: All,Gross Profit %: All,Gross Profit: Long,Gross Profit %: Long," +
                    "Gross Profit: Short,Gross Profit %: Short,Gross Loss: All,Gross Loss %: All,Gross Loss: Long," +
                    "Gross Loss %: Long,Gross Loss: Short,Gross Loss %: Short,Max Run-up,Max Run-up %,Max Drawdown,Max Drawdown %," +
                    "Buy & Hold Return,Buy & Hold Return %,Sharpe Ratio,Sortino Ratio,Profit Factor: All,Profit Factor: Long," +
                    "Profit Factor: Short,Max Contracts Held: All,Max Contracts Held: Long,Max Contracts Held: Short,Open PL," +
                    "Open PL %,Commission Paid: All,Commission Paid: Long,Commission Paid: Short,Total Closed Trades: All," +
                    "Total Closed Trades: Long,Total Closed Trades: Short,Total Open Trades: All,Total Open Trades: Long," +
                    "Total Open Trades: Short,Number Winning Trades: All,Number Winning Trades: Long,Number Winning Trades: Short," +
                    "Number Losing Trades: All,Number Losing Trades: Long,Number Losing Trades: Short,Percent Profitable: All," +
                    "Percent Profitable: Long,Percent Profitable: Short,Avg Trade: All,Avg Trade %: All,Avg Trade: Long," +
                    "Avg Trade %: Long,Avg Trade: Short,Avg Trade %: Short,Avg Winning Trade: All,Avg Winning Trade %: All," +
                    "Avg Winning Trade: Long,Avg Winning Trade %: Long,Avg Winning Trade: Short,Avg Winning Trade %: Short," +
                    "Avg Losing Trade: All,Avg Losing Trade %: All,Avg Losing Trade: Long,Avg Losing Trade %: Long,Avg Losing Trade: Short," +
                    "Avg Losing Trade %: Short,Ratio Avg Win / Avg Loss: All,Ratio Avg Win / Avg Loss: Long,Ratio Avg Win / Avg Loss: Short," +
                    "Largest Winning Trade: All,Largest Winning Trade %: All,Largest Winning Trade: Long,Largest Winning Trade %: Long," +
                    "Largest Winning Trade: Short,Largest Winning Trade %: Short,Largest Losing Trade: All,Largest Losing Trade %: All," +
                    "Largest Losing Trade: Long,Largest Losing Trade %: Long,Largest Losing Trade: Short,Largest Losing Trade %: Short," +
                    "Avg # Bars in Trades: All,Avg # Bars in Trades: Long,Avg # Bars in Trades: Short,Avg # Bars in Winning Trades: All," +
                    "Avg # Bars in Winning Trades: Long,Avg # Bars in Winning Trades: Short,Avg # Bars in Losing Trades: All," +
                    "Avg # Bars in Losing Trades: Long,Avg # Bars in Losing Trades: Short,Margin Calls: All,Margin Calls: Long," +
                    "Margin Calls: Short," + "\n";


                // Select the div with the class "js-rootresizer__contents"
                const rootresizerContents = document.querySelector('.js-rootresizer__contents');

                // Check if the div exists
                if (rootresizerContents) {
                    // Create the shim and message box elements
                    const shimElement = document.createElement('div');
                    shimElement.id = 'shim';

                    const msgContainerElement = document.createElement('div');
                    msgContainerElement.id = 'msg-container';

                    msgContainerElement.innerHTML = `
    <div class="msg-header">
      <h5 class="popup-title">Testing Strategy</h5>
    </div>
    <p id="msg-text"></p>
    <div class="msg-action">
      <button id="closeMsg" class="popup-button">Stop</button>
    </div>
  `;

                    // Append the shim and message box elements to the "js-rootresizer__contents" div
                    rootresizerContents.appendChild(shimElement);
                    rootresizerContents.appendChild(msgContainerElement);

                    // Add the CSS code to a new style element in the head of the web page
                    const styleElement = document.createElement('style');
                    styleElement.innerHTML = `
body {
    color-scheme: light; /* Suggest the page is optimized for light mode */
}

#shim {
    opacity: .75;
    filter: alpha(opacity=75);
    background: #B8B8B8;
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100%;
    width: 100%;
    z-index: 990;
}

#msg-container {
  background-color: #FFFFFF; /* Explicitly set to white */
  color: #000000; /* Explicitly set to black */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  max-width: 800px;
  max-height: 600px;
  border: 1px solid #ccc;
  box-shadow: 3px 3px 7px #777;
  -webkit-box-shadow: 3px 3px 7px #777;
  -moz-border-radius: 15px;
  -webkit-border-radius: 15px;
  z-index: 999;
}

.msg-header {
  padding: 5px 15px;
  text-align: center;
  font-size: 125%;
}

.popup-title {
    font-size: 30px;
    font-weight: bold;
    font-family: 'Roboto', sans-serif;
    margin: 0px 0px 16px;
}

#msg-text {
    text-align: center;
    max-width: 760px;
    max-height: 560px;
    word-wrap: break-word;
    overflow: hidden;
    font-size: 20px;
    font-family: 'Roboto', sans-serif;
    margin: 0px 0px 16px;
}

.msg-action {
    margin: 0px;
}

.popup-button {
    font-size: 20px;
    font-family: 'Roboto', sans-serif;
    padding: 8px 24px;
    margin: 0px;
    background-color: #000000;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.popup-button:hover {
    background-color: #333333;
}

@media (prefers-color-scheme: dark) {
    #msg-container {
        background-color: #FFFFFF; /* Explicitly set to white */
        color: #000000; /* Explicitly set to black */
    }
}
  `;

                    // Append the style element to the head of the document
                    document.head.appendChild(styleElement);
                }

                const shimElement = document.getElementById('shim');
                const msgContainerElement = document.getElementById('msg-container');
                const stopButton = document.getElementById('closeMsg')
                const msg = document.getElementById("msg-text");

                let stopClicked = false;

                stopButton.addEventListener('click', function (event) {
                    stopClicked = true;

                    shimElement.parentNode.removeChild(shimElement);
                    msgContainerElement.parentNode.removeChild(msgContainerElement);
                });

                for (let i = 0; i < currentCombination.length; i++) {
                    if (stopClicked) {
                        break;
                    }

                    msg.innerHTML = '';

                    console.log(currentCombination[i]);
                    for (const cell of document.querySelectorAll('.cell-tBgV1m0B.first-tBgV1m0B')) {
                        let labelText = cell.querySelector('.inner-tBgV1m0B').textContent;
                        let valueElement = cell.nextElementSibling.querySelector('input.input-RUSovanF');

                        if (valueElement) {
                            for (let j = 0; j < array.length; j++) {
                                if (labelText === array[j]) {
                                    // Set the input value
                                    valueElement.value = currentCombination[i][j];
                                    msg.innerHTML += `<br>${array[j]}: ${currentCombination[i][j]}`;

                                    // Trigger an input event
                                    const inputEvent = new Event('input', {bubbles: true});
                                    valueElement.dispatchEvent(inputEvent);

                                    // Dispatch the change event
                                    const changeEvent = new Event('change', {bubbles: true});
                                    valueElement.dispatchEvent(changeEvent);

                                    let enterKeyEvent = new KeyboardEvent('keydown', {
                                        bubbles: true,
                                        cancelable: true,
                                        key: 'Enter',
                                        keyCode: 13
                                    });

                                    // Dispatch the key press event on the input element
                                    valueElement.dispatchEvent(enterKeyEvent);
                                }
                            }
                        }
                    }
                    // Introduce a delay of 1 second (1000 milliseconds) using async/await
                    await new Promise(resolve => setTimeout(resolve, 3000));

                    // Get all elements with the specified class name
                    const elements = document.querySelectorAll(".ka-cell.cell-a4wW8zoD.cellSmallPadding-a4wW8zoD");

                    // Loop through the elements and add their values to the CSV string
                    for (let i = 0; i < elements.length; i++) {
                        const element = elements[i];

                        // Check if the element has the class "titleContainer-a4wW8zoD"
                        if (!element.querySelector(".titleContainer-a4wW8zoD") && element.textContent.trim() !== "") {
                            const text = element.textContent.trim(); // Get the text content of the element and trim any leading/trailing whitespace
                            csv += text + ","; // Add the value to the CSV string
                        }
                    }
                    csv = currentCombination[i].join(",") + csv +  "\n";
                }

                csv = csv.replaceAll(" USDT", ",").replaceAll(" ", "")
                    .replaceAll(/,,/g, ',').replaceAll("−", "-")
                console.log(csv)

                const coinElement = document.querySelector('div.js-button-text.text-GwQQdU8S.text-cq__ntSC');
                const coinName = coinElement ? coinElement.textContent.trim() : "DefaultCoinName";

                const strategyElement = document.querySelector('.ellipsis-BZKENkhT');
                const strategyName = strategyElement ? strategyElement.textContent.trim() : "DefaultStrategyName";

                const timeFrameElement = document.querySelector('.menuContent-S_1OCXUK.wrap-n5bmFxyX .value-gwXludjS');
                const timeFrame = timeFrameElement ? timeFrameElement.textContent.trim() : "DefaultTimeFrame";

                const fileName = `Result_${coinName}_${strategyName}_${timeFrame}.csv`
                    .replaceAll(/\//g, '-').replaceAll(/[^a-zA-Z0-9\-_ ]/g, '');

                console.log("======================================================================")
                console.log("Start Download...")
                const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');

                a.style.display = 'none';
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log(`Download Successful!: ${fileName}`)

                shimElement.parentNode.removeChild(shimElement);
                msgContainerElement.parentNode.removeChild(msgContainerElement);
                console.log("Close Shim.")
            },
            args: [arrays, currentCombination]
        });
    });
}

function generateCombinations(arrays, currentIndex = 0, currentCombination = []) {
    const combinations = []; // Array to store combinations

    if (currentIndex === arrays.length) {
        // Base case: We've reached the end of the arrays, so print the current combination.
        combinations.push([...currentCombination]);
    } else {
        const currentArray = arrays[currentIndex];
        // console.log(currentArray)
        const parameter = currentArray[0];
        const start = parseFloat(currentArray[1]);
        const end = parseFloat(currentArray[2]);
        const increment = parseFloat(currentArray[3]);

        for (let i = start; i <= end; i += increment) {
            // Add the current value to the current combination.
            currentCombination.push(i.toFixed(1));

            // Recursive call to generate combinations for the next array and concatenate the results.
            combinations.push(...generateCombinations(arrays, currentIndex + 1, currentCombination));

            // Remove the last value from the combination to backtrack.
            currentCombination.pop();
        }
    }

    return combinations;
}

function run() {
    const inputData = []
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            function: function () {
                const performanceSummary = document.getElementById('Performance Summary');
                if (performanceSummary) {
                    performanceSummary.click(); // Simulate a button click
                }
            }
        });
    });
    retrieveFromStorage('csvData', function (data) {
        let allCombinations;
        if (data) {
            // Sort sampleData by priority in descending order
            data.sort((a, b) => b[4] - a[4]);
            allCombinations = generateCombinations(data);
            showNotice("Testing strategy...")
            insertToValue(data, allCombinations)
            clearDataFromChromeStorage()
        } else {
            showNotice('No data found in storage for the given key.');
        }
    });
}