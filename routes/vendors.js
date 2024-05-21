var express = require('express');
const { route } = require('express/lib/application');
var category = require('../models/category');
var vendor = require('../models/vendor');
var platform = require('../models/platform');
var router = express.Router();


const brand = process.env.APP_NAME
const title = `${brand}`

/* GET home page. */
router.get('/', async function (req, res, next) {
    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    let vendors = await vendor.fillRecords();
    const page = 'Vendors';


    res.render('./vendors/index', { title: title, brand: brand, categories: categories, vendors: vendors, platforms: platforms });
    console.log(`${page} page rendered`);
});

/* get single vendor page */
router.get('/view/:id', async function (req, res) {
    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    let vend = await vendor.fillRecordByID([req.params.id]);

    const page = 'Vendor Details';

    res.render('./vendors/view', { title: title, brand: brand, vendor: vend[0], categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});

/* Create New Vendor page */
router.get('/new', async function (req, res) {
    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    const page = 'Vendor New';

    res.render('./vendors/new', { title: title, brand: brand, categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});

/* Post new Vendor */
router.post('/new', async function (req, res) {
    let vendor = require('../models/vendor');
    let updateVendor = req.body;
    let result = await vendor.insertRecord(updateVendor);

    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    let vend = await vendor.fillRecordByID([result.insertId]);

    const page = 'Vendor Details';

    res.render('./vendors/view', { title: title, brand: brand, vendor: vend[0], categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});

/* view the edit page */
router.get('/edit/:id', async function (req, res) {
    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    let vend = await vendor.fillRecordByID([req.params.id]);

    const page = 'Vendor update';

    res.render('./vendors/edit', { title: title, brand: brand, vendor: vend[0], categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});


/* submit the edit page */
router.post('/edit/', async function (req, res) {
    let vendor = require('../models/vendor');
    let updateVendor = req.body;
    vendor.updateRecord(updateVendor);


    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    let vend = await vendor.fillRecordByID([updateVendor.vendorID]);

    const page = 'Vendor Details';

    res.render('./vendors/view', { title: title, brand: brand, vendor: vend[0], categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});

module.exports = router;
