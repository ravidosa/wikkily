const regex = /.*:\/\/.*\.wikipedia\.org\/wiki\/.*/g;

if (regex.test(document.referrer) === true) {
    in_url = document.referrer.split('/').slice(-1).pop();
    out_url = location.pathname.split('/').slice(-1).pop();
    link = [in_url, out_url];
    browser.runtime.sendMessage({"in_url": in_url, "out_url": out_url});
}

else {
    url = location.pathname.split('/').slice(-1).pop();
    link = [url, url];
    browser.runtime.sendMessage({"in_url": url, "out_url": url});
}