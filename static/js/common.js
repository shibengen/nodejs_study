
function get_param(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/**
 * 获取屏幕宽高
 */
function get_area(w1,h1) {
    var w = $(window).width();
    var h = $(window).height();
    if (w1 ) {
        w = w * w1;
    }
    if (h1) {
        h = h* h1;
    }
    return [w + 'px', h + 'px'];
}