"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bearerToken = require('express-bearer-token');
const robots_1 = require("./robots");
const app = express()
    .use(cors())
    .use(bodyParser.json())
    //.use(bearerToken())
    //.use(oktaAuth)
    .use(robots_1.router);
app.listen(4201, () => {
    return console.log('My Node App listening on port 4201');
});
