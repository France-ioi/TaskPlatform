function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(window.location.toString());
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var getLocale = (function() {
    var locale = decodeURIComponent(getParameterByName('sLocale'));
    if(!locale) {
        locale = window.config ? window.config.defaultLocale : 'en';
    }
    var idx = locale.indexOf('_');
    if(idx > -1) {
       var localeLang = locale.substring(0, idx);
       var localeCountry = locale.substring(idx+1);
    } else {
       var localeLang = locale;
       var localeCountry = null;
    }

    var getAngularLocale = function(callback) {
        $.getScript('bower_components/angular-i18n/angular-locale_' + locale.replace('_', '-') + '.js')
            .success(callback)
            .fail(function() {
                $.getScript('bower_components/angular-i18n/angular-locale_' + window.config.defaultLocale.replace('_', '-') + '.js')
                    .always(callback);
            });
    }

    return {
        locale: locale,
        localeLang: localeLang,
        localeCountry: localeCountry,

        getAngularLocale: getAngularLocale
        };
})();
