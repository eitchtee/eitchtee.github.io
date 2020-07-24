var selector_query = window.location.hash.substr(1);

if (selector_query) {
    if ($('#filter-' + selector_query).length) {
        filter(selector_query);
        $('.button.filter').removeClass('active');
        $('#filter-' + selector_query).addClass('active');
        $('#filter-' + selector_query).blur();
    }
}

var $btns = $('.button.filter').click(function () {
    filter(this.id.replace("filter-", ""));

    $btns.removeClass('active');
    $(this).addClass('active');
    $(this).blur();
})

function filter(category) {
    if (category.toLowerCase() == 'all' || category.toLowerCase() == 'todos') {
        $('#filterable > div, #filterable > a').fadeIn(450);
    } else {
        var $el = $('.' + category).fadeIn(450);
        $('#filterable > div, #filterable > a').not($el).hide(0, function() {
            $('#filterable > div, #filterable > a').not($el).attr("style", "display: none !important");
        });
    }
}