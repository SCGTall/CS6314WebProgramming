$(document).ready(function () {
    // dropdown-menu
    $("a.dropdown-item").on("click", (function (e) {
        var selText = "&nbsp;&nbsp;&nbsp;" + $(this).text() + "&nbsp;&nbsp;";
        $(this).parents('div.dropdown').find('button.dropdown-toggle').html(selText);
    }));

    //bootstrap select
    $.fn.selectpicker.Constructor.BootstrapVersion = '4';
    $('#select-category').selectpicker();

    // color the heart when hover on it
    $("#productList").on("mouseover", "i.fa-heart", function () {
        $(this).toggleClass("fas");
    });
    $("#productList").on("mouseleave", "i.fa-heart", function () {
        $(this).toggleClass("fas");

    });

    // click the heart to toggle color.
    $("#productList").on("click", "i.fa-heart", function () {
        $(this).toggleClass("fas");
    });

    // click the trash to delete the card
    // $("#productList").on("click", "i.fa-trash-alt", function () {
    //     $(this).closest(".col-lg-3").remove();
    // });

    // click the trash to delete the shopcart item
    // $("#shopList").on("click", "i.fa-trash-alt", function () {
    //     $(this).closest(".row").remove();
    // });


    // pagination
    var itemNum = 8;    // display 8 item per page
    var handleDisable = function () {
        if (!$('#page').find('.active').prev().hasClass("page")) {
            $('#pagePrev').addClass("disabled");
        } else {
            $('#pagePrev').removeClass("disabled");
        }
        if (!$('#page').find('.active').next().hasClass("page")) {
            $('#pageNext').addClass("disabled");
        } else {
            $('#pageNext').removeClass("disabled");
        }
        scrollTo(0, 0);
    }

    // create page li
    var cardsNum = $('#productList').children().length;
    var pageNum = Math.ceil(cardsNum / itemNum);
    if (pageNum > 1) {
        for (var i = pageNum; i > 1; i--) {
            var li = '<li id="page' + i + '" class="page page-item"><a class="page-link">' + i + '</a></li>';
            $(li).insertAfter('#page .active');
        }
    }
    // set page id
    $('#productList').children().each(function (index) {
        $(this).attr("id", index);
    });
    // render first page
    for (var i = 0; i < itemNum; i++) {
        $('#' + i).show();
    }
    // deal with page change
    $('#page').children(".page").on("click", function () {
        // change active class
        $(this).addClass("active");
        $(this).siblings().removeClass("active");

        // hide & show items
        $('#productList').children().hide();
        var c = $(this).find('a').text();
        for (var j = 0; j < itemNum; j++) {
            var x = (c - 1) * itemNum + j;
            if (x < cardsNum) {
                $('#' + x).show();
            }
        }

        handleDisable();
    });

    $('#pagePrev').on("click", function () {
        $('#productList').children().hide();
        var c = $('#page').find('.active a').text();
        for (var j = 0; j < itemNum; j++) {
            var x = (c - 2) * itemNum + j;
            if (x < cardsNum) {
                $('#' + x).show();
            }
        }
        var page = $('#page').find('.active');
        page.prev('.page').addClass("active");
        page.removeClass("active");

        handleDisable();
    });

    $('#pageNext').on("click", function () {
        $('#productList').children().hide();
        var c = $('#page').find('.active a').text();
        for (var j = 0; j < itemNum; j++) {
            var x = (c) * itemNum + j;
            if (x < cardsNum) {
                $('#' + x).show();
            }
        }
        var page = $('#page').find('.active');
        page.next('.page').addClass("active");
        page.removeClass("active");

        handleDisable();
    });

    // back to top button
    $("#back-to-top").on("click", function () {
        scrollTo(0, 0);
    })
});


function show(id) {
    $(".item-show").hide();
    $("#item-show-" + id).show(500);
}

// Image Preview
function changepic() {
    var reads = new FileReader();
    f = document.getElementById('file').files[0];
    reads.readAsDataURL(f);
    reads.onload = function (e) {
        document.getElementById('previewImage').src = this.result;
    };
}

// handle cart num change
$(".cartNum").on("change", function(){
    console.log("cartNum");
    console.log($(this).id());
    console.log($(this).val());
    $.post("/shopcart/update", {productID: $(this).id(), num: $(this).val()})
})