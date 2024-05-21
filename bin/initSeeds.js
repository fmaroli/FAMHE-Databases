let categories = require('../models/category');
let platforms = require('../models/platform');
let vendors = require('../models/vendor');
let users = require('../models/user');
let applications = require('../models/application');
let ratings = require('../models/rating');
let imgProc = require("../controllers/imgProcessing");

exports.createCategories = async function createCategories() {
    await categories.insertRecord(categories.createNew(null, '3D modelling'));
    await categories.insertRecord(categories.createNew(null, 'CAD'));
    await categories.insertRecord(categories.createNew(null, 'EDA'));
    await categories.insertRecord(categories.createNew(null, 'data recovery'));
    await categories.insertRecord(categories.createNew(null, 'development'));
    await categories.insertRecord(categories.createNew(null, 'electronics'));
    await categories.insertRecord(categories.createNew(null, 'gantt chart'));
    await categories.insertRecord(categories.createNew(null, 'office suite'));
    await categories.insertRecord(categories.createNew(null, 'partition manager'));
    await categories.insertRecord(categories.createNew(null, 'password manager'));
    await categories.insertRecord(categories.createNew(null, 'productivity'));
    await categories.insertRecord(categories.createNew(null, 'project management'));
    await categories.insertRecord(categories.createNew(null, 'prototyping'));
    await categories.insertRecord(categories.createNew(null, 'security'));
    await categories.insertRecord(categories.createNew(null, 'text editor'));
    await categories.insertRecord(categories.createNew(null, 'utilities'));
}

exports.createPlatforms = async function createPlatforms() {
    await platforms.insertRecord(platforms.createNew(null, 'Windows'));
    await platforms.insertRecord(platforms.createNew(null, 'MacOS'));
    await platforms.insertRecord(platforms.createNew(null, 'Linux'));
    await platforms.insertRecord(platforms.createNew(null, 'Facebook'));
    await platforms.insertRecord(platforms.createNew(null, 'Web-based'));
    await platforms.insertRecord(platforms.createNew(null, 'Live-cd/live-usb'));
    await platforms.insertRecord(platforms.createNew(null, 'chromeOS'));
    await platforms.insertRecord(platforms.createNew(null, 'iOS'));
    await platforms.insertRecord(platforms.createNew(null, 'Android'));
    await platforms.insertRecord(platforms.createNew(null, 'Microsoft Azure'));
}

exports.createVendors = async function createVendors() {
    await vendors.insertRecord(vendors.createNew(null, 'Autodesk'));
    await vendors.insertRecord(vendors.createNew(null, 'Adobe'));
    await vendors.insertRecord(vendors.createNew(null, 'Apple'));
    await vendors.insertRecord(vendors.createNew(null, 'Corel'));
    await vendors.insertRecord(vendors.createNew(null, 'Borland'));
    await vendors.insertRecord(vendors.createNew(null, 'Meta'));
    await vendors.insertRecord(vendors.createNew(null, 'Google'));
    await vendors.insertRecord(vendors.createNew(null, 'BarD Software'));
    await vendors.insertRecord(vendors.createNew(null, 'Bitwarden, Inc'));
    await vendors.insertRecord(vendors.createNew(null, 'CleverFiles'));
    await vendors.insertRecord(vendors.createNew(null, 'Community-driven'));
    await vendors.insertRecord(vendors.createNew(null, 'Easeus'));
    await vendors.insertRecord(vendors.createNew(null, 'GitHub'));
    await vendors.insertRecord(vendors.createNew(null, 'Interaction Design Lab Potsdam'));
    await vendors.insertRecord(vendors.createNew(null, 'KiCad developers'));
    await vendors.insertRecord(vendors.createNew(null, 'Microsoft'));
    await vendors.insertRecord(vendors.createNew(null, 'OpenProject'));
    await vendors.insertRecord(vendors.createNew(null, 'OpenScad'));
    await vendors.insertRecord(vendors.createNew(null, 'ProjectLibre'));
}

exports.createUsers = async function createUsers() {
    await users.insertRecord(users.createNew('mdasfari', 'welcome@123', false, false, false));
    await users.insertRecord(users.createNew('fernando', 'welcome@123', false, false, false));
    await users.insertRecord(users.createNew('enrique', 'welcome@123', false, false, false));
    await users.insertRecord(users.createNew('john', 'welcome@123', false, false, false));
    await users.insertRecord(users.createNew('paul', 'welcome@123', false, false, false));
    await users.insertRecord(users.createNew('george', 'welcome@123', false, false, false));
    await users.insertRecord(users.createNew('ringo', 'welcome@123', false, false, false));
    await users.insertRecord(users.createNew('mick', 'welcome@123', false, false, false));
    await users.insertRecord(users.createNew('keith', 'welcome@123', false, false, false));
    await users.insertRecord(users.createNew('bill', 'welcome@123', false, false, false));
    await users.insertRecord(users.createNew('charlie', 'welcome@123', false, false, false));
    await users.insertRecord(users.createNew('jimmy', 'welcome@123', false, false, false));
    await users.insertRecord(users.createNew('robert', 'welcome@123', false, false, false));
    await users.insertRecord(users.createNew('johnb', 'welcome@123', false, false, false));
    await users.insertRecord(users.createNew('johnpj', 'welcome@123', false, false, false));
}

exports.createApplications = async function createApplications() {
    await applications.insertRecord(applications.createNew(null, ['text editor', 'office suite', 'productivity'], ['Windows', 'MacOS', 'Web-based', 'iOS', 'Android'], 'Microsoft', 'Word', 'http://www.microsoft.com/office', 1200, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.", await imgProc.getImageBlob({ name: "seedingImg/word.svg" })));
    await applications.insertRecord(applications.createNew(null, ['games', 'addictive'], ['Symbian', 'Android'], 'King', 'Candy Crush', 'http://www.microsoft.com/office', 3.99, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.", await imgProc.getImageBlob({ name: "seedingImg/candy_crush.png" })));
    await applications.insertRecord(applications.createNew(null, ["development"], ["Android", "Linux", "OSX"], "Community-driven", "Valgrind", "https://valgrind.org/", 0, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.", await imgProc.getImageBlob({ name: "seedingImg/valgrind.png" })));
    await applications.insertRecord(applications.createNew(null, ["data recovery", "utilities"], ["OSX", "MacOS", "Windows"], "CleverFiles", "Disk Drill", "https://www.cleverfiles.com/", 0, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.", await imgProc.getImageBlob({ name: "seedingImg/diskdrill.png" })));
    await applications.insertRecord(applications.createNew(null, ["3D modelling", "CAD"], ["MacOS", "Windows", "Linux", "OSX"], "OpenScad", "OpenScad", "https://openscad.org/", 0, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.", await imgProc.getImageBlob({ name: "seedingImg/openscad.svg" })));
    await applications.insertRecord(applications.createNew(null, ["CAD", "EDA", "electronics"], ["Linux", "Windows", "MacOS", "OSX"], "KiCad developers", "Kicad", "https://www.kicad.org/", 0, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.", await imgProc.getImageBlob({ name: "seedingImg/kicad.png" })));
    await applications.insertRecord(applications.createNew(null, ["3D modelling", "CAD", "electronics", "prototyping"], ["Web-based"], "Autodesk", "Tinkercad", "https://www.tinkercad.com/", 0, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.", await imgProc.getImageBlob({ name: "seedingImg/tinkercad.svg" })));
    await applications.insertRecord(applications.createNew(null, ["password manager", "security", "utilities"], ["Web-based", "Android", "Linux", "MacOS", "OSX", "Windows", "iOS"], "Bitwarden, Inc", "Bitwarden", "https://bitwarden.com/", 0, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.", await imgProc.getImageBlob({ name: "seedingImg/bitwarden.png" })));
    /**
     * Example of how to seed an app with image
     * application.insertRecord(application.createNew(null, [], [], "Test vendor", "Test app", "test url", 0, "description", await imgProc.getImageBlob({ name: "public/images/bg.svg" })));
    */
}

exports.createRatings = async function createRatings() {
    const numberOfUsers = 15;
    const numberOfApps = 8;
    for (var appNumber = 1; appNumber <= numberOfApps; appNumber++) {
        let quantity = integerRandom(5, numberOfUsers);
        await createRandomRatings(numberOfUsers, appNumber, quantity);
    }
}

async function createRandomRatings(numberOfUsers, appNumber, desireRatingQuantity) {
    for (var i = 0; i < desireRatingQuantity; i++) {
        let userID = integerRandom(1, numberOfUsers);
        let rating = integerRandom(1, 5);
        let title = "Review from user " + userID;
        let likes = "Likes from user " + userID;
        let dislikes = "Dislikes from user " + userID;
        await ratings.insertRecord(ratings.createNew(appNumber, userID, rating, title, likes, dislikes));
    }
}

function integerRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
