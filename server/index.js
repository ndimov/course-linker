const express = require("express");
require('dotenv').config();
const cors = require('cors');

const sheets = require('./sheets.js');

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

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

function getMatchingGroups(searchText) {
    // Check if the regex pattern is true
    console.log(`Running search for ${searchText}`);
    var resultArray = [];
    sheets.searchResults(searchText, (result) => resultArray.push(result));

    return resultArray;
}