var express = require('express');
var router = express.Router();
var navMenu = require('./navigation');

/* GET home page. */
for (var i = 0; i < navMenu.length; i++) {
    router.use(navMenu[i].url, require('../routes/' + navMenu[i].id));
    // console.log(`Url: ${navMenu[i].url}, id: ${'../routes/'  + navMenu[i].id}`);
}

module.exports = router;
