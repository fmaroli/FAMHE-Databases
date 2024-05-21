const mdb = require('../controllers/mdbConfig');

module.exports = {
    userID: null
    , username: null // This is the email will be used as username
    , password: null
    , displayPhoto: null
    , notifyByEmail: null
    , notifyByNotificationBar: null
    , enableTwoWayAuthentication: null
}


module.exports.createNew = function createNew(username, password, notifyByEmail = false, notifyByNotificationBar = false, enableTwoWayAuthentication = false) {
    return {
        userID: null
        , username: username
        , password: password
        , displayPhoto: null
        , notifyByEmail: notifyByEmail
        , notifyByNotificationBar: notifyByNotificationBar
        , enableTwoWayAuthentication: enableTwoWayAuthentication
    }
};

module.exports.fillRecords = async function fillRecords() {
    try {
        return await mdb.pool.query("SELECT userID, username, password, displayPhoto, notifyByEmail, notifyByNotificationBar, enableTwoWayAuthentication FROM users");
    } catch (err) {
        throw err;
    }
};

module.exports.insertRecord = async function insertRecord(user) {
    try {
        return await mdb.pool.query("INSERT INTO users (username, password, displayPhoto, notifyByEmail, notifyByNotificationBar, enableTwoWayAuthentication) values (?, ?, ?, ?, ?, ?)", [user.username, user.password, user.displayPhoto, user.notifyByEmail, user.notifyByNotificationBar, user.enableTwoWayAuthentication]);
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            console.log("Duplicated user name");
            return false;
        } else {
            throw err;
        }
    }
};

module.exports.updateRecord = async function updateRecord(user) {
    try {
        return await mdb.pool.query("UPDATE users SET username = ?, password = ?, displayPhoto = ?, notifyByEmail = ?, notifyByNotificationBar = ?, enableTwoWayAuthentication = ? WHERE categoryID = ?", [user.username, user.password, user.displayPhoto, user.notifyByEmail, user.notifyByNotificationBar, user.enableTwoWayAuthentication, user.userID]);
    } catch (err) {
        throw err;
    }
};

module.exports.deleteRecord = async function deleteRecord(userID) {
    try {
        return await mdb.pool.query("DELETE FROM users WHERE userID = ?", [userID]);
    } catch (err) {
        throw err;
    }
};

module.exports.getColumns = mdb.getColumns;
