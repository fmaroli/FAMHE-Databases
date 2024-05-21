const mdb = require('../controllers/mdbConfig');

module.exports = {
    categoryID: null
    , name: null
    , description: null
    , displayPhoto: null
}


module.exports.createNew = function createNew(categoryID = null, name, description = null, displayPhoto = null) {
    return {
        categoryID: categoryID
        , name: name
        , description: description
        , displayPhoto: displayPhoto
    }
};

module.exports.fillRecords = async function fillRecords() {
    try {
        return await mdb.pool.query("SELECT categoryID, name, description, displayPhoto FROM categories ORDER BY name ASC");
    } catch (err) {
        throw err;
    }
};

module.exports.fillRecordByID = async function fillRecordByID(id) {
    try {
        return await mdb.pool.query("SELECT categoryID, name, description, displayPhoto FROM categories WHERE categoryID = ?", id);
    } catch (err) {
        throw err;
    }
};

module.exports.insertRecord = async function insertRecord(category) {
    try {
        if (category.displayPhoto == undefined)
            category.displayPhoto = null;

        return await mdb.pool.query("INSERT INTO categories (name, description, displayPhoto) values (?, ?, ?)", [category.name, category.description, category.displayPhoto]);
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            console.log("Duplicated category name");
            return false;
        } else {
            throw err;
        }
    }
};

module.exports.updateRecord = async function updateRecord(category) {
    try {
        if (category.displayPhoto == undefined)
            category.displayPhoto = null;
            
        return await mdb.pool.query("UPDATE categories SET name = ?, description = ?, displayPhoto = ? WHERE categoryID = ?", [category.name, category.description, category.displayPhoto, category.categoryID]);
    } catch (err) {
        throw err;
    }
};

module.exports.deleteRecord = async function deleteRecord(categoryID) {
    try {
        return await mdb.pool.query("DELETE FROM categories WHERE categoryID = ?", [categoryID]);
    } catch (err) {
        throw err;
    }
};

module.exports.recordExists = async function recordExists(name) {
    try {
        let result = await mdb.pool.query("SELECT COUNT(name) count FROM categories WHERE name = ?", [name]);
        return (result[0].count | 0);
    } catch (err) {
        throw err;
    }
}

module.exports.getNameFromID = async function getNameFromID(categoryID) {
    try {
        let category = await mdb.pool.query("SELECT name FROM categories WHERE categoryID = ?", [categoryID]);
        return category[0].name;
    } catch (err) {
        throw err;
    }
}

module.exports.getColumns = mdb.getColumns;
