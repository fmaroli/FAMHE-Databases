const mdb = require('../controllers/mdbConfig');

module.exports = {
    platformID: null
    , name: null
    , description: null
    , displayPhoto: null
}


module.exports.createNew = function createNew(platformID = null, name, description = null, displayPhoto = null) {
    return {
        platformID: platformID
        , name: name
        , description: description
        , displayPhoto: displayPhoto
    }
};

module.exports.fillRecords = async function fillRecords() {
    try {
        return await mdb.pool.query("SELECT platformID, name, description, displayPhoto FROM platforms ORDER BY name ASC");
    } catch (err) {
        throw err;
    }
};

module.exports.fillRecordByID = async function fillRecordByID(id) {
    try {
        return await mdb.pool.query("SELECT platformID, name, description, displayPhoto FROM platforms WHERE platformID = ?", id);
    } catch (err) {
        throw err;
    }
};

module.exports.insertRecord = async function insertRecord(platform) {
    try {
        if (platform.displayPhoto == undefined)
            platform.displayPhoto = null;

        return await mdb.pool.query("INSERT INTO platforms (name, description, displayPhoto) values (?, ?, ?)", [platform.name, platform.description, platform.displayPhoto]);
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            console.log("Duplicated platform name");
            return false;
        } else {
            throw err;
        }
    }
};

module.exports.updateRecord = async function updateRecord(platform) {
    try {
        if (platform.displayPhoto == undefined)
            platform.displayPhoto = null;

        return await mdb.pool.query("UPDATE platforms SET name = ?, description = ?, displayPhoto = ? WHERE platformID = ?", [platform.name, platform.description, platform.displayPhoto, platform.platformID]);
    } catch (err) {
        throw err;
    }
};

module.exports.deleteRecord = async function deleteRecord(platformID) {
    try {
        return await mdb.pool.query("DELETE FROM platforms WHERE platformID = ?", [platformID]);
    } catch (err) {
        throw err;
    }
};

module.exports.recordExists = async function recordExists(name) {
    try {
        let result = await mdb.pool.query("SELECT COUNT(name) count FROM platforms WHERE name = ?", [name]);
        return (result[0].count | 0);
    } catch (err) {
        throw err;
    }
}

module.exports.getNameFromID = async function getNameFromID(platformID) {
    try {
        let platform = await mdb.pool.query("SELECT name FROM platforms WHERE platformID = ?", [platformID]);
        return platform[0].name;
    } catch (err) {
        throw err;
    }
}

module.exports.getColumns = mdb.getColumns;
