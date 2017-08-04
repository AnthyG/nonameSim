/*
CODE FROM https://codepen.io/bharatpatel/pen/dXxagZ
*/

var pixelements = 8;
var pixelMargin = "0.1vw";
var blocksPerRow = 0;
$(document).ready(function() {
    var htmlContent, hasFocus;
    $("body").append('<div class="rowLand"></div>');

    function createLand(thisLand) {
        var rowlandlength = thisLand.parent().find(".landContainer").length - 1;
        thisLand.addClass("landNo" + rowlandlength);
        for (var i = 0; i < pixelements; i++) {
            htmlContent = '<div class="row">';
            for (var j = 0; j < pixelements; j++) {
                htmlContent += "<div class='pixel col" + j + "' data-value=''></div>";
            }
            htmlContent += '</div>';
            thisLand.append(htmlContent);
        }

        ////////////////// Random Land Generator/////////////////////////////

        //Attr for first row, first element START
        if (rowlandlength < 1 && $(".rowLand").length < 2) {
            var randomNumber = Math.round((Math.random() * 100) % (pixelements - 1));
        } else if ($(".rowLand").length < 2) {
            var randomNumber = thisLand.prev().find(".row").first().find(".pixel").last().attr("data-value");
        } else {
            var prlCls = ("." + thisLand[0].className.replace("landContainer", "")).replace(" ", "");
            var randomNumber = thisLand.closest(".rowLand").prev().find(prlCls + " .row").last().find(".col0").attr("data-value");
        }
        thisLand.find(".pixel").first().attr("data-value", randomNumber);
        //Attr for first row, first element END

        //Attr for last row, last element START
        randomNumber = Math.round((Math.random() * 100) % (pixelements - 1));
        thisLand.find(".pixel").last().attr("data-value", randomNumber);
        //Attr for last row, last element END

        //Attr for first row, last element START
        if ($(".rowLand").length < 2) {
            var randomNumber = Math.round((Math.random() * 100) % (pixelements - 1));
        } else {
            var prlCls = ("." + thisLand[0].className.replace("landContainer", "")).replace(" ", "");
            var randomNumber = thisLand.closest(".rowLand").prev().find(prlCls + " .row").last().find(".pixel").last().attr("data-value");
        }
        thisLand.find(".row").first().find(".pixel").last().attr("data-value", randomNumber);
        //Attr for first row, last element End

        //Attr for last row, first element START
        if (rowlandlength < 1) {
            var randomNumber = Math.round((Math.random() * 100) % (pixelements - 1));
        } else {
            var prlCls = ("." + thisLand[0].className.replace("landContainer", "")).replace(" ", "");
            var randomNumber = thisLand.prev().find(".row").last().find(".pixel").last().attr("data-value");
        }
        thisLand.find(".row").last().find(".pixel").first().attr("data-value", randomNumber);
        //Attr for last row, first element START

        var rowstartcolstart = thisLand.find(".pixel").first().attr("data-value");
        var rowendcolstart = thisLand.find(".row").last().find(".pixel").first().attr("data-value");
        var arr = interpolationArray(rowstartcolstart * 1, rowendcolstart * 1);
        for (var i = 1; i < pixelements - 1; i++) {
            thisLand.find(".col0").eq(i).attr("data-value", arr[i - 1]);
        }

        var rowstartcolend = thisLand.find(".row").first().find(".pixel").last().attr("data-value");
        var rowendcolend = thisLand.find(".pixel").last().attr("data-value");
        arr = interpolationArray(rowstartcolend * 1, rowendcolend * 1);
        for (i = 1; i < pixelements - 1; i++) {
            thisLand.find(".col" + (pixelements - 1) + "").eq(i).attr("data-value", arr[i - 1]);
        }

        for (i = 0; i < pixelements; i++) {
            var start = thisLand.find(".row").eq(i).find(".pixel").first().attr("data-value");
            var end = thisLand.find(".row").eq(i).find(".pixel").last().attr("data-value");
            arr = interpolationArray(start * 1, end * 1);
            for (var j = 1; j < pixelements; j++)
                thisLand.find(".row").eq(i).find(".pixel").eq(j).attr("data-value", arr[j - 1]);
        }

        ////////////////// Random Land Generator/////////////////////////////

        $(".pixel").css("margin", pixelMargin);

        if (rowlandlength == blocksPerRow)
            $("body").append('<div class="rowLand"></div>');
    }

    $(document).delegate(".addMore", "click", function() {
        for (var i = 0; i <= blocksPerRow; i++) {
            $(".rowLand").last().append('<div class="landContainer"></div>');
            var thisLand = $(".landContainer").last();
            createLand(thisLand);
        }
        $(".toggleMargin").prop("checked", false);
        $(".pixel").css("color", "rgba(255, 255, 255, 0.4)");
    });

    $(".toggleMargin").change(function() {
        if ($(this).prop("checked") == true)
            $(".pixel").css("margin", 0).css("color", "rgba(255, 255, 255, 0)");
        else {
            $(".pixel").css("margin", pixelMargin).css("color", "rgba(255, 255, 255, 0.4)");
        }
    });
    $(".addMore").trigger("click");

});

function interpolationArray(startnum, endnum) {
    var spaces = pixelements - 1,
        arr = [],
        temp = spaces;
    var diff = (startnum > endnum) ? startnum - endnum : endnum - startnum;
    while (arr.length != spaces) {
        var add = Math.round((diff) / temp);
        if (startnum > endnum) {
            arr.push(startnum - add);
            startnum -= add;
        } else {
            arr.push(startnum + add);
            startnum += add;
        }
        temp--;
        diff = diff - add;
    }
    return arr;
}