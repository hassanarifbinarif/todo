let currentLang = getCookie('lang') || 'en';

window.addEventListener('DOMContentLoaded', function() {
    if (currentLang == 'en')
        document.getElementById('current-lang-name').textContent = 'English';
    else if (currentLang == 'es')
        document.getElementById('current-lang-name').textContent = 'Spanish';
})


jQuery(document).ready(function() { 
    $.i18n({locale: currentLang})
    .load({ en: location.origin + "/static/Assets/translations/en.json", es: location.origin + "/static/Assets/translations/es.json" })
    .done(function() {
        updateContent();
    }) 
});


function changeLanguage(lang) {
    if ($.i18n().locale != lang)
        $.i18n().locale = lang;
        updateContent();
}

function updateContent(key) {
    $('body').i18n();
}