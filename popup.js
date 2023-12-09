document.addEventListener("DOMContentLoaded", function () {
    // Get the button element
    document.getElementById("getStartButton").addEventListener("click", function() {
        // Get the "Backtest Strategy" tab link and simulate a click
        var tabLink = document.querySelector('a[href="#tab-2"]');
        tabLink.click();
        window.scrollTo(0, 0);
    });

// Get Parameter Button
    document.getElementById('getpara').addEventListener('click', function (event) {
        get();
    });

// Upload Parameter Button
    document.getElementById('csvinput').addEventListener('click', function (event) {
        console.log('csvinput clicked');
        clearDataFromChromeStorage();
        document.getElementById('hiddenFileInput').value = ''
        document.getElementById('hiddenFileInput').click();
    });

    document.getElementById('hiddenFileInput').addEventListener('change', function (event) {
        console.log('hiddenFileInput changed');
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const csvData = e.target.result;
                    const parameters = parseCSV(csvData);

                    // Save parsed parameters to Chrome storage
                    saveToChromeStorage(parameters);

                } catch (error) {
                    console.error('Error processing the file:', error);
                    alert('There was an error processing the CSV file.\nError: ' + error.message);
                }
            };

            reader.onerror = function () {
                alert('Error reading the file.');
            };

            reader.readAsText(file);
        }
    });

    // Test Strategy Button
    document.getElementById('teststra').addEventListener('click', function (event) {
        run();
    });
});
