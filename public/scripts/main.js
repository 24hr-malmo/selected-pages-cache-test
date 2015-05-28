(function(){

    window.addEventListener('load', function() {

        var cached = window.cookies.getItem('cached');
        cached = cached ? cached.split(',') : [];
        var cacheMap = {};
        for(var i = 0, ii = cached.length; i < ii; i++){ 
            cacheMap[cached[i]] = cached[i];
        }

        // This just marks which centers are cached
        var list = document.querySelectorAll('[data-id]');
        for(var i = 0, ii = list.length; i < ii; i++){ 
            var item = list[i];
            var id = item.getAttribute('data-id');
            var checked = cacheMap[id];
            if (checked) {
                item.classList.add('cached');
            }
        }

    }, false);

})();


