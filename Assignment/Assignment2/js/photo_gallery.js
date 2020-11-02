$(document).ready(function(){
	$("ul.gallery").empty();
	offset = [0, 30]// top, left
	$.ajax({
		url: "js/data.json",
		dataType: "json",
		success: function(data){
			$(data).each(function(key, val){
				$("ul.gallery").append("<li><img></li>");
				$("ul.gallery li:last").find("img").attr("src", "images/square/" + val.path);
				$("ul.gallery li:last").find("img").attr("alt", val.title);
				$("ul.gallery li:last").find("img").addClass("gallery");
				$("ul.gallery li:last").find("img").mouseenter(function(event) {
					$(this).addClass("gray");
					$("body").append("<div><img><p></p><p></p></div>");
					$("body div:last").attr("id", "preview");
					$("#preview").find("img").attr("src","images/medium/" + val.path);
					$("#preview").find("img").attr("alt", val.title);
					$("#preview").find("p:first").html("Title: " + val.title);
					$("#preview").find("p:last").html("City: " + val.city + "&nbsp&nbsp&nbsp&nbspData Taken: [" + val.taken + "]");
					$("#preview").css("top", event.pageY + offset[0]);
					$("#preview").css("left", event.pageX + offset[1]);
					$("#preview").fadeIn('fast').delay(1000).fadeOut('slow');
				});
				$('ul.gallery li:last').find("img").mouseleave(function() {
					$(this).removeClass("gray");
					$("#preview").remove();

				});
				$('ul.gallery li:last').find("img").mousemove(function(event) {
					$("#preview").css("top", event.pageY + offset[0]);
					$("#preview").css("left", event.pageX + offset[1]);
				});
			});
			if ($(data).children().length == 0){
				$("ul.gallery").append("<li> Your photo gallery is empty. </li>");
			};
		},
		error: function(){
			$("ul.gallery").append("<li> Your photo gallery is empty. </li>");
			alert("error loading file");
		}
	})
})