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

const { searchResults, getListings, addChat, validateLink } = require('./data.js');

const HTTP_PORT = 4990;
const PORT = process.env.SERVER_PORT || 5000;
const PASSWORD = process.env.PASSWORD;

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get("/data", (req, res) => {
    let password = req.query.password || '';
    if (password !== PASSWORD) {
        res.status(400).json({ error: "Password was invalid" });
        return
    }
    let search = req.query.search || '';
    let listing = req.query.listing || '';
    getMatchingGroups(search, listing)
        .then((results) => res.json({ results: results }));
});

// This endpoint adds a link to the database
app.post("/add", (req, res) => {
    console.log("Received /add request with following body:")
    console.log(req.body)
    if (!validateLink(req.body.link)) {
        res.status(400).json({ error: "Invalid link"});
    }
    else {
        addChat(req.body)
            .then((result) => { res.sendStatus(200) })
            .catch((error) => { res.status(500).json({ error: error }) })
    }
});

// This endpoint gets the active listings from the database, for instance
// which semesters have active group chats for them
app.get("/listings", (req, res) => {
    getListings().then((listings) => res.json(listings));
})

app.listen(HTTP_PORT, () => {
    console.log(`HTTP server listening on ${HTTP_PORT}`);
});

https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server listening on ${PORT}`);
});

async function getMatchingGroups(searchText, listing) {
    // Check if the regex pattern is true
    console.log(`Running search for \`${searchText}\` under listing \`${listing}\``);
    var resultArray = [];
    await searchResults(searchText, listing, (result) => resultArray.push(result));

    return resultArray;
}