var express = require('express');
var category = require('../models/category');
var platform = require('../models/platform');
var application = require('../models/application');
var rating = require('../models/rating');
var router = express.Router();

const page = 'Write a Review';
const brand = process.env.APP_NAME
const title = `${brand}`

router.get('/:id', async function (req, res, next) {
  let categories = await category.fillRecords();
  let platforms = await platform.fillRecords();
  let app = await application.fillApplicationFullViewByID(req.params.id);

  console.log(`${page} page rendered`);

  res.render('./reviews/writeReview', { title: title, brand: brand, categories: categories, platforms: platforms, application: app });
  console.log(`${page} page rendered`);
});

router.post('/', async function (req, res, next) {
  let appReview = req.body;

  /* Simple one database insertion */
  // Once Authentication created, the userID 
  // Should be populated from the authenticated User
  appReview.userID = 1;

  rating.insertRecord(appReview);
  
  res.redirect('/applications/view/' + appReview.applicationID);
});

module.exports = router;
