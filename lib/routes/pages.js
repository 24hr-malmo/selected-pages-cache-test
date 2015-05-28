var express = require('express');
var router = express.Router();

var generalList = [
    '/scripts/main.js',
    '/assets/css/style.css'
];

var list = [ {
    name: 'Test 1',
    id: 'c1',
    images: [ '/assets/images/big-lebowski-4.jpg' ],
    files: [ '/assets/images/big-lebowski-4.jpg'].concat(generalList)
},{
    name: 'Test 2',
    id: 'c2',
    images: [ '/assets/images/big-lebowski-still-hr-1.jpg', ],
    files: [ '/assets/images/big-lebowski-still-hr-1.jpg', ].concat(generalList)
},{
    name: 'Test 3',
    id: 'c3',
    images: [ '/assets/images/big-lebowski-still-hr-4.jpg', ],
    files: [ '/assets/images/big-lebowski-still-hr-4.jpg', ].concat(generalList)
},{
    name: 'Test 4',
    id: 'c4',
    images: [ '/assets/images/walter.jpg' ],
    files: [ '/assets/images/walter.jpg' ].concat(generalList)
} ];

// Just to make things quicker we have a reference list to all centers
var mapped = {};
list.forEach(function(item) {
    mapped[item.id] = item;
});

// The index page has the manifest so we can browse it offline
router.get('/', function(req, res, next) {
    var cached = req.cookies.cached;
    res.render('index', {
        list: list,
        manifest: cached
    });
});

// This is just the not-cached warning page
router.get('/not-offline', function(req, res, next) {
    res.render('not-offline', { });
});

// this is the page where we let the user pick centers. It doesnt use the manifest
router.get('/setup', function(req, res, next) {
    res.render('setup', {
        list: list
    });
});

// The page for the center
router.get('/center/:id', function(req, res, next) {
    var cached = req.cookies.cached;
    res.render('center', { 
        item: mapped[req.params.id], 
        manifest: cached
    });
});

// This is the page that does the actual caching
router.get('/cache', function(req, res, next) {
    res.render('cache', { manifest: true });
});



// Serve the manifest.
//
// We use the cookie to know what manifest to build and make sure that:
// 1. Make a list of all files and paths to be cached
// 2. Make sure all none-cached centers have a fallback
// 3. Make sure the setup has a fallback

router.get('/cache.manifest', function(req, res, next) {

    var cached = req.cookies.cached;
    cached = cached ? cached.split(',') : [];

    var cacheMap = {};
    var files = [];
    cached.forEach(function(id) {
        cacheMap[id] = true;
        if (mapped[id]) {
            files = files.concat(mapped[id].files);
        }
    });


    // Make a list of all files we want to cache
    var map = {};
    files = files.filter(function(file) {
        if (!map[file]) {
            map[file] = true;
            return true;
        }
        return false;
    });

    // Make a list of all none-cached pages
    var notCachedPages = list
        .filter(function(item) {
            return !cacheMap[item.id];
        })
        .map(function(item) {
            return item.id;
        });

    res.type('text/cache-manifest');
    res.set('Cache-Control', 'max-age=0');
    res.set('Expires', new Date());

    res.render('manifest', {
        files: files,
        cachedPages: cached,
        notCachedPages: notCachedPages,
        layout: false
    });

});

module.exports = router;
