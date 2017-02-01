chrome.runtime.onMessage.addListener(function(msg, sender) {
    /* First, validate the message's structure */
    if ((msg.from === 'content_script') && (msg.subject === 'showPageAction')) {
    	console.log("message received from popup: setting pageAction");
        /* Enable the page-action for the requesting tab */
        chrome.pageAction.show(sender.tab.id);
    }
});