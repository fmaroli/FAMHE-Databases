var express = require('express');
var category = require('../models/category');
var platform = require('../models/platform');
var vendor = require('../models/vendor');
var application = require('../models/application');
var rating = require('../models/rating');
var router = express.Router();

const page = 'Register application';
const brand = process.env.APP_NAME
const title = `${brand}`

/* GET applications home page. */
router.get('/', async function (req, res, next) {
  let categories = await category.fillRecords();
  let platforms = await platform.fillRecords();
  let applications = await application.fillApplicationView();

  const page = 'Applications';

  res.render('./applications/index', { title: title, brand: brand, categories: categories, platforms: platforms, applications: applications });
  console.log(`${page} page rendered`);
});

/* get single application page */
router.get('/view/:id', async function (req, res) {
  let categories = await category.fillRecords();
  let platforms = await platform.fillRecords();
  let app = await application.fillApplicationTopViewByID([req.params.id]);
  let displayApplication = application.getCompoundApplication(app);
  displayApplication.rating = await rating.getRatingByApplicationID(req.params.id);

  const page = 'Application Details';

  res.render('./applications/view', { title: title, brand: brand, application: displayApplication, categories: categories, platforms: platforms });
  console.log(`${page} page rendered`);
});

// New Page
router.get('/new', async function (req, res, next) {
  let categories = await category.fillRecords();
  let platforms = await platform.fillRecords();
  let vendors = await vendor.fillRecords();

  res.render('./applications/new', { title: title, brand: brand, categories: categories, platforms: platforms, vendors: vendors });
  console.log(`${page} page rendered`);
});

router.post('/new', async function (req, res, next) {
  let app = req.body;
  if (app.vendor == 0) {
    res.send("Choose a vendor!!");
    return;
  }
  if (!app.platform) {
    app.platform = [];
  } else if (typeof (app.platform) == 'string') {
    app.platform = [app.platform];
  }
  while (app.platform.includes("on")) {
    app.platform.splice(app.platform.indexOf("on"), 1);
  }
  if (!app.category) {
    app.category = [];
  } else if (typeof (app.category) == 'string') {
    app.category = [app.category];
  }
  while (app.category.includes("on")) {
    app.category.splice(app.category.indexOf("on"), 1);
  }

  if (req.files) {
    let image = require('../controllers/imgProcessing');
    app.displayPhoto = await image.getImageBlob(req.files.displayPhoto);
  } else if (!app.displayPhoto) {
    app.displayPhoto = null;
  }

  let result = await application.insertRecord(app);
  res.set('Cache-Control', 'no-cache');
  if (result)
    res.redirect('/applications/view/' + result.insertId);
  else
    res.redirect('/applications');
});

// edit Page
router.get('/edit/:id', async function (req, res, next) {
  let categories = await category.fillRecords();
  let platforms = await platform.fillRecords();
  let vendors = await vendor.fillRecords();

  let app = await application.fillApplicationTopViewByID([req.params.id]);
  let displayApplication = application.getCompoundApplication(app, true);

  const page = 'Edit Application';

  res.render('./applications/edit', { title: title, brand: brand, categories: categories, platforms: platforms, vendors: vendors, application: displayApplication });
  console.log(`${page} page rendered`);
});

router.post('/edit/:id', async function (req, res, next) {
  let app = req.body;
  if (!app.platform) {
    app.platform = [];
  } else if (typeof (app.platform) == 'string') {
    app.platform = [app.platform];
  }
  while (app.platform.includes("on")) {
    app.platform.splice(app.platform.indexOf("on"), 1);
  }
  if (!app.category) {
    app.category = [];
  } else if (typeof (app.category) == 'string') {
    app.category = [app.category];
  }
  while (app.category.includes("on")) {
    app.category.splice(app.category.indexOf("on"), 1);
  }

  if (req.files) {
    let image = require('../controllers/imgProcessing');
    app.displayPhoto = await image.getImageBlob(req.files.displayPhoto);
  }

  await application.updateRecord(app);
  res.set('Cache-Control', 'no-cache');
  res.redirect('/applications/view/' + app.applicationID);
});

module.exports = router;

/**
 * Development references
 * https://medium.com/nerd-for-tech/store-files-binary-in-mysql-database-and-view-using-vanilla-js-and-node-js-95a227002b85
 * https://www.digitalocean.com/community/tutorials/how-to-use-the-mysql-blob-data-type-to-store-images-with-php-on-ubuntu-18-04
 * https://attacomsian.com/blog/uploading-files-nodejs-express
 * https://stackoverflow.com/questions/28834835/readfile-in-base64-nodejs
 */
