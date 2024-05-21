const mdb = require('../controllers/mdbConfig');

module.exports = {
    applicationID: null
    , userID: null
    , rating: null
    , title: null
    , likeComments: null
    , dislikeComments: null
}


module.exports.createNew = function createNew(applicationID, userID, rating, title, likeComments, dislikeComments) {
    return {
        applicationID: applicationID
        , userID: userID
        , rating: rating
        , title: title
        , likeComments: likeComments
        , dislikeComments: dislikeComments
    }
};

module.exports.getRatingByApplicationID = async function getRatingByApplicationID(applicationID) {
    try {
        let rating = await mdb.pool.query("SELECT AVG(rating) rating FROM applicationRatings WHERE applicationID = ?", applicationID);
        return (rating[0].rating | 0);
    } catch (err) {
        throw err;
    }
};

module.exports.insertRecord = async function insertRecord(rating) {
    try {
        if (rating.rating < 1 || rating.rating > 5) {
            console.log("Rating must be between 1 and 5");
            return false;
        }
        return await mdb.pool.query("INSERT INTO applicationRatings (applicationID, userID, rating, title, likeComments, dislikeComments) values (?, ?, ?, ?, ?, ?)", [rating.applicationID, rating.userID, rating.rating, rating.title, rating.likeComments, rating.dislikeComments]);
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            console.log("User has already rated this application");
            return false;
        } else if (err.code == 'ER_NO_REFERENCED_ROW_2') {
            console.log("UserId or applicationID does not exist");
            return false;
        } else {
            throw err;
        }
    }
};

module.exports.updateRecord = async function updateRecord(rating) {
    try {
        return await mdb.pool.query("UPDATE applicationRatings SET rating = ? WHERE applicationID = ? AND userID = ?", [rating.rating, rating.applicationID, rating.userID]);
    } catch (err) {
        throw err;
    }
};

module.exports.deleteRecord = async function deleteRecord(applicationID, userID) {
    try {
        return await mdb.pool.query("DELETE FROM applicationRatings WHERE applicationID = ? AND userID = ?", [applicationID, userID]);
    } catch (err) {
        throw err;
    }
};

module.exports.getColumns = mdb.getColumns;
