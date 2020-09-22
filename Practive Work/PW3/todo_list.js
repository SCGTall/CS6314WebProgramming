$(document).ready(function() {
	// init
	$("#addnew").hide();
	$(".ticon").hide();
	// plus button
	$("#plus").click(function() {
		$("#addnew").toggle();
	});
	// add item
	$("#addnew").keypress(function(event) {
		if (event.which === 13) {
			$("#todolist").append("<li><span><i class=\"fa fa-trash ticon\"></i></span>&nbsp&nbsp&nbsp&nbsp " + $("#addnew").val() + "&nbsp&nbsp&nbsp&nbsp </li>");
			$("#addnew").val("");
			$(".ticon").last().hide();
		}
	});
	// item complete
	$("#todolist").on("click", "li", function() {
		$(this).toggleClass("complete");
	});
	// item mouseenter
	$("#todolist").on("mouseenter", "li", function() {
		$(this).find(".ticon").show();
	});
	// item mouseleave
	$("#todolist").on("mouseleave", "li", function() {
		$(this).find(".ticon").hide();
	});
	// delete item
	$("#todolist").on("click", ".ticon", function() {
		$(this).parentsUntil("#todolist").remove();
	});
});