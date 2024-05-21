const mdb = require('../controllers/mdbConfig');
const vendorObj = require('./vendor');
const categoryObj = require('./category');
const platformObj = require('./platform');
const platGroupObj = require('./platformGroup');
const catGroupObj = require('./categoryGroup');
const rating = require('./rating');

module.exports = {
    applicationID: null
    , categoryID: null
    , vendorID: null
    , name: null
    , url: null
    , price: null
    , description: null
    , displayPhoto: null
}

module.exports.createNew = function createNew(applicationID = null, categories, platforms, vendor, name, url, price, description, displayPhoto = null) {
    return {
        applicationID: applicationID
        , category: categories
        , platform: platforms
        , vendor: vendor
        , name: name
        , url: url
        , price: price
        , description: description
        , displayPhoto: displayPhoto
    }
};

module.exports.fillRecords = async function fillRecords() {
    try {
        return await mdb.pool.query("SELECT applicationID, vendorID, name, url, price, displayPhoto FROM applications");
    } catch (err) {
        throw err;
    }
};


module.exports.fillRecordByID = async function fillRecordByID(id) {
    try {
        return await mdb.pool.query("SELECT applicationID, vendorID, name, url, price, displayPhoto FROM applications WHERE applicationID = ?", id);
    } catch (err) {
        throw err;
    }
};

module.exports.returnNames = async function returnNames() {
    try {
        return await mdb.pool.query("SELECT name FROM applications");
    } catch (err) {
        throw err;
    }
};

module.exports.returnLastID = async function returnLastID(name) {
    try {
        return await mdb.pool.query("SELECT applicationID FROM applications WHERE name=?", name);
    } catch (err) {
        throw err;
    }
};

module.exports.fillApplicationView = async function fillApplicationView() {
    try {
        let result = await mdb.pool.query("SELECT applicationID, vendorID, vendor, name, url, price, description, displayPhoto FROM applicationView ORDER BY name ASC");
        for (let application of result) {
            application.rating = await rating.getRatingByApplicationID(application.applicationID);
        }
        return result;
    } catch (err) {
        throw err;
    }
};

module.exports.fillApplicationViewByID = async function fillApplicationViewByID(id) {
    try {
        return await mdb.pool.query("SELECT applicationID, name, vendorID, vendor, url, price, description, displayPhoto FROM applicationView WHERE applicationID = ?", id);
    } catch (err) {
        throw err;
    }
};

module.exports.fillApplicationTopViewByID = async function fillApplicationTopViewByID(id) {
    try {
        return await mdb.pool.query("SELECT applicationID, name, vendorID, vendor, url, price, description, displayPhoto, categoryID, category, platformID, platform  FROM applicationTopView WHERE applicationID = ?", id);
    } catch (err) {
        throw err;
    }
};

module.exports.getCompoundApplication = function getCompoundApplication(appObject, addOnlyID = false) {
    let displayApplication = {};

    // [0] This is to take the suppress the duplicate values 
    displayApplication.applicationID = appObject[0].applicationID;
    displayApplication.vendorID = appObject[0].vendorID;
    displayApplication.vendor = appObject[0].vendor;
    displayApplication.name = appObject[0].name;
    displayApplication.url = appObject[0].url;
    displayApplication.price = appObject[0].price;
    displayApplication.description = appObject[0].description;
    displayApplication.displayPhoto = appObject[0].displayPhoto;

    displayApplication.categories = [];
    displayApplication.platforms = [];

    let categoryList = {};
    let platformList = {};

    for (let index = 0; index < appObject.length; index++) {
        if (appObject[index].categoryID)
            categoryList[appObject[index].categoryID] = appObject[index].category;
        if (appObject[index].platformID)
            platformList[appObject[index].platformID] = appObject[index].platform;
    }

    for (let catID in categoryList) {
        if (addOnlyID)
            displayApplication.categories.push(catID);
        else
            displayApplication.categories.push({ categoryID: catID, name: categoryList[catID] });
    }


    for (let platID in platformList)
        if (addOnlyID)
            displayApplication.platforms.push(platID);
        else
            displayApplication.platforms.push({ platformID: platID, name: platformList[platID] });

    if (!addOnlyID) {
        displayApplication.platforms.sort(sortByName);
        displayApplication.categories.sort(sortByName);
    }

    return displayApplication;
};

module.exports.fillApplicationFullView = async function fillApplicationFullView() {
    try {
        let applications = [];
        let ids = await mdb.pool.query("SELECT applicationID FROM applications;");
        for (let id of ids) {
            applications.push(await this.fillApplicationFullViewByID(id.applicationID));
        }
        return applications;
    } catch (err) {
        throw err;
    }
};

module.exports.fillApplicationFullViewByID = async function fillApplicationFullViewByID(id) {
    try {
        let application = await mdb.pool.query("SELECT applications.applicationID, applications.name, vendors.name vendor, applications.url, applications.price, applications.description, applications.displayPhoto FROM applications JOIN famhe.vendors ON (applications.vendorID = vendors.vendorID) WHERE applicationID = ?", id);
        application[0].categories = [];
        application[0].platforms = [];
        let categories = await mdb.pool.query("SELECT categories.name FROM categories JOIN categoryGroups ON (categories.categoryID = categoryGroups.categoryID) WHERE categoryGroups.applicationID = ?", id);
        for (let category of categories) {
            application[0].categories.push(category.name);
        }
        let platforms = await mdb.pool.query("SELECT platforms.name FROM platforms JOIN platformGroups ON (platforms.platformID = platformGroups.platformID) WHERE platformGroups.applicationID = ?", id);
        for (let platform of platforms) {
            application[0].platforms.push(platform.name);
        }
        application[0].categories.sort();
        application[0].platforms.sort();
        application[0].rating = await rating.getRatingByApplicationID(id);
        return application[0];
    } catch (err) {
        throw err;
    }
};

module.exports.searchApplicationsByName = async function searchApplicationsByName(linkName) {
    try {
        linkName = '%' + linkName + '%';
        let applications = [];
        let ids = await mdb.pool.query("SELECT applicationID FROM applications WHERE name LIKE ?", linkName);
        for (let id of ids) {
            applications.push(await this.fillApplicationFullViewByID(id.applicationID));
        }
        return applications;
    } catch (err) {
        throw err;
    }
};

module.exports.searchApplicationsByCategoryID = async function searchApplicationsByCategoryID(categoryID) {
    try {
        let applications = [];
        let ids = await catGroupObj.getRecordsByCategoryID(categoryID);
        for (let id of ids) {
            applications.push(await this.fillApplicationFullViewByID(id.applicationID));
        }
        applications.sort(sortByName);
        return applications;
    } catch (err) {
        throw err;
    }
}

module.exports.searchApplicationsByVendorID = async function searchApplicationsByVendorID(vendorID) {
    try {
        let applications = [];
        let ids = await mdb.pool.query("SELECT applicationID FROM applications WHERE vendorID = ?", vendorID);
        for (let id of ids) {
            applications.push(await this.fillApplicationFullViewByID(id.applicationID));
        }
        applications.sort(sortByName);
        return applications;
    } catch (err) {
        throw err;
    }
}

module.exports.searchApplicationsByPlatformID = async function searchApplicationsByPlatformID(platformID) {
    try {
        let applications = [];
        let ids = await platGroupObj.getRecordsByPlatformID(platformID);
        for (let id of ids) {
            applications.push(await this.fillApplicationFullViewByID(id.applicationID));
        }
        applications.sort(sortByName);
        return applications;
    } catch (err) {
        throw err;
    }
}

module.exports.searchApplicationsByPlatformName = async function searchApplicationsByPlatformName(platformName) {
    try {
        let applications = [];
        let ids = await platGroupObj.getRecordsByPlatformName(platformName);
        for (let id of ids) {
            applications.push(await this.fillApplicationFullViewByID(id.applicationID));
        }
        applications.sort(sortByName);
        return applications;
    } catch (err) {
        throw err;
    }
}

module.exports.insertRecord = async function insertRecord(application) {
    /**
     * The proper sequence is:
     * 1. If the vendor DOES NOT exist, create the vendor.
     * 2. Insert the new application.
     * 3. For each category
     *    3.1. If the category DOES NOT exist, create the category
     *    3.2. Insert a new row in categoryGroups linking application and category
     * 4. For each platform
     *    4.1. If the platform DOES NOT exist, create the platform.
     *    4.2. Insert a new row in platformGroups linking application and platform
     */
    try {
        let result;
        if (await vendorObj.recordExists(application.vendor) == false) {
            await vendorObj.insertRecord(vendorObj.createNew(null, application.vendor));
        }
        if (await this.recordExists(application.name)) {
            throw ({ code: 'ER_DUP_ENTRY' });
        }
        result = await mdb.pool.query("INSERT INTO applications (vendorID, name, url, price, description, displayPhoto) values ((SELECT vendorID FROM vendors WHERE name=?), ?, ?, ?, ?, ?)", [application.vendor, application.name, application.url, application.price, application.description, application.displayPhoto]);
        application.applicationID = result.insertId;
        await updateCategories(application.applicationID, application.name, application.category);
        await updatePlatforms(application.applicationID, application.name, application.platform);
        return result;
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            console.log("Duplicated application name");
            return false;
        } else {
            throw err;
        }
    }
};

module.exports.insertManyRecordsByIDs = async function insertManyRecordsByIDs(application) {
    try {
        if (application.displayPhoto == undefined)
            application.displayPhoto = null;

        let result = await mdb.pool.query("INSERT INTO applications (vendorID, name, url, price, description, displayPhoto) values (?, ?, ?, ?, ?, ?)", [application.vendorID, application.name, application.url, application.price, application.description, application.displayPhoto]);

        if (result.affectedRows > 0) {
            application.applicationID = result.insertId;

            if (application.categoryID) {
                for (let index = 0; index < application.categoryID.length; index++)
                    await mdb.pool.query("INSERT INTO categorygroups (applicationID, categoryID) values (?, ?)", [application.applicationID, application.categoryID[index]]);
            }

            if (application.platformID) {
                for (let index = 0; index < application.platformID.length; index++)
                    await mdb.pool.query("INSERT INTO platformgroups (applicationID, platformID) values (?, ?)", [application.applicationID, application.platformID[index]]);
            }
        }

        return result;
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            console.log("Duplicated application name");
            return false;
        } else {
            throw err;
        }
    }
}

module.exports.updateRecord = async function updateRecord(application) {
    try {
        // Doing it like this ensures that the application name can't be changed once it has been created
        await mdb.pool.query("SELECT applications.name FROM applications WHERE applications.applicationID = ?", application.applicationID).then(async res => {
            // Update stuff in the applications table
            let affectedRows = await updateApplication(application);

            if (affectedRows) {
                // Update the application categories
                await updateCategories(application.applicationID, res[0].name, application.category);

                // Update application platforms
                await updatePlatforms(application.applicationID, res[0].name, application.platform);
            }
        });
    } catch (err) {
        throw err;
    }
};

module.exports.updateManyRecordsByIDs = async function updateManyRecordsByIDs(application) {
    try {
        let result;
        if (application.displayPhoto == undefined)
            application.displayPhoto = null;

        // If a new picture is not defined during edition, don't remove the previous one!!
        if (!application.displayPhoto) {
            result = await mdb.pool.query("update applications set vendorID = ?, name = ?, url = ?, price = ?, description = ? where applicationID = ?", [application.vendorID, application.name, application.url, application.price, application.description, application.applicationID]);
        } else {
            result = await mdb.pool.query("update applications set vendorID = ?, name = ?, url = ?, price = ?, description = ?, displayPhoto = ? where applicationID = ?", [application.vendorID, application.name, application.url, application.price, application.description, application.displayPhoto, application.applicationID]);
        }

        if (result.affectedRows > 0) {

            await mdb.pool.query("delete from categoryGroups where applicationID = ? ", [application.applicationID]);
            for (let index = 0; index < application.categoryID.length; index++)
                await mdb.pool.query("INSERT INTO categoryGroups (applicationID, categoryID) values (?, ?)", [application.applicationID, application.categoryID[index]]);

            await mdb.pool.query("delete from platformGroups where applicationID = ? ", [application.applicationID]);
            for (let index = 0; index < application.platformID.length; index++)
                await mdb.pool.query("INSERT INTO platformGroups (applicationID, platformID) values (?, ?)", [application.applicationID, application.platformID[index]]);
        }
        return true;
    } catch (err) {
        return false;
    }
}

module.exports.deleteRecord = async function deleteRecord(applicationID) {
    try {
        return await mdb.pool.query("DELETE FROM applications WHERE applicationID = ?", [applicationID]);
    } catch (err) {
        throw err;
    }
};

module.exports.recordExists = async function recordExists(name) {
    try {
        let result = await mdb.pool.query("SELECT COUNT(name) count FROM applications WHERE name = ?", [name]);
        return (result[0].count | 0);
    } catch (err) {
        throw err;
    }
}


module.exports.getTopRated = async function getTopRated(desiredNumber) {
    try {
        let appIds = await mdb.pool.query("SELECT applicationID FROM applications;");
        for (let id of appIds) {
            id.rating = await rating.getRatingByApplicationID(id.applicationID);
        }
        appIds.sort((a, b) => b.rating - a.rating);
        if (appIds.length > desiredNumber) {
            appIds = appIds.slice(0, desiredNumber);
        }
        let applications = [];
        for (let id of appIds) {
            applications.push(await this.fillApplicationFullViewByID(id.applicationID));
        }
        return applications;
    } catch (err) {
        throw err;
    }
}

// Update information affecting the Application Entity
async function updateApplication(application) {
    try {
        let result;
        if (await vendorObj.recordExists(application.vendor) == false) {
            await vendorObj.insertRecord(vendorObj.createNew(null, application.vendor));
        }
        // If a new picture is not defined during edition, don't remove the previous one!!
        if (!application.displayPhoto) {
            result = await mdb.pool.query("update applications set vendorID = (SELECT vendorID FROM vendors WHERE name = ?), name = ?, url = ?, price = ?, description = ? where applicationID = ?", [application.vendor, application.name, application.url, application.price, application.description, application.applicationID]);
        } else {
            result = await mdb.pool.query("update applications set vendorID = (SELECT vendorID FROM vendors WHERE name = ?), name = ?, url = ?, price = ?, description = ?, displayPhoto = ? where applicationID = ?", [application.vendor, application.name, application.url, application.price, application.description, application.displayPhoto, application.applicationID]);
        }
        return result.affectedRows;
    } catch (err) {
        throw err;
    }
}

// Update information in the categoryGroups table
async function updateCategories(applicationID, name, newCategories) {
    if (typeof (newCategories) == 'string') {
        newCategories = [newCategories];
    }
    try {
        let currentCategories = await mdb.pool.query("SELECT categories.name FROM (categories LEFT JOIN categoryGroups ON (categories.categoryID = categoryGroups.categoryID)) WHERE applicationID = ?", applicationID);
        /***
         * If newCategories does NOT include an element of currentCategoriess, erase the link between the application and that currentCategory.
         * If newCategories DOES include an element of currentCategoriess, remove it from the list of newCategories.
         * If newCategories inclues an element that is not in currentCategoriess, create a link between the application and the new category.
         */
        for (let i = 0; i < currentCategories.length; i++) {
            if (newCategories.includes(currentCategories[i].name)) {
                newCategories.splice(newCategories.indexOf(currentCategories[i].name), 1);
            } else {
                await catGroupObj.deleteRecord(name, currentCategories[i].name);
            }
        }
        for (let category of newCategories) {
            // Create new category if required
            if (await categoryObj.recordExists(category) == false) {
                await categoryObj.insertRecord(categoryObj.createNew(null, category));
            }
            // Link new category to the application
            await catGroupObj.insertRecord(catGroupObj.createNew(name, category));
        }
    } catch (err) {
        throw err;
    }
}

async function updatePlatforms(applicationID, name, newPlatforms) {
    if (typeof (newPlatforms) == 'string') {
        newPlatforms = [newPlatforms];
    }
    try {
        let currentPlatforms = await mdb.pool.query("SELECT platforms.name FROM (platforms LEFT JOIN platformGroups ON (platforms.platformID = platformGroups.platformID)) WHERE applicationID = ?", applicationID);
        /***
         * If newPlatforms does NOT include an element of currentPlatforms, erase the link between the application and that currentPlatform.
         * If newPlatforms DOES include an element of currentPlatforms, remove it from the list of newPlatforms.
         * If newPlatforms inclues an element that is not in currentPlatforms, create a link between the application and the new platform.
         */
        for (let i = 0; i < currentPlatforms.length; i++) {
            if (newPlatforms.includes(currentPlatforms[i].name)) {
                newPlatforms.splice(newPlatforms.indexOf(currentPlatforms[i].name), 1);
            } else {
                await platGroupObj.deleteRecord(name, currentPlatforms[i].name);
            }
        }
        for (let platform of newPlatforms) {
            // Create new platform if required
            if (await platformObj.recordExists(platform) == false) {
                await platformObj.insertRecord(platformObj.createNew(null, platform));
            }
            // Link new platforms to the application
            await platGroupObj.insertRecord(platGroupObj.createNew(name, platform));
        }
    } catch (err) {
        throw err;
    }
}

function sortByName(a, b) {
    /**
     * Sorting code taken from:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
     */
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    // names must be equal
    return 0;
}

module.exports.getColumns = mdb.getColumns;
