export function isUndefined(val) {
    if (!val || val.toString().trim().length == 0) {
        return true;
    }
    return false;
}

export function matchHeight() {
    (function () {
        function matchHeight(){
            var parent = $(".matchHeightContainer");
            $(parent).each(function(){
                var elements = $(this).find(".matchHeight");
                $(elements).css("height","auto");
                var maxHeight = 0;
                $(elements).each(function(){
                    var thisHeight = $(this).height();
                    if( thisHeight > maxHeight ){
                        maxHeight = thisHeight;
                    }
                })
                $(elements).height(maxHeight);
            })
        }
        $(window).resize(function(){
            matchHeight()
        })
/*        $(window).scroll(function(){
            setTimeout(function(){
                matchHeight()
            },100)
        })*/
        setTimeout(function(){
            matchHeight()
        },200)
    })();
}