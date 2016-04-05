$(document).ready(function() {
  //Search button
  $(".search-btn").click(function() {
    $("ul").html("");
    var searchTerm = $("input").val();
    if($(".search-box").hasClass("no-results")) {
      $(".search-box").hide("slide", { direction: "right"}, "normal").delay(400).removeClass("no-results").show("fade", "normal");
    }
    
    searchWiki(searchTerm);
    $("input").val("");
    $(".search-title").hide().text("Results for: " + searchTerm).slideDown();
    $(".results hr").hide().delay("400").fadeIn();

  });

  //pressing enter on search field
  $("input").keypress(function(e) {
    if (e.which == 13) {
      $(".search-btn").click();
      return false;
    }
  });

  //Feeling Random Button
  $(".random-btn").click(function() {
    window.open("http://en.wikipedia.org/wiki/Special:Random");
  });

});

function searchWiki(term) {
  var url = "http://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=&generator=search&exsentences=1&exlimit=20&exintro=1&gsrlimit=20&gsrsearch=";
  var search = escape(term);
  var callback = "&callback=JSON_CALLBACK";

  $.ajax({
    url: url + search + callback,
    dataType: "jsonp",
    success: function(data) {

      if (data.query == undefined) {
        var li = "<li>No results returned for " + term + "</li>";
        $(li).hide().appendTo("ul").delay(300).fadeIn("slow");
        return;
      }

      var pages = data.query.pages;
      var index = 0;
      $.each(pages, function(key, value) {
        var li = "<li><a target='_blank' href='http://en.wikipedia.org/?curid=" + value.pageid + "'>";
        li += "<h3>" + value.title + "</h3><hr class='hr-results'>";
        li += value.extract;
        li += "</a></li>";
        $(li).hide().appendTo("ul").delay(300 * index).fadeIn("slow");
        index++;
      });

    }

  });

}