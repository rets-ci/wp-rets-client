wpp.utility = {
    sendEvent: function (timingCategory, timingVar) {
        var timingValue = 0;

        if (window.performance)
            timingValue = Math.round(performance.now());


        ga('send', 'timing', {
            'timingCategory': timingCategory,
            'timingVar': timingVar,
            'timingValue': timingValue
        });

    },
    sendException: function (errDescription, fatal) {
        ga('send', 'exception', {
            'exDescription': errDescription,
            'exFatal': fatal || false
        });
    }
};