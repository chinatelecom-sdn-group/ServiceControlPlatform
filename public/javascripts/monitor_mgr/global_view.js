function hide_physics_view(){
    alert("hide_physics_view");
}

function hide_statistics_view(){
    alert("hide_statistics_view");
}

$("document").ready(function(){
    /*
    //获取窗体高度
    alert(screen.height);
    //$("div#id_physics_view").css("height",screen.height/2);
    alert($("div#id_physics_view").css("height"));
    alert($("div#id_statistics_view").css("height"));
    */

    $(function () { $('#collapseOne').collapse('show')});
    $(function () { $('#collapseTwo').collapse('show')});
});