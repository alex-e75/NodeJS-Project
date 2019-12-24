# Node.js Project

[![Build Status](https://travis-ci.org/alex-e75/NodeJS-Project.svg?branch=master)](https://travis-ci.org/alex-e75/NodeJS-Project)

The branch master is automatically deployed on Heroku : https://ece-node-project.herokuapp.com

## Introduction
Made by : Alexandre ELBAZ, Alexis CALLIES and Baptiste LAFAY

This project is a simple dashboard app made in NodeJS with the following features:
* User login
* A user can insert metrics
* A user can retrieve his metrics in a graph
* A user can only access his own metrics

## Installation

To be able to run the web server you must have node.js and npm installed.
To check if you have it installed run:
```
node -v
```
If by running this command it doesn't show you the version number, install it by following the instructions in [https://nodejs.org/](https://nodejs.org/).

After having node install
```
npm install
```

## Usage

Now you can start the web server in the terminal using the following command:
```
npm start
```

To see the website in the browser go to ```localhost:8080/```.

## Populate script

In order to populate the database with random data
```
npm run populate
```

Demo users:

`username: test` 
`password: test`

## Unit testing

To execute unit tests run :
`npm run test`


## Contributors

[Alexandre ELBAZ](https://github.com/alex-e75)

[Alexis CALLIES](https://github.com/alexicali)

[Baptiste LAFAY](https://github.com/balaf78)


## License

```
MIT License

Copyright (c) 2019 Alexandre ELBAZ, Alexis CALLIES, Baptiste LAFAY

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
