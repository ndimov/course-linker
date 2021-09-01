// Authorization code is from https://developers.google.com/sheets/api/quickstart/nodejs
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
var fileContent;
var search;
var sendMessage;
var savedRows;

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  fileContent = content;
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Saves the data from the given spreadsheet locally so that queries can be made against it.
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getData(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: process.env.RANGE,
  }, (err, res) => {
    console.log('Spreadsheet data retrieved');
    if (err) return console.log('The API returned an error: ' + err);
    savedRows = res.data.values;
  });
}

function doSearch() {
  const searchStr = search.toLowerCase();
  const rows = savedRows;
  rows.map((row) => {
    const classCode = row[0] || '';
    const className = row[1] || '';
    const additionalInfo = row[2] || '';
    const link = row[3];
    // Check if the class code or class name contain the search string
    if(classCode && classCode.toLowerCase().includes(searchStr) || className.toLowerCase().includes(searchStr)) {
      var msg;
      msg = {
        code: classCode,
        name: className,
        extra: additionalInfo,
        link: link
      }
      console.log(msg);
      sendMessage(msg);
    }
  })
}

exports.searchResults = (searchArg, sendMessageArg) => {
  search = searchArg;
  sendMessage = sendMessageArg;
  doSearch();
}

function updateData() {
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(fileContent), getData);
}

setTimeout(updateData, 3000);
setInterval(updateData, 60 * 1000);
