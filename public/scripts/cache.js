(function() {

    var cacheStatusValues = [];
    cacheStatusValues[0] = 'uncached';
    cacheStatusValues[1] = 'idle';
    cacheStatusValues[2] = 'checking';
    cacheStatusValues[3] = 'downloading';
    cacheStatusValues[4] = 'updateready';
    cacheStatusValues[5] = 'obsolete';

    var timeout;

    var cache = window.applicationCache;

    cache.addEventListener('cached', function () {

        setDebugText("Cache download was completed!");

        document.querySelector('[data-action]').innerHTML = '<a href="/">TEST IT!</a>';

        clearTimeout(timeout);
        timeout = setTimeout(removeDebug, 3000);

    }, false);

    cache.addEventListener('checking', logEvent, false);
    cache.addEventListener('downloading', logEvent, false);
    cache.addEventListener('error', logEvent, false);
    cache.addEventListener('noupdate', logEvent, false);
    cache.addEventListener('obsolete', logEvent, false);
    cache.addEventListener('progress', logEvent, false);

    function logEvent(e) {
        var online, status, type, message;
        online = (navigator.onLine) ? 'yes' : 'no';
        status = cacheStatusValues[cache.status];
        type = e.type;
        message = 'online: ' + online;
        message += ', event: ' + type;
        message += ', status: ' + status;
        if (type == 'error' && navigator.onLine) {
            message += ' (probably a syntax error in manifest)';

        }
        //console.log(message);
        if (status == 'downloading') {
            setDebugText("Downloading content: " + e.loaded + " of " + e.total);
            clearTimeout(timeout);
            timeout = setTimeout(
                function () {
                removeDebug();
            }, 3000);
        }                
    }

    cache.addEventListener('updateready', function (e) {

        // For some reason we get an error tellings us that the case is not new and we cant swap it
        // But for some other reason it works anyway.
        try {
            cache.swapCache();
        } catch( err) {
            console.warn(err);
        }
        document.querySelector('[data-action]').innerHTML = '<a href="/">TEST IT!</a>';

        //console.log('swap cache has been called');
        setDebugText("Cache has been updated!");
        timeout = setTimeout(removeDebug, 3000);

    }, false);

    cache.addEventListener( 'error', function () {
        setDebugText("We got an error, lets clear the cache cookie");
        window.cookies.setItem('cached', '', new Date(2030, 0, 1), '/');
        timeout = setTimeout(removeDebug, 3000);
    }, false);

    cache.addEventListener( 'noupdate', function () {
        setDebugText("Cache is up to date!");
        timeout = setTimeout(removeDebug, 3000);
    }, false);

    function setDebugText(text) {
        document.querySelector('#debug').style.display = 'block';
        document.querySelector('#debug').innerHTML = text;
    }

    function removeDebug() {
        document.querySelector('#debug').style.display = 'none';
    }

})();
