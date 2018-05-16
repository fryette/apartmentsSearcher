var button = document.createElement("button");
button.innerHTML = "Subscribe";
button.style.position = "fixed";
button.style.bottom = "30px";
button.style.right = "20px";
button.style.width = "100px";
button.style.height = "50px";
button.style.background = "red";
button.style.color = "white";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];

body.appendChild(button);

// 3. Add event handler
button.addEventListener("click", function(){
  chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});
});
