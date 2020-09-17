window.onload = function(){

    //there will be one span element for each input field
    // when the page is loaded, we create them and append them to corresponding input element 
	// they are initially hidden

    // username
    var span1 = document.createElement("span");
    span1.className = "info";
	span1.style.display = "none"; //hide the span element

	var username = document.getElementById("username");
    username.parentNode.appendChild(span1);

    var reg1 = /^[0-9a-zA-Z]+$/;

    username.onfocus = function(){
        span1.innerHTML = "Alphanumeric characters only";
        span1.className = "info";
        span1.style.display = "inline";
    }

    username.onblur = function(){
        if (username.value == null || username.value == ""){
            span1.style.display = "none";
        }else if (reg1.test(username.value)){
            span1.innerHTML = "OK";
            span1.className = "ok";
            span1.style.display = "inline";
        }else {
            span1.innerHTML = "Error";
            span1.className = "error";
            span1.style.display = "inline";
        }  	
    }

    // password
    var span2 = document.createElement("span");
    span2.className = "info";
    span2.style.display = "none"; //hide the span element

    var password = document.getElementById("password");
    password.parentNode.appendChild(span2);


    password.onfocus = function(){
        span2.innerHTML = "At least six characters long";
        span2.className = "info";
        span2.style.display = "inline";
    }

    password.onblur = function(){
        if (password.value == null || password.value == ""){
            span2.style.display = "none";
        }else if (password.value.length >= 6){
            span2.innerHTML = "OK";
            span2.className = "ok";
            span2.style.display = "inline";
        }else {
            span2.innerHTML = "Error";
            span2.className = "error";
            span2.style.display = "inline";
        }   
    }

    // email
    var span3 = document.createElement("span");
    span3.className = "info";
    span3.style.display = "none"; //hide the span element

    var email = document.getElementById("email");
    email.parentNode.appendChild(span3);

    var reg3 = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    email.onfocus = function(){
        span3.innerHTML = "Valid email address: abc@def.xyz";
        span3.className = "info";
        span3.style.display = "inline";
    }

    email.onblur = function(){
        if (email.value == null || email.value == ""){
            span3.style.display = "none";
        }else if (reg3.test(email.value)){
            span3.innerHTML = "OK";
            span3.className = "ok";
            span3.style.display = "inline";
        }else {
            span3.innerHTML = "Error";
            span3.className = "error";
            span3.style.display = "inline";
        }   
    }

}


