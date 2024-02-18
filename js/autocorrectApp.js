var btnn = document.getElementById('autocorrectBtn');
btnn.addEventListener('click', function(){
	var elem = document.getElementById('autoC');
	var text = elem.value;
	var url ='https://mercury-determined-attic.glitch.me//autocorrectTxt'
    var data2 = {
        txt : text
    };
    async function postData(url = "", data = {}) {
      const response = await fetch(url, {
        method: "POST", 
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), 
      });
      return response.json();
    }
    postData(url,data2).then((data) => {
      document.getElementById("autoC").value = data
    });


});