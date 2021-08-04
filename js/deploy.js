const { ethers, utils } = window.ethers;

console.log({ethers});

var form_el = document.querySelector("#deploy-form");
form_el.addEventListener("submit", function(evt) {
    evt.preventDefault();
    var token = document.getElementById("token").value;
    console.log({token, tokenInput});     
});
  