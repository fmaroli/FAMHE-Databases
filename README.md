# FAMHE

### Description
This is a project of an applications database, you can search for an application with keywords, category, or platform.
The main idea is storing application cross platform, so you can search for video editing software acrross all OS.

### About
This is an Agile  software project for a team of student in Univeristry of London.

- Enrique Condes
- Fernando Maroli
- Mohammad ASFARi

## How to run

### Prerequisite
- [Node.JS](https://nodejs.org/en/download/ "npm Node.JS")
- NPM (Installed along with Node.js)
- Database - [MariaDB](https://mariadb.org/download/ "MariaDB"), install mariadb and [HeidiSQL](https://www.heidisql.com/download.php "HeidiSQL") for manipulating the database and test SQL
- [Microsoft Visual Studio Code](https://visualstudio.microsoft.com/downloads/ "Microsoft Visual Studio Code")

### Steps
- Clone the project
- change directory to FAMHE
- `code .`
- once Visual Studio opened, open terminal window
- type: `npm install` (only required the first time)
- type: `node ./bin/database.js create root yourPassword` (only for the first time to create database, user, tables, and seeds)
    root : this is root username (default _root_) for mariaDB
    yourPassword : this is root password for mariaDB
    The password will usually configured during the installation of mariaDB engine
- type: `npm start`
- open favorite browser and type localhost:3000 in the address bar

### Delete Database 
if you need to clean the database user and database:
- type: `node ./bin/database.js delete root yourPassword` (Warning: this is will clear all data inside FAMHE database)
    root : this is root username (default _root_) for mariaDB
    yourPassword : this is root password for mariaDB
    The password will usually configured during the installation of mariaDB engine
