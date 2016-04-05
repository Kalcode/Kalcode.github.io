var url = "https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies";

var headers = {
  "X-Mashape-Key": "nOFwAfv9KFmshxRulGzO0h7qXJkDp1KD8KjjsnPdzEuJuDwsay",
  "Content-Type": "application/x-www-form-urlencoded",
  "Accept": "application/json"
}

var quote = "";
var author = "";

$(document).ready(function() {
  if (quote == "" || author == "") {
    getQuote();
  }

  $("#quote-btn").click(function() {
    getQuote();
  });

});

function getQuote() {
  $.ajax({
    type: "POST",
    url: url,
    headers: headers,
    dataType: 'json',
    success: function(results) {
      quote = '"' + results.quote + '"';
      author = results.author;
      $("#author").text(author);
      $("#quote").text(quote);

      
      
      //$("#tweet").attr("href", "https://twitter.com/intent/tweet?text=" + escape(quote) + " by " + escape(author));
      var tweeturl = "'https://twitter.com/intent/tweet?text=" + escape(quote) + "%20by%20" + escape(author)+"'";
      var tumblrurl = "'https://www.tumblr.com/widgets/share/tool?canonicalUrl=https://example.com&posttype=quote&content=" + escape(quote.slice(1,quote.length-1)) + "&caption=" + escape(author) + "'";
      $("#tweet").attr("onclick", "window.open(" + tweeturl + ", 'newwindow', 'width=300, height=250')");
      $("#tumblr").attr("onclick", "window.open(" + tumblrurl + ", 'newwindow', 'width=300, height=250')");

    },
  });

}