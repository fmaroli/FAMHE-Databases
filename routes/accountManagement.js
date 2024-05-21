var express = require('express');
var router = express.Router();

const page = 'Account Management';
const brand = process.env.APP_NAME
const title = `${brand}`

/* GET home page. */
router.get('/', async function (req, res, next) {

  res.render('./home/index', { title: title, brand: brand });
  console.log(`${page} page rendered`);
});

module.exports = router;
