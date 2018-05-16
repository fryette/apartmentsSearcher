chrome.alarms.onAlarm.addListener(function(alarm) {
  startParsing();
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.alarms.create("myAlarm", {
      delayInMinutes: 0.1,
      periodInMinutes: 0.2
    });

    if (request.greeting == "hello")
      sendResponse({farewell: "Enabled"});
  });

function startParsing() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    //console.log(tabs[0].url);
    var userid = "me";
    var xmlHttpRequest = new window.XMLHttpRequest();
    xmlHttpRequest.open(
      "GET",
      "http://irr.by/realestate/longtime/search/currency=BYN/hasimages=1/list=list/page_len20/",
      true
    );
    xmlHttpRequest.send("userid=" + userid);
    xmlHttpRequest.onreadystatechange = function() {
      if (xmlHttpRequest.readyState == XMLHttpRequest.DONE) {
        var el = document.createElement("html");
        el.innerHTML = xmlHttpRequest.response;

        var arrayList = Array.from(
          el.getElementsByClassName("add_list add_type4 ")
        );

        var items = new Array();

        for (var i = 0; i < arrayList.length; i++) {
          var texts = Array.from(arrayList[i].getElementsByTagName("span"));
          var adressOfFlat = texts[0].innerText;
          texts.slice(0, 1);

          var textString = new String();

          for (var j = 0; j < texts.length; j++) {
            textString += texts[j].innerText;
          }

          var costsHtml = arrayList[i]
            .getElementsByClassName("right_block")[0]
            .getElementsByTagName("div");
          var costsString = new String();
          for (var j = 0; j < costsHtml.length; j++) {
            costsString += costsHtml[j].innerText;
          }

          items.push({
            id: arrayList[i].attributes[2].value,
            url: arrayList[i].getElementsByTagName("a")[0].href,
            imageUrl: arrayList[i].getElementsByTagName("img")[0].src,
            description: arrayList[i].getElementsByTagName("img")[0].alt,
            adress: adressOfFlat.replace(/\s/g, ""),
            conveniences: textString.replace(/\s/g, ""),
            costs: costsString.replace(/\s/g, ""),
            addData: createDate(
              arrayList[i].getElementsByClassName("add_data")[0].innerText
            )
          });
        }
        var time = JSON.parse(localStorage.getItem("lastTime"));

        var maxTime = Math.max.apply(
          Math,
          items.map(function(o) {
            return o.addData;
          })
        );

        localStorage.setItem("lastTime", JSON.stringify(maxTime));

        var newItems = items.filter(item => item.addData > time);

        for (var j = 0; j < newItems.length; j++) {
          console.log(newItems[j].description + '/' +newItems[j].id);
        }
      }
    };
  });
}

function createDate(dateString) {
  var splittedTimeAndDate = dateString.split(",");

  var dateParts = splittedTimeAndDate[1].split(".");
  var timeParts = splittedTimeAndDate[0].split(":");

  return new Date(
    dateParts[2],
    dateParts[1] - 1,
    dateParts[0],
    timeParts[0],
    timeParts[1]
  );
}
