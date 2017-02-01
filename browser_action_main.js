//Globals
 var pageShowing = 'main';

//Functions
function isIDvalid(param)
{
    if ((param.length != 11) || (param.indexOf(" ") > -1) || (param.indexOf(".") > -1)
        || (param.indexOf(":") > -1) || (param.indexOf("\"") > -1) || (param.indexOf(")") > -1) || (param.indexOf("(") > -1))
    {
        return false;
    }
    else return true;

}

function showNormalLinks (youtubeNormalLinks)
{
    if (youtubeNormalLinks != null)
    {
        var length = youtubeNormalLinks.length;

        var result = '<li class="collection-header" style="list-style-type: none; padding-top: 5px; padding-bottom: 5px"><h5 style="margin: 0px 0px 0px 0px;">Linked Youtube Videos</h5></li>';
        for (var i = 0; i < length; i++) {
            result += '<a href="'
                    + youtubeNormalLinks[i]
                    +'" class="collection-item red-text linkURL" style="padding-top: 0px; padding-bottom: 0px;">'
                    +  youtubeNormalLinks[i]
                    + '</a>';
        }

        $("#youtubeLinks").empty(); //first clear the defaults
        $("#youtubeLinks").prepend(result);
        $(".linkURL").click(visitLink); //must hook event listeners AFTER writing links in page
        $(".linkURL").hover(scrollToTextLink);

    }
    else
    {

    }
}

function showEmbeddedLinks (youtubeEmbeddedLinks)
{
    if (youtubeEmbeddedLinks != null)
    {
        var length = youtubeEmbeddedLinks.length;

        var result = '<li class="collection-header" style="list-style-type: none; padding-top: 5px; padding-bottom: 5px"><h5 style="margin: 0px 0px 0px 0px;">Embedded Youtube Videos</h5></li>';
        for (var i = 0; i < length; i++) {
            result += '<a href="'
                    + youtubeEmbeddedLinks[i]
                    +'" class="collection-item red-text linkURL" style="padding-top: 0px; padding-bottom: 0px;">'
                    + youtubeEmbeddedLinks[i]
                    + '</a>';
        }

        $("#youtubeEmbeds").empty(); //first clear the defaults
        $("#youtubeEmbeds").prepend(result);
        $(".linkURL").click(visitLink); //must hook event listeners AFTER writing links in page
        //$(".linkURL").hover(scrollToEmbed); //TODO
    }
    else
    {

    }
}

function visitLink()
{
    var link = "http://";
    link += $(this).html();
    chrome.tabs.create({ url: link });
}

function manualVisitLink () {
    var video_id = $("#manualVideoID-videoID").val();
    if (isIDvalid(video_id)===true)
    {
        $("#manualVideoID-videoID").removeClass('invalid');
        $("#manualVideoID-videoID").addClass('valid');
        var link = "http://www.playit.pk/watch?v=";
        link += video_id;
        chrome.tabs.create({ url: link });
    }
    else
    {
        $("#manualVideoID-videoID").removeClass('valid');
        $("#manualVideoID-videoID").addClass('invalid');
    }
}

function manualSearch () {
    var query = $("#manualQuery-query").val();
    if (query != "")
    {
        query = encodeURIComponent(query);
        var link = "http://playit.pk/search?q=";
        link += query;
        chrome.tabs.create({ url: link });
    }
    else
    {
        chrome.tabs.create({ url: 'http://playit.pk' });
    }
}

function checkClipboard()
{
    if (document.execCommand('paste')==true) {
        $("#manualVideoID-videoID").focus();
        document.execCommand('paste');

        var clipboardData = $("#manualVideoID-videoID").val();

        if (isIDvalid(clipboardData)===true)
        {
            //let clipboard data stay in textbox
            $("#manualVideoID-videoID").removeClass('invalid');
            $("#manualVideoID-videoID").addClass('valid');
        }
        else //if ID is valid
        {
            //ignore the clipboard data
            $("#manualVideoID-videoID").focus();
            $("#manualVideoID-videoID").val("");
            $("#manualQuery-query").focus(); //focus manual search instead
        }
    }

}

function scrollToTextLink() {
    var needleParam = $(this).html();
    needleParam = needleParam.substring(22,33);
    chrome.tabs.query({
        active: true,
        currentWindow: true
    },
    function(tabs) {
        console.log("browserAction: message sent -> to: content_script, subject: scrollToTextLink");

        chrome.tabs.sendMessage(
                tabs[0].id,
                {from: 'browserAction', subject: 'scrollToTextLink', needle: needleParam
            });
    });
}

function scrollToEmbed() {
    var needleParam = $(this).html();
    needleParam = 'DNS';
    chrome.tabs.query({
        active: true,
        currentWindow: true
    },
    function(tabs) {
        console.log("browserAction: message sent -> to: content_script, subject: scrollToTextLink");

        chrome.tabs.sendMessage(
                tabs[0].id,
                {from: 'browserAction', subject: 'scrollToTextLink', needle: needleParam
            });
    });
}

function hook_nav () {
    $("#info-icon").click(infoPage_toggle);
    $("#share-icon").click(sharePage_toggle);
}

function infoPage_toggle () {
    if (pageShowing == 'info') {
        $("body").css('width','717px');
        $("#share-page").hide();
        $("#info-page").hide();
        $("#main-page").show();

        $("#share-icon").html('<i class="material-icons">thumb_up</i>');
        $("#info-icon").html('<i class="material-icons">info_outline</i>');
        pageShowing = 'main';
    }
    else {
        $("body").css('width','700px');
        $("#main-page").hide();
        $("#share-page").hide();
        $("#info-page").show();

        $("#share-icon").html('<i class="material-icons">thumb_up</i>'); //reset icons
        $("#info-icon").html('<i class="material-icons">info_outline</i>');

        $("#info-icon").html('<i class="material-icons">fast_rewind</i>');
        pageShowing = 'info';
        Materialize.showStaggeredList('#staggered-ul');
        //$(".illustration-img").css('height','auto');
    }
}

function sharePage_toggle () {
    if (pageShowing == 'share') {
        $("body").css('width','717px');
        $("#share-page").hide();
        $("#info-page").hide();
        $("#main-page").show();

        $("#share-icon").html('<i class="material-icons">thumb_up</i>');
        $("#info-icon").html('<i class="material-icons">info_outline</i>');
        pageShowing = 'main';
    }
    else {
        $("body").css('width','717px');
        $("#main-page").hide();
        $("#info-page").hide();
        $("#share-page").show();

        $("#share-icon").html('<i class="material-icons">thumb_up</i>'); //reset icons
        $("#info-icon").html('<i class="material-icons">info_outline</i>');

        $("#share-icon").html('<i class="material-icons">fast_rewind</i>');
        pageShowing = 'share';
    }
}


function copyShareLink ()
{
    var link = "https://chrome.google.com/webstore/detail/playit-now/gobodpbikolgnpkekmniampkcadbgodj";
    $("#share-link").select();
    document.execCommand('copy');
}

function onKeyPress (e) {
    
    if (e.keyCode==13) //enter key
    {
        if($("#manualQuery-query").is(":focus") == true)
        {
            manualSearch();
        }
        else if($("#manualVideoID-videoID").is(":focus") == true)
        {
            manualVisitLink();
        }
    }
}

function animateNameColor () {
    $('#my-name').css('color','#FF0000');
    $('#my-name').css('font-weight','bold');
}

////////////////////////////////////////////////////////////////////////MAIN///////////////////////

/* Once the DOM is ready... */
window.addEventListener('DOMContentLoaded', function() {
    //CODE STARTS HERE

    //button hooks
    $("#manualVideoID-button").click(manualVisitLink);
    $("#manualQuery-button").click(manualSearch);
    $("#copy-share-link").click(copyShareLink);
    hook_nav();
    $("#main-manualVideoID").hover(function(){$("#manualVideoID-videoID").focus();});
    $("#main-manualQuery").hover(function(){$("#manualQuery-query").focus();});
    $("#footer").hover(animateNameColor);

    window.addEventListener("keydown", onKeyPress, true); //hook keyboard interaction

    checkClipboard(); //for any copied valid Youtube video ID

    /* ...query for the active tab... */
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        console.log("browserAction: message sent -> to: content_script, subject: respond with youtubelinks");
        /* ...and send a request for the DOM info... */

        chrome.tabs.sendMessage( //get normal youtube links
                tabs[0].id,
                {from: 'browserAction', subject: 'youtubeNormalLinks'},
                /* ...also specifying a callback to be called 
                 *    from the receiving end (content script) */
                showNormalLinks);

        

        chrome.tabs.sendMessage( //get embedded youtube links
                tabs[0].id,
                {from: 'browserAction', subject: 'youtubeEmbeddedLinks'},
                /* ...also specifying a callback to be called 
                 *    from the receiving end (content script) */
                showEmbeddedLinks);
    });

    
    setTimeout(function() {
            $("#header").css('margin-top', '0px');
            $("#main-linkFetches").css('margin-top', '0px');
            $("#main-manualVideoID").css('margin-top', '0px');
            $("#main-manualQuery").css('margin-top', '0px');
        },10);
});