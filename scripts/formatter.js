var api_key_id = "115ab4a2e828a6e6bed9264cdf83d5e1";
var debug_token_id = "1b032f832ea0f1c9520a07b763a83839d07138d4a0dfd2717e41e6c9b7197fa9";
var listDoneId = "5daeb00aff2adf7bbbdce4c2";

function GetCardNamesFromDone() {
    GetCardsForFormatting(listDoneId, HandleCardNames);
}

function SendRequestForFormatting(url, callback)
{
    var http = new XMLHttpRequest();

    http.onreadystatechange = callback;
    http.open("GET", url, true);
    http.send(null);
}

function GetCardsForFormatting(listId, callback) {
    var url = "https://api.trello.com/1/lists/" + listId + "/cards?fields=name,labels&key=" + api_key_id + "&token=" + debug_token_id;
    SendRequestForFormatting(url, callback);
}

function HandleCardNames() {
    if (this.readyState == 4 && this.status == 200) {

        debug("HandleCardNames");

        var json = JSON.parse(this.responseText);

        for (var i = 0; i < json.length; i++) {

            var info = "";
            info += json[i]['name'];
            info += " ";

            for (var j = 0; j < json[i]['labels'].length; j++) {
                info += json[i]['labels'][j].name;
            }

            debug(info);
        }
    }
}