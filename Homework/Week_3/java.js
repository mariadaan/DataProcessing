var fileName = "output.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
      jason = (JSON.parse(txtFile.responseText));
      console.log(Object.keys(jason));
    }
}
txtFile.open("GET", fileName);
txtFile.send();


//var i;
// for (i = 0; i < txtFile.length; i++) {
//console.log(Object.keys(txtFile));
