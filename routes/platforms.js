var express = require('express');
const { route } = require('express/lib/application');
var category = require('../models/category');
var platform = require('../models/platform');
var router = express.Router();


const brand = process.env.APP_NAME
const title = `${brand}`

/* GET home page. */
router.get('/', async function (req, res, next) {
    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();

    const page = 'Platforms';


    res.render('./platforms/index', { title: title, brand: brand, categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});

/* get single platform page */
router.get('/view/:id', async function (req, res) {
    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    let plat = await platform.fillRecordByID([req.params.id]);

    const page = 'platform Details';

    res.render('./platforms/view', { title: title, brand: brand, platform: plat[0], categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});

/* Create New platform page */
router.get('/new', async function (req, res) {
    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    const page = 'Platform New';

    res.render('./platforms/new', { title: title, brand: brand, categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});

/* Post new platform */
router.post('/new', async function (req, res) {
    let platform = require('../models/platform');
    let updatePlatform = req.body;
    let result = await platform.insertRecord(updatePlatform);

    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    let plat = await platform.fillRecordByID([result.insertId]);

    const page = 'Platform Details';

    res.render('./platforms/view', { title: title, brand: brand, platform: plat[0], categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});

/* view the edit page */
router.get('/edit/:id', async function (req, res) {
    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    let plat = await platform.fillRecordByID([req.params.id]);

    const page = 'Platform update';

    res.render('./platforms/edit', { title: title, brand: brand, platform: plat[0], categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});


/* submit the edit page */
router.post('/edit/', async function (req, res) {
    let platform = require('../models/platform');
    let updatePlatform = req.body;
    platform.updateRecord(updatePlatform);


    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    let plat = await platform.fillRecordByID([updatePlatform.platformID]);

    const page = 'Platform Details';

    res.render('./platforms/view', { title: title, brand: brand, platform: plat[0], categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});

module.exports = router;
