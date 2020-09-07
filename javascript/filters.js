let selector_query = window.location.hash.substr(1);
let filterButtons = $('.button.filter')

if (selector_query) {
    let element = $('#filter-' + selector_query)
    
    if (element.length) {
        filter(selector_query);
        filterButtons.removeClass('active');
        element.addClass('active');
        element.blur();
    }
}

filterButtons.click(function () {
    filter(this.id.replace("filter-", ""));

    filterButtons.removeClass('active');
    $(this).addClass('active');
    $(this).blur();
})

function filter(category) {
    let selector = $('#filterable > div, #filterable > a')

    if (category.toLowerCase() == 'all' || category.toLowerCase() == 'todos') {
        selector.fadeIn(450);
    } else {
        var fadedOut = function() {
            return selector.not('.' + category).fadeOut('fast').promise();
        }

        $.when(fadedOut()).done(function() {
            $('.' + category).fadeIn('fast')
        });
    }
}