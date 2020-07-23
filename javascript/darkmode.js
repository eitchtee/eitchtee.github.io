// only show toggle if js is enabled
$("#darkmode").removeClass("hiding");
// TODO Add system override option. Not sure how.
let darkmodeEnabled = false;
let localDarkModeEnabled = localStorage.getItem("darkMode")

if (localDarkModeEnabled === 'true') {
    // if user set darkMode as the preferred mode on the website, use it
    // Overwrites prefers-color-scheme
    toggleDarkMode();
} else if (localDarkModeEnabled === 'false') {
    // if user set lightMode as the preferred mode on the website, use it
    // Overwrites prefers-color-scheme
    toggleLightMode();
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // if user hasn't set a preferred mode on the website, but have a dark color scheme as default
    // use darkMode
    toggleDarkMode();
} else {
    // If user hasn't set a preferred mode or don't have a dark color scheme set as default
    // use lightMode
    toggleLightMode();
}


function toggleDarkMode () {
    // add fomantic ui's inverted class to all ui elements
    $('body').find('.ui').addClass('inverted');
    // add custom inverted class to body
    $('body').addClass('inverted');
    // change scrollbar background to match
    $("html").attr("style","--scrollbackground:var(--darkBG)");

    // simple toggle icon change
    $("#darkmode > i").removeClass('moon');
    $("#darkmode > i").addClass('sun');
    
    localStorage.setItem("darkMode", true);
    darkmodeEnabled = true;
    return;
}

function toggleLightMode() {
    // remove fomantic ui's inverted class from all ui elements
    $('body').find('.ui').removeClass('inverted');
    // remove custom inverted class to body
    $('body').removeClass('inverted');
    // change scrollbar background to match
    $("html").attr("style","--scrollbackground:var(lightBG)");

    // simple toggle icon change
    $("#darkmode > i").removeClass('sun')
    $("#darkmode > i").addClass('moon');

    localStorage.setItem("darkMode", false);
    darkmodeEnabled = false;
    return;
}

$('#darkmode').click(function () {
    if (darkmodeEnabled) {
        toggleLightMode();
    } else {
        toggleDarkMode();
    }
});

// display body after theme is set to avoid theme flickering
// this is very hacky, but as this is a static website this shouldn't cause major problems
$("body").removeClass('hiding');