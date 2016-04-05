
//http://myjson.com/2go22

var streamers = ["kalanosh", "freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff", "Stiggz1337", "StreamerHouse"];

var displayedData = [];
var streamersData = [];

var lastSearch = "";


//document ready 'main'
$(document).ready(function(){
  //set to true to force update
  getStreamers(streamers);
  $(".search").keyup(filterSearch);
  $(":radio").click(filterStatus);
  var timeoutID = window.setTimeout(reload, [1000*60]);
  
});

//reload func
function reload(){
  getStreamers(streamers);
  var timeoutID = window.setTimeout(reload, [1000*60]);
}

//filter results based on status
function filterStatus(){
  var status = $("input[type=radio]:checked").val();
  
  var newData = streamersData.filter(function(val){
    if (status == "All" || val.status == status )
      return true;


  });
  displayedData = newData;
  updateHTML(newData);
  
  //filter results with search filter if not empty
  if($(".search").val())
    filterSearch();
}


function filterSearch(e){
  var term = $(".search").val().toLowerCase().trim();
  if(!term && lastSearch == term) {
    lastSearch = term;
    return;
  }
  var newData = displayedData.filter(function(val){
	if (val.name.toLowerCase().includes(term) || val.game.toLowerCase().includes(term)) {
		return true;
	}
	else {
		return false;
	}
});
  lastSearch = term;
  updateHTML(newData);

}

//get streamers data and when finished call saveData and updateHTML
function getStreamers(list, force) {
  //get data from cache location if not forced
  $.get("https://api.myjson.com/bins/2go22", function(data) {
    var timeElapsed = new Date();
    timeElapsed = (timeElapsed.getTime() / 1000 / 60) - data.time;
    streamersData = data.streamers;
    console.log(timeElapsed);
    //if time since last data is older than an 10 minutes
    //get new data and cache it
    //Get data if forced too update
    if (timeElapsed > 10 || force) {
      streamersData = [];
      //go through list of streamers and grab data from twitch
      for (var i = 0; i < list.length; i++) {
        //url for twitch api, insert channel name
        var url = "https://api.twitch.tv/kraken/streams/" + list[i] + "?callback=?";
        $.getJSON(url, function(data) {
          
          //find channel name
          var name = data["_links"].channel;
          name = name.slice(name.indexOf("/channels/") + 10, name.length)
          //check status
          var status = data.stream != null ? "Online" : "Offline";
          
          //if online get current activity
          var game = "";
          if (status != "Offline")
            game = data.stream.game;
          
          //save info to obj
          var streamerObj = {
            "name": name,
            "link": "https://secure.twitch.tv/" + name,
            "status": status,
            "game": game
          };
          
          streamersData.push(streamerObj);
          //if streamerData is complete save to cache
          if (streamersData.length == streamers.length){
            saveData(streamersData);
            updateHTML(streamersData);
            filterStatus();
          }
        });
      }

    } //End of data update
    //Update HTML with data
    else {
      updateHTML(streamersData);
      filterStatus();
    }

  });
}

//save data 'cache'
function saveData(obj) {
  //get current time
  var data = {};
  var date = new Date();
  //convert to hours
  data.time = date.getTime() / 1000 / 60;
  
  //add streamers list
  data.streamers = obj;
  
  $.ajax({
    url: "https://api.myjson.com/bins/2go22",
    type: "PUT",
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data, textStatus, jqXHR) {

    }
  });
}

//update html div with data 
function updateHTML(data){

  data.sort(function(a,b){
    var valA = a.status == "Online" ? 1 : 0;
    var valB = b.status == "Online" ? 1 : 0;
    return valB - valA;
  })
  
  
  $(".purge").remove();
  for (var i = 0; i < data.length; i++){
    var name = data[i].name;
    var link = data[i].link;
    var status = data[i].status;
    var game = data[i].game;
    var div = $("<tr class='link purge' data-href='"+link+"'><td class="+status+">"+status+"</td><td class='name'>"+name+"</td><td>"+game+"</td></tr>");
    div.appendTo("table");
  }
  //add click-able table rows
  $(".link").click(function(){
    console.log("test");
    window.open($(this).data("href"));
  });

}