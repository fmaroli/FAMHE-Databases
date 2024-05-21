const mdb = require('../controllers/mdbConfig');

module.exports = {
    vendorID: null
    , name: null
    , website: null
}

module.exports.createNew = function createNew(vendorID, name, website = null) {
    return {
        vendorID: vendorID
        , name: name
        , website: website
    }
};

module.exports.fillRecords = async function fillRecords() {
    try {
        return await mdb.pool.query("SELECT vendorID, name, website FROM vendors ORDER BY name ASC");
    } catch (err) {
        throw err;
    }
};

module.exports.fillRecordByID = async function fillRecordByID(id) {
    try {
        return await mdb.pool.query("SELECT vendorID, name, website FROM vendors WHERE vendorID = ?", id);
    } catch (err) {
        throw err;
    }
};

module.exports.insertRecord = async function insertRecord(vendor) {
    try {
        return await mdb.pool.query("INSERT INTO vendors (name, website ) values (?, ?)", [vendor.name, vendor.website]);
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            console.log("Duplicated vendor name");
            return false;
        } else {
            throw err;
        }
    }
};

module.exports.updateRecord = async function updateRecord(vendor) {
    try {
        return await mdb.pool.query("UPDATE vendors SET name = ?, website = ? WHERE vendorID = ?", [vendor.name, vendor.website, vendor.vendorID]);
    } catch (err) {
        throw err;
    }
};

module.exports.deleteRecord = async function deleteRecord(vendorID) {
    try {
        return await mdb.pool.query("DELETE FROM vendors WHERE categoryID = ?", [vendorID]);
    } catch (err) {
        throw err;
    }
};

module.exports.recordExists = async function recordExists(name) {
    try {
        let result = await mdb.pool.query("SELECT COUNT(name) count FROM vendors WHERE name = ?", [name]);
        return (result[0].count | 0);
    } catch (err) {
        throw err;
    }
}

module.exports.recordExistsByID = async function recordExistsByID(vendorID) {
    try {
        let result = await mdb.pool.query("SELECT COUNT(name) count FROM vendors WHERE vendorID = ?", [vendorID]);
        return (result[0].count | 0);
    } catch (err) {
        throw err;
    }
}

module.exports.getColumns = mdb.getColumns;
