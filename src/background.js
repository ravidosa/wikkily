var db, transaction, objectStore;
const request = indexedDB.open("wikkily", 3);
request.onerror = (event) => {
    console.error("Why didn't you allow wikkily to use IndexedDB?!");
    console.error(`Connection error: ${event.target.errorCode}`);
};
request.onsuccess = (event) => {
    db = event.target.result;
    db.onerror = (event) => {
        // Generic error handler for all errors targeted at this database's
        // requests!
        console.error(`Database error: ${event.target.errorCode}`);
    };
    function handleClick() {
        transaction = db.transaction(["links"], "readwrite");
        transaction.onerror = (event) => {
            console.error(`Transaction error: ${event.target.errorCode}`);
        };
        objectStore = transaction.objectStore("links");
        var allItemsRequest = objectStore.getAll();
        allItemsRequest.onsuccess = function () {
            var all_items = allItemsRequest.result;
            console.log(all_items);
            // save items as JSON file
            var bb = new Blob([JSON.stringify(all_items)], { type: "text/plain" });
            var a = document.createElement("a");
            a.download = `links_${Date.now()}.json`;
            a.href = window.URL.createObjectURL(bb);
            a.click();
            objectStore.clear();
        };
    }
    function handleMessage(request, sender, sendResponse) {
        if (request.in_url && request.out_url) {
            transaction = db.transaction(["links"], "readwrite");
            transaction.onerror = (event) => {
                console.error(`Transaction error: ${event.target.errorCode}`);
            };
            objectStore = transaction.objectStore("links");
            objectStore.add([request.in_url, request.out_url]);
        }
    }
      
    browser.runtime.onMessage.addListener(handleMessage);
    browser.browserAction.onClicked.addListener(handleClick);
};
request.onupgradeneeded = (event) => {
    // Save the IDBDatabase interface
    db = event.target.result;

    // Create an objectStore for this database
    objectStore = db.createObjectStore("links", { autoIncrement: "true" });
    db.close();

};