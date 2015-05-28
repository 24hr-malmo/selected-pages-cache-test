(function() {

    window.addEventListener('load', function() {

        var cached = window.cookies.getItem('cached');
        cached = cached ? cached.split(',') : [];
        var cacheMap = {};
        for(var i = 0, ii = cached.length; i < ii; i++){ 
            cacheMap[cached[i]] = cached[i];
        }

        // Display which have been cached
        var list = document.querySelectorAll('[data-id]');
        for(var i = 0, ii = list.length; i < ii; i++){ 
            var item = list[i];
            var id = item.getAttribute('data-id');
            var checked = cacheMap[id];
            if (checked) {
                item.checked = true;
            }
        }

        var button = document.querySelector('#cache-button');
        button.addEventListener('click', function() {

            var cacheList = [];
            var list = document.querySelectorAll('[data-item]');
            for(var i = 0, ii = list.length; i < ii; i++){ 
                var item = list[i];
                var id = item.value;
                var checked = item.checked;
                if (checked) {
                    cacheList.push(id);
                }
            }

            // When we click on the cache button, we create a cookie with the list of ids (comma separated)
            // so that the cache manifest can create the appropiate list.
            // We create the cookie here because the /cache/ endpoint doesnt seem to create the cookie in time to make the request to the manifest
            window.cookies.setItem('cached', cacheList.join(','), new Date(2030, 0, 1), '/');

            // Redirect to the cache page.
            location.href = '/cache';

        });

    }, false);

})();


