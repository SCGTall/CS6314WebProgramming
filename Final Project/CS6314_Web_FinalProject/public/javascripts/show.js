$(function () {
    // color the heart when hover on it
    $("h3.float-right").on("mouseover", "i.fa-heart", function () {
        $(this).toggleClass("fas");
    });
    $("h3.float-right").on("mouseleave", "i.fa-heart", function () {
        $(this).toggleClass("fas");

    });

    // click the heart to toggle color.
    $("h3.float-right").on("click", "i.fa-heart", function () {
        $(this).toggleClass("fas");
    });

});