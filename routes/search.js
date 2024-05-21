var express = require('express');
var router = express.Router();

const page = 'Search';
const brand = process.env.APP_NAME
const title = `${brand}`

/* GET home page. */
router.get('/', async function (req, res, next) {
  let app = require('../models/application');
  var category = require('../models/category');
  var platform = require('../models/platform');
  let appResult = [];
  let searchTerm = "";
  let categories = await category.fillRecords();
  let platforms = await platform.fillRecords();

  if (req.query && req.query.search) {
    console.log('Query: ' + req.query.search);
    appResult = await app.searchApplicationsByName(req.query.search);
    searchTerm = req.query.search;
  }

  res.render('./home/search', { title: title, brand: brand, appFound: appResult, qnty: appResult.length, query: searchTerm, categories: categories, platforms: platforms });
  console.log(`${page} page rendered`);
});

module.exports = router;
