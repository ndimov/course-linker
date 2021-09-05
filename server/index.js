const express = require("express");
require('dotenv').config();
const cors = require('cors');
const https = require("https");
require('log-timestamp');
fs = require("fs");

// Make sure these certificates point to the right place
const options = {
    key: fs.readFileSync("/var/www/keys/private.key"),
    cert: fs.readFileSync("/var/www/keys/certificate.crt")
};

const sheets = require('./sheets.js');

const HTTP_PORT = 4990;
const PORT = process.env.SERVER_PORT || 5000;
const PASSWORD = process.env.PASSWORD;

const app = express();

app.use(cors({ origin: '*' }));

app.get("/data", (req, res) => {
    let password = req.query.p || '';
    if (password !== PASSWORD) {
        res.status(400).json({ error: "Password was invalid"});
        return
    }
    let search = req.query.q || '';
    res.json({ results: getMatchingGroups(search) });
});

app.listen(HTTP_PORT, () => {
    console.log(`HTTP server listening on ${HTTP_PORT}`);
});

https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server listening on ${PORT}`);
});

function getMatchingGroups(searchText) {
    // Check if the regex pattern is true
    console.log(`Running search for ${searchText}`);
    var resultArray = [];
    sheets.searchResults(searchText, (result) => resultArray.push(result));

    return resultArray;
}