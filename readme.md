# Tower Defense Online

## Prerequisites

### [Node.js](https://nodejs.org)

Bring up a terminal and type `node --version`.
Node should respond with a version at or above 5.6.0.
If you require Node, go to [nodejs.org](https://nodejs.org) and click on the big green Install button.

### Local dependencies

Next, install the local dependencies ExpressJs requires:

```sh
$ npm install
```

That's it! You should now have everything needed to use the ExpressJs Application.

### DataBase MYSQL

#### Linux Mint

```sh
$ sudo apt-get install software-properties-common
$ sudo apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xcbcb082a1bb943db
$ sudo add-apt-repository 'deb http://mirror6.layerjet.com/mariadb/repo/10.1/ubuntu trusty main'

$ sudo apt-get update
$ sudo apt-get install mariadb-server
```

Start MariaDB Service

```sh
$ sudo service mysql start
```

Change password

```sh
$ sudo mysql_secure_installation
```

Access data base `mdp : 1234` (To change this value in the code it's on the file app.js line 52

```sh
$ sudo mysql -u root -p
```

Create dataBase

```sh
$ CREATE DATABASE TowerDefenseOnline;
```

Import the sqlFile "database/sql/dataBase.sql"

#### Windows

Install [mariaDb (table mysql)](https://mariadb.org/), create the DataBase "TowerDefenseOnline", import the sqlFile "database/sql/dataBase.sql" and after that launch the service "MYSQL" 

## Use 

Project test on Linux and Windows 10,7

```sh
$ node bin\www
```

## Implementation project

* Account system (session dataBase)
    * SignIn 
    * SignUp
    * SignOut
* MultyGame
* MultyPlayer
* Game with a dynamic difficulty by numberPlayer
* Sprite
* Sound
* Chat Game

## Todo List

* Refactoring Sockets communication -- With less calculating/Sending information by the server and add a fluid calculating and showing information by the client.
* Design

## Docs

[Socket.io](http://socket.io/docs/) : The documentation for use socket.io.
[Google fonts](https://www.google.com/fonts#) : Open-source fonts optimized for the web.
[Sass](http://sass-lang.com/) : Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.
[Jade](http://jade-lang.com/) : Jade is a terse language for writing HTML templates.
[We Love Icon Fonts](http://weloveiconfonts.com/) : This is a free & open source icon fonts hosting service.
[passport](http://passportjs.org/) : Simple, unobtrusive authentication for Node.js.
[bookshelf](http://bookshelfjs.org/) : Bookshelf is a JavaScript ORM for Node.js, built on the Knex SQL query builder.
[Howler](https://github.com/goldfire/howler.js) : howler.js is an audio library for the modern web.