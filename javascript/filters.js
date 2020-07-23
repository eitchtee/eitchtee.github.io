$('.filter-buttons').removeClass('hiding'); // Show filter is JS is enabled
    
    // from https://codepen.io/terf/post/jquery-filter-divs
var $btns = $('.button.filter').click(function () {
    if (this.id == 'all') {
        $('#filterable > div, #filterable > a').fadeIn(450);
    } else {
        var $el = $('.' + this.id).fadeIn(450);
        $('#filterable > div, #filterable > a').not($el).hide(0, function() {
            $('#filterable > div, #filterable > a').not($el).attr("style", "display: none !important");
        });
    }
    $btns.removeClass('active');
    $(this).addClass('active');
})