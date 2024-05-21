const mdb = require('../controllers/mdbConfig');

module.exports = {
    applicationName: null
    , platformName: null
}

module.exports.createNew = function createNew(applicationName, platformName) {
    return {
        applicationName: applicationName
        , platformName: platformName
    }
};

module.exports.getRecordsByPlatformID = async function getRecordsByPlatformID(platformID) {
    try {
        return await mdb.pool.query("SELECT applicationID FROM platformGroups WHERE platformID = ?", platformID);
    } catch (err) {
        throw err;
    }
}

module.exports.getRecordsByPlatformName = async function getRecordsByPlatformName(PlatformName) {
    try {
        return await mdb.pool.query("SELECT applicationID FROM platformGroups JOIN platforms ON (platformGroups.platformID = platforms.platformID) WHERE name = ?", PlatformName);
    } catch (err) {
        throw err;
    }
}

module.exports.insertRecord = async function insertRecord(group) {
    try {
        return await mdb.pool.query("INSERT INTO platformGroups (applicationID, platformID) values ((SELECT applicationID FROM applications WHERE name=?), (SELECT platformID FROM platforms WHERE name=?))", [group.applicationName, group.platformName]);
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            console.log("The " + group.applicationName + " application already has the " + group.platformName + " platform assigned");
            return false;
        } else {
            throw err;
        }
    }
};

module.exports.deleteRecord = async function deleteRecord(applicationName, platformName) {
    try {
        return await mdb.pool.query("DELETE FROM platformGroups WHERE applicationID = (SELECT applicationID FROM applications WHERE name=?) AND platformID = (SELECT platformID FROM platforms WHERE name=?)", [applicationName, platformName]);
    } catch (err) {
        throw err;
    }
};

module.exports.getColumns = mdb.getColumns;
