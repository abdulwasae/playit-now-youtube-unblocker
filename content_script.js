//Functions
function isLinkValid(linkParam, typeParam)
{
    if (typeParam == "normal") {
        if ((linkParam.indexOf(" ") > -1) || (linkParam.indexOf(".") > 23))
        {
            return false;
        }
        else return true;
    }

    if (typeParam == "embedded") {
        if ((linkParam.indexOf(" ") > -1) || (linkParam.indexOf(".") > 21))
        {
            return false;
        }
        else return true;
    }

}


//MAIN
/* Inform the background page that 
 * this tab should have a page-action */
chrome.runtime.sendMessage( { from: 'content_script', subject: 'showPageAction' } );

console.log("content_script: message sent to background: set pageAction");


/* Listen for message from the popup */
chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    /* First, validate the message's structure */
    if ((msg.from === 'browserAction') && (msg.subject === 'youtubeNormalLinks')) {
    	console.log("content_script: message received -> from: browserAction,  subject: youtubeNormalLinks");

        var innerText = document.body.innerText;

        var youtubeNormalLink_regEx = /www\.youtube\.com\/watch\?v=.........../gi; //simplest youtube link form
      
        var youtubeNormalLinks = innerText.match(youtubeNormalLink_regEx);
        console.log("content_script: youtubeNormalLinks extracted: "+ youtubeNormalLinks);

        if (youtubeNormalLinks != null)
        {
            for (var i = 0; i < youtubeNormalLinks.length ; i++) { //error here
               //should not capture invalid/broken ID (spaces or dots in wrong places)
                if (isLinkValid(youtubeNormalLinks[i], "normal"))//TODO
                {
                    youtubeNormalLinks[i] = youtubeNormalLinks[i].replace("youtube.com", "playit.pk");
                }
                else
                {
                    youtubeNormalLinks.splice(i,1); //if contains invalid/broken ID, then remove it
                    i--; //recheck at place 'i'
                }
            }
        }
        console.log("content_script: playitNormalLinks made: "+ youtubeNormalLinks);

        response(youtubeNormalLinks);
    }

//////////////////////////////////////

    if ((msg.from === 'browserAction') && (msg.subject === 'youtubeEmbeddedLinks')) {
        console.log("content_script: message received -> from: browserAction,  subject: youtubeEmbeddedLinks");

        var innerHTML = document.body.innerHTML;

        var youtubeEmbeddedLink_regEx = /www\.youtube\.com\/embed\/.........../gi; //embedded youtube link form

        var youtubeEmbeddedLinks = innerHTML.match(youtubeEmbeddedLink_regEx);
        console.log("content_script: youtubeEmbeddedLinks extracted: "+ youtubeEmbeddedLinks);

        if (youtubeEmbeddedLinks != null)
        {
            for (var i = 0; i < youtubeEmbeddedLinks.length ; i++) { //error here
               //should not capture invalid/broken ID (spaces or dots in wrong places)
                if (isLinkValid(youtubeEmbeddedLinks[i], "embedded"))//TODO
                {
                    youtubeEmbeddedLinks[i] = youtubeEmbeddedLinks[i].replace("youtube.com/embed/", "playit.pk/watch?v=");
                }
                else
                {
                    youtubeEmbeddedLinks.splice(i,1); //if contains invalid/broken ID, then remove it
                    i--; //recheck at place 'i'
                }
            }
        }
        console.log("content_script: playitEmbeddedLinks made: "+ youtubeEmbeddedLinks);

        response(youtubeEmbeddedLinks);
    }

////////////////////////////////////
    if ((msg.from === 'browserAction') && (msg.subject === 'scrollToTextLink')) {
        console.log("content_script: message received -> from: browserAction,  subject: scrollToTextLink, needle: " + msg.needle );

        window.find(msg.needle,false,false,true,false,true); //https://developer.mozilla.org/en-US/docs/Web/API/Window/find
    }
});