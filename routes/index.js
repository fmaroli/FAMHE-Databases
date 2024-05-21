var express = require('express');
var category = require('../models/category');
var platform = require('../models/platform');
var application = require('../models/application');
var router = express.Router();

const page = 'Home';
const brand = process.env.APP_NAME
const title = `${brand}`

/* GET home page. */
router.get('/', async function (req, res, next) {
  renderFiltered(res);
});

router.get('/category/:id', async function (req, res, next) {
  renderFiltered(res, req.params.id);
});

router.get('/platform/:id', async function (req, res, next) {
  renderFiltered(res, null, req.params.id);
});

async function renderFiltered(res, categoryID = null, platformID = null) {
  let categories = await category.fillRecords();
  let platforms = await platform.fillRecords();
  let appResult;
  let searchTerm;
  let topObj = await application.getTopRated(3);

  if (platformID) {
    appResult = await application.searchApplicationsByPlatformID(platformID);
    searchTerm = await platform.getNameFromID(platformID);
  } else if (categoryID) {
    appResult = await application.searchApplicationsByCategoryID(categoryID);
    searchTerm = await category.getNameFromID(categoryID);
  } else { // If both are null, render the main page
    res.render('./home/index', { title: title, brand: brand, categories: categories, platforms: platforms, topthree: topObj });
    console.log(`${page} page rendered`);
    return;
  }
  res.render('./home/search', { title: title, brand: brand, appFound: appResult, qnty: appResult.length, query: searchTerm, categories: categories, platforms: platforms });
  console.log(`${searchTerm} page renderedd`);
}
module.exports = router;
