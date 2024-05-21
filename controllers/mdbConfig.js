var mdb = require('mariadb');

// Connection to MariaDB
// The following function and the exports 
// was extracted from mariadb wiki code.
var mariaPool = mdb.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  allowPublicKeyRetrieval: true
});

module.exports = Object.freeze({
  pool: mariaPool
});

exports.getColumns = function (modelObject) {
  var strColumns;
  for (var property in modelObject) {
    if (strColumns) {
      strColumns += ", " + property;
    } else {
      strColumns = property;
    }
  }
  return strColumns;
} 
