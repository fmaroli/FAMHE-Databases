// This file used to create the database instance 
// Tables, views, etc.
let mdb = require('mariadb');
let dotenv = require('dotenv');
dotenv.config({ path: './.env' });

module.exports.createDatabase = async function createDatabase(dbRoot, dbRootPassword) {
    var rootAccess = mdb.createPool({
        host: process.env.DATABASE_HOST,
        user: dbRoot,
        password: dbRootPassword,
        allowPublicKeyRetrieval: true
    });

    let sql;
    let result;

    // Create the database
    try {
        console.log("create database");
        sql = 'CREATE DATABASE IF NOT EXISTS ' + process.env.DATABASE + ';';
        result = await rootAccess.query(sql);

        if (process.env.ENV_MODE == "development") {
            console.log('Create database:');
            console.log(sql);
            console.log(result);
        }
    }
    catch (err) {
        console.log("Error While creating database!!!");
    }

    // Create the required user to access the database
    try {
        sql = 'CREATE USER IF NOT EXISTS ' + process.env.DATABASE_USER + '@' + process.env.DATABASE_HOST + ' IDENTIFIED BY ?';
        result = await rootAccess.query(sql, [process.env.DATABASE_PASSWORD])

        if (process.env.ENV_MODE == "development") {
            console.log('Create database user:');
            console.log(sql);
            console.log(result);
        }

        console.log('Grant database user to database');
        sql = 'GRANT ALL ON `' + process.env.DATABASE + '`.* TO ' + process.env.DATABASE_USER + '@' + process.env.DATABASE_HOST + ' WITH GRANT OPTION';
        result = await rootAccess.query(sql);

        if (process.env.ENV_MODE == "development") {
            console.log('Grant database User:');
            console.log(sql);
            console.log(result);
        }

        if (result.affectedRows > 0)
            console.log('Grant successful!!!');

        console.log("username created");
    }
    catch (err) {
        console.log("Error While creating database user!!!");
    }

    // Create tables
    try {
        console.log("Create Categories Table");
        sql = 'CREATE TABLE IF NOT EXISTS ' + process.env.DATABASE + '.`categories` (`categoryID` INT(11) NOT NULL AUTO_INCREMENT, `name` VARCHAR(50) NOT NULL, `description` VARCHAR(1024) NULL DEFAULT NULL, `displayPhoto` LONGBLOB NULL DEFAULT NULL, PRIMARY KEY (`categoryID`) USING BTREE, UNIQUE(`name`));';
        result = await rootAccess.query(sql);

        if (process.env.ENV_MODE == "development") {
            console.log('Create Categories Table:');
            console.log(sql);
            console.log(result);
        }
    }
    catch (err) {
        console.log("Error While creating Categories!!!");
    }

    try {
        console.log("Create platforms Table");
        sql = 'CREATE TABLE IF NOT EXISTS ' + process.env.DATABASE + '.`platforms` (`platformID` INT(11) NOT NULL AUTO_INCREMENT, `name` VARCHAR(50) NOT NULL, `description` VARCHAR(1024) NULL DEFAULT NULL, `displayPhoto` LONGBLOB NULL DEFAULT NULL, PRIMARY KEY (`platformID`) USING BTREE, UNIQUE(`name`));';
        result = await rootAccess.query(sql);

        if (process.env.ENV_MODE == "development") {
            console.log('Create platforms Table:');
            console.log(sql);
            console.log(result);
        }
    }
    catch (err) {
        console.log("Error While creating platforms!!!");
    }

    try {
        console.log("Create users Table");
        sql = 'CREATE TABLE IF NOT EXISTS ' + process.env.DATABASE + '.`users` (`userID` INT(11) NOT NULL AUTO_INCREMENT, `username` VARCHAR(256) NOT NULL, `password` VARCHAR(30) NOT NULL, `displayPhoto` LONGBLOB NULL DEFAULT NULL, `notifyByEmail` BIT(1) NOT NULL DEFAULT 0, `notifyByNotificationBar` BIT(1) NOT NULL DEFAULT 0, `enableTwoWayAuthentication` BIT(1) NOT NULL DEFAULT 0, PRIMARY KEY (`userID`) USING BTREE, UNIQUE(`username`));';
        result = await rootAccess.query(sql);

        if (process.env.ENV_MODE == "development") {
            console.log('Create users Table:');
            console.log(sql);
            console.log(result);
        }
    }
    catch (err) {
        console.log("Error While creating users!!!");
    }

    try {
        console.log("Create vendors Table");
        sql = 'CREATE TABLE IF NOT EXISTS ' + process.env.DATABASE + '.`vendors` (`vendorID` INT(11) NOT NULL AUTO_INCREMENT, `name` VARCHAR(50) NOT NULL, `website` VARCHAR(2048) NULL DEFAULT NULL, PRIMARY KEY (`vendorID`) USING BTREE, UNIQUE(`name`));';
        result = await rootAccess.query(sql);

        if (process.env.ENV_MODE == "development") {
            console.log('Create vendors Table:');
            console.log(sql);
            console.log(result);
        }
    }
    catch (err) {
        console.log("Error While creating vendors!!!");
    }

    try {
        console.log("Create applications Table");
        sql = 'CREATE TABLE IF NOT EXISTS ' + process.env.DATABASE + '.`applications` (`applicationID` INT(11) NOT NULL AUTO_INCREMENT, `vendorID` INT(11) NOT NULL, `name` VARCHAR(50) NOT NULL, `url` VARCHAR(2048) NULL DEFAULT NULL, `description` VARCHAR(2048) NULL DEFAULT NULL, `displayPhoto` LONGBLOB NULL DEFAULT NULL, `price` double NOT NULL, PRIMARY KEY (`applicationID`) USING BTREE, UNIQUE(`name`), CONSTRAINT `FK_APPLICATION_VENDOR` FOREIGN KEY (`vendorID`) REFERENCES `vendors` (`vendorID`) ON UPDATE NO ACTION ON DELETE NO ACTION);';
        result = await rootAccess.query(sql);

        if (process.env.ENV_MODE == "development") {
            console.log('Create applications Table:');
            console.log(sql);
            console.log(result);
        }
    }
    catch (err) {
        console.log("Error While creating applications!!!");
    }

    try {
        console.log("Create categoryGroups table");
        sql = 'CREATE TABLE IF NOT EXISTS ' + process.env.DATABASE + '.`categoryGroups` (`applicationID` INT(11) NOT NULL, `categoryID` INT(11) NOT NULL, PRIMARY KEY (`applicationID`,`categoryID`), CONSTRAINT `FK_CATEGORY_GROUP_APPLICATION` FOREIGN KEY (`applicationID`) REFERENCES `applications` (`applicationID`) ON UPDATE NO ACTION ON DELETE CASCADE, CONSTRAINT `FK_CATEGORY_GROUP_CATEGORY` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`categoryID`) ON UPDATE NO ACTION ON DELETE CASCADE);';
        result = await rootAccess.query(sql);

        if (process.env.ENV_MODE == "development") {
            console.log('Create categoryGroups Table:');
            console.log(sql);
            console.log(result);
        }
    }
    catch (err) {
        console.log("Error While creating categoryGroups!!!");
    }

    try {
        console.log("Create platformGroups table");
        sql = 'CREATE TABLE IF NOT EXISTS ' + process.env.DATABASE + '.`platformGroups` (`applicationID` INT(11) NOT NULL, `platformID` INT(11) NOT NULL, PRIMARY KEY (`applicationID`, `platformID`), CONSTRAINT `FK_PLATFORM_GROUP_APPLICATION` FOREIGN KEY (`applicationID`) REFERENCES `applications` (`applicationID`) ON UPDATE NO ACTION ON DELETE CASCADE, CONSTRAINT `FK_PLATFORM_GROUP_PLATFORM` FOREIGN KEY (`platformID`) REFERENCES `platforms` (`platformID`) ON UPDATE NO ACTION ON DELETE CASCADE);';
        result = await rootAccess.query(sql);

        if (process.env.ENV_MODE == "development") {
            console.log('Create platformGroups Table:');
            console.log(sql);
            console.log(result);
        }
    }
    catch (err) {
        throw (err);
    }

    try {
        console.log("Create applicationRatings table");
        sql = 'CREATE TABLE IF NOT EXISTS ' + process.env.DATABASE + '.`applicationRatings` (`applicationID` INT(11) NOT NULL, `userID` INT(11) NOT NULL, `rating` INT(1) UNSIGNED NOT NULL, `title` VARCHAR(60) NOT NULL, `likeComments` VARCHAR(2048) NOT NULL, `dislikeComments` VARCHAR(2048) NOT NULL, PRIMARY KEY (`applicationID`, `userID`), CONSTRAINT `FK_RATING_APPLICATION` FOREIGN KEY (`applicationID`) REFERENCES `applications` (`applicationID`) ON UPDATE NO ACTION ON DELETE CASCADE, CONSTRAINT `FK_RATING_USER` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON UPDATE NO ACTION ON DELETE CASCADE);';
        result = await rootAccess.query(sql);

        if (process.env.ENV_MODE == "development") {
            console.log('Create applicationRatings Table:');
            console.log(sql);
            console.log(result);
        }
    }
    catch (err) {
        throw (err);
    }

    // Create Views
    try {
        console.log("Create ApplicationView View ");
        sql = 'CREATE OR REPLACE VIEW ' + process.env.DATABASE + '.`applicationView` AS SELECT applications.applicationID, applications.vendorID, vendors.name vendor, applications.name, applications.url, applications.price, applications.displayPhoto, applications.description FROM ' + process.env.DATABASE + '.applications INNER JOIN ' + process.env.DATABASE + '.vendors ON (vendors.vendorID = applications.vendorID);';
        result = await rootAccess.query(sql);

        if (process.env.ENV_MODE == "development") {
            console.log('Create ApplicationView View:');
            console.log(sql);
            console.log(result);
        }
    }
    catch (err) {
        throw (err);
    }


    try {
        console.log("Create applicationTopView view");
        sql = 'CREATE OR REPLACE VIEW ' + process.env.DATABASE + '.`applicationTopView` AS SELECT applications.applicationID, applications.name, vendors.vendorID, vendors.name vendor, categories.categoryID, categories.name category, platforms.platformID, platforms.name platform, applications.url, applications.price, applications.displayPhoto, applications.description FROM ((' + process.env.DATABASE + '.`applications` INNER JOIN ' + process.env.DATABASE + '.`vendors` ON (vendors.vendorID = applications.vendorID)) LEFT JOIN ' + process.env.DATABASE + '.`platformGroups` ON (platformGroups.applicationID = applications.applicationID)) LEFT JOIN ' + process.env.DATABASE + '.`categoryGroups` ON (categoryGroups.applicationID = applications.applicationID) LEFT JOIN ' + process.env.DATABASE + '.`platforms` ON (platforms.platformID = platformGroups.platformID) LEFT JOIN ' + process.env.DATABASE + '.`categories` ON (categories.categoryID = categoryGroups.categoryID);';

        result = await rootAccess.query(sql);

        if (process.env.ENV_MODE == "development") {
            console.log('Create applicationTopView view:');
            console.log(sql);
            console.log(result);
        }
    }
    catch (err) {
        throw (err);
    }
}

module.exports.deleteDatabase = async function deleteDatabase(dbRoot, dbRootPassword) {
    var rootAccess = mdb.createPool({
        host: process.env.DATABASE_HOST,
        user: dbRoot,
        password: dbRootPassword,
        allowPublicKeyRetrieval: true
    });

    let sql;
    let result;

    // Drop the database
    try {

        console.log("delete database user");
        sql = 'DROP USER IF EXISTS ' + process.env.DATABASE_USER + '@' + process.env.DATABASE_HOST;
        result = await rootAccess.query(sql);

        if (process.env.ENV_MODE == "development") {
            console.log('Delete database user:');
            console.log(sql);
            console.log(result);
        }

        console.log("delete database");
        sql = 'DROP DATABASE IF EXISTS ' + process.env.DATABASE + ';';
        result = await rootAccess.query(sql);

        if (process.env.ENV_MODE == "development") {
            console.log('Delete database:');
            console.log(sql);
            console.log(result);
        }
    }
    catch (err) {
        console.log("Error While deleting database!!!");
    }
}

// The following command line is based on the following URL 
// https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/

// Run the database setup
if (process.argv.length > 4) {
    // Check Database and create it if database created already.
    console.log(process.argv[2] + " database script activated!!!");
    console.log("Database: " + process.env.DATABASE + "@" + process.env.DATABASE_HOST + " Root username: " + process.argv[3] + " with password: " + process.argv[4]);
    try {
        // process.argv[3] -- This the root username for database creation
        const rootUsername = process.argv[3];

        // process.argv[4] -- This the root password for database creation
        const rootPassword = process.argv[4]

        if (process.argv[2] == "create") {
            this.createDatabase(rootUsername, rootPassword).then(async result => {
                let seeds = require('./initSeeds');

                console.log('Create Seeds....');

                // create Users table seeds
                await seeds.createUsers();

                // create Application table seeds
                await seeds.createApplications();

                // create Rating seeds
                await seeds.createRatings();

                console.log('done!!!');
            });
        }
        else if (process.argv[2] == "delete") {
            this.deleteDatabase(rootUsername, rootPassword).then(async result => {
                console.log('done!!!');
            });
        } else if (process.argv[2] == "test") {
            let tests = require('./sandbox');

            tests.runTests();
        }
    }
    catch (err) {
        console.log(err)
    }
}
