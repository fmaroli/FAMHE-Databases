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
    const page = 'Categories';


    res.render('./categories/index', { title: title, brand: brand, categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});

/* get single category page */
router.get('/view/:id', async function (req, res) {
    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    let cat = await category.fillRecordByID([req.params.id]);

    const page = 'Category Details';

    res.render('./categories/view', { title: title, brand: brand, category: cat[0], categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});

/* Create New category page */
router.get('/new', async function (req, res) {
    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    const page = 'Category New';

    res.render('./categories/new', { title: title, brand: brand, categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});

/* Post new category */
router.post('/new', async function (req, res) {
    let category = require('../models/category');
    let updateCategory = req.body;
    let result = await category.insertRecord(updateCategory);

    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    let cat = await category.fillRecordByID([result.insertId]);

    const page = 'Category Details';

    res.render('./categories/view', { title: title, brand: brand, category: cat[0], categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});

/* view the edit page */
router.get('/edit/:id', async function (req, res) {
    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    let cat = await category.fillRecordByID([req.params.id]);

    const page = 'Category update';

    res.render('./categories/edit', { title: title, brand: brand, category: cat[0], categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});


/* submit the edit page */
router.post('/edit/', async function (req, res) {
    let category = require('../models/category');
    let updateCategory = req.body;

    category.updateRecord(updateCategory);


    let categories = await category.fillRecords();
    let platforms = await platform.fillRecords();
    let cat = await category.fillRecordByID([updateCategory.categoryID]);

    const page = 'Categories Details';

    res.render('./categories/view', { title: title, brand: brand, category: cat[0], categories: categories, platforms: platforms });
    console.log(`${page} page rendered`);
});

module.exports = router;
