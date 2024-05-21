const mdb = require('../controllers/mdbConfig');

module.exports = {
    applicationName: null
    , categoryName: null
}

module.exports.createNew = function createNew(applicationName, categoryName) {
    return {
        applicationName: applicationName
        , categoryName: categoryName
    }
};

module.exports.getRecordsByCategoryID = async function getRecordsByCategoryID(categoryID) {
    try {
        return await mdb.pool.query("SELECT applicationID FROM categoryGroups WHERE categoryID = ?", categoryID);
    } catch (err) {
        throw err;
    }
}

module.exports.insertRecord = async function insertRecord(group) {
    try {
        return await mdb.pool.query("INSERT INTO categoryGroups (applicationID, categoryID) values ((SELECT applicationID FROM applications WHERE name=?), (SELECT categoryID FROM categories WHERE name=?))", [group.applicationName, group.categoryName]);
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            console.log("The " + group.applicationName + " application already has the " + group.categoryName + " category assigned");
            return false;
        } else {
            throw err;
        }
    }
};

module.exports.deleteRecord = async function deleteRecord(applicationName, categoryName) {
    try {
        return await mdb.pool.query("DELETE FROM categoryGroups WHERE applicationID = (SELECT applicationID FROM applications WHERE name=?) AND categoryID = (SELECT categoryID FROM categories WHERE name=?)", [applicationName, categoryName]);
    } catch (err) {
        throw err;
    }
};

module.exports.getColumns = mdb.getColumns;
