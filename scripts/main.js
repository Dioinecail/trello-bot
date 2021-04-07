var api_key = "115ab4a2e828a6e6bed9264cdf83d5e1";
var debug_token = "1b032f832ea0f1c9520a07b763a83839d07138d4a0dfd2717e41e6c9b7197fa9";
var targetBoardId = "5f5f6f3516a5a0105a658650";
var targetListListId = "5f5f6f5f2428ed677c7b4a7e";
var targetListPauseId = "5f5f6f4cec65fc1ae5630cf8";
var targetListInProgressId = "5f5f6f6d91b12b0f65b2cbca";
var targetListDoneId = "5daeb00aff2adf7bbbdce4c2";

var targetMemberId = "595ca87d02513ca194ca4a2c";

var debugBoardId = "602f96594801c60b6cb5c51c";
var debugList1Id = "602f968da5017f0bafddd8e6";
var debugList2Id = "602f969a21d0a08d91522b02";
var debugCard1Id = "606b34e4d339918fdbedab87";
var debugCard2Id = "606b34e9356874492a22893c";

var isSendingRequests = false;



function MoveCardToList1() {
    MoveCardToList(debugCard1Id, debugList1Id);
}

function MoveCardToList2() {
    MoveCardToList(debugCard1Id, debugList2Id);
}

function StartSendingDebugRequests() {
    MoveCardsFromInProgress();
    if (isSendingRequests)
        return;

    isSendingRequests = true;
    //setInterval(SendDebugRequest, 1000);
}

function SendDebugRequest()
{
    if (CheckDate()) {
        GetBoards();
    }
    else {
        debug("Now is not the time for this shit!");
    }
    //GetLists(debugBoardId);
    //GetCards(debugList1Id);
    //GetCards(debugList2Id);
}

function SendRequest(url, callback)
{
    var http = new XMLHttpRequest();

    http.onreadystatechange = callback;
    http.open("GET", url, true);
    http.send(null);
}

function CheckDate() {
    let currentDate = new Date();
    let cHours = currentDate.getHours();
    let cMinutes = currentDate.getMinutes();

    return (cHours > 18) && (cMinutes > 29);
}

function SendPutRequest(url, callback) {
    var http = new XMLHttpRequest();

    http.onreadystatechange = callback;
    http.open("PUT", url, true);
    http.send(null);
}

function GetBoards() {
    debug("GetBoards");
    var url = "https://api.trello.com/1/members/me/boards?fields=name&key=" + api_key + "&token=" + debug_token;
    SendRequest(url, HandleBoardsRequest);
}

function GetLists(boardId) {
    debug("GetLists: " + boardId);

    var url = "https://api.trello.com/1/boards/"+ boardId + "/lists?&key=" + api_key + "&token=" + debug_token;
    SendRequest(url, HandleListsRequest);
}

function GetCards()
{
    debug("GetCards");

    GetCards(targetListListId);
    GetCards(targetListPauseId);
    GetCards(targetListInProgressId);
    GetCards(targetListDoneId);
}

function GetCards(listId, callback) {
    var url1 = "https://api.trello.com/1/lists/" + listId + "/cards?fields=name,idMembers&key=" + api_key + "&token=" + debug_token;
    SendRequest(url1, callback);
}

function HandleCardsRequest()
{
    if (this.readyState == 4 && this.status == 200) {
        debug("HandleCardsRequest");

        var json = JSON.parse(this.responseText);

        for (var i = 0; i < json.length; i++) {
            if (json[i].idMembers.includes(targetMemberId))
                debug(json[i]);
        }
    }
}

function HandleCardsMoveRequest() {
    if (this.readyState == 4 && this.status == 200) {

        debug("HandleCardsMoveRequest");

        var foundCards = new Array();

        var json = JSON.parse(this.responseText);

        for (var i = 0; i < json.length; i++) {
            if (json[i].idMembers.includes(targetMemberId)) {
                foundCards.push(json[i]);
            }
        }

        if (foundCards.length > 0) {
            MoveFoundCardsToList(foundCards, targetListPauseId);
        }
    }
}

function MoveFoundCardsToList(cards, listId) {
    for (var i = 0; i < cards.length; i++) {

        debug("MoveFoundCardsToList");
        debug(cards[i]);

        let index = i;
        MoveCardToList(cards[index], listId);
    }
}

function MoveCardToList(card, listId) {
    debug("MoveCardToList:" + card.name)
    var url = "https://api.trello.com/1/cards/" + card.id + "?idList="+ listId +"&key=" + api_key + "&token=" + debug_token;
    SendPutRequest(url);
}

function HandleCardMoveRequest() {
    debug("HandleCardMoveRequest");
    if (this.readyState == 4 && this.status == 200) {
        debug("Movement SUCCESS");
    }
}

function HandleBoardsRequest() {
    if (this.readyState == 4 && this.status == 200) {
        debug("HandleBoardsRequest");

        var json = JSON.parse(this.responseText);

        debug(json);
    }
}

function HandleListsRequest() {
    if (this.readyState == 4 && this.status == 200) {
        debug("HandleListsRequest");

        var json = JSON.parse(this.responseText);

        debug(json);
    }
}

function debug(info) {

    console.log(info);

    txt = document.createTextNode(info);
    newline = document.createElement("div");
    document.getElementsByClassName("info")[0].appendChild(newline);
    document.getElementsByClassName("info")[0].appendChild(txt);
}

function MoveCardsFromInProgress() {
    // find cards that are inside InProgress list
    // move these cards to InPause list
    GetCards(targetListInProgressId, HandleCardsMoveRequest);
}