# GroupMe Chat Linker

My university makes a lot of group chats for different classes. Given a spreadsheet with course data and GroupMe links, this provides a web frontend to help users find the link for their classes without needing to open the spreadsheet.

## Usage

Enter the password in the password field (to avoid GroupMe bots) and the search query in the search field. The bot will return matching course information and their corresponding links.

A course is matched if the query string is fully contained in either the class code or the class name, ignoring case.

## Server Setup

First, copy `.env.example` to `.env`.

### Data Spreadsheet

* Create a spreadsheet to hold group chat data. The data should be formatted like this:
| Class Code | Class Name | Professor/Section | Group Chat Link |
| --- | --- | --- | --- |
| L24 Math 217 | Differential Equations | 01 | https://groupme.com/join\_group/[redacted]/ |
* Put the spreadsheet ID into `.env`. This will be the long string between slashes in the URL.
* Put the data range into `.env`, excluding the header row. If the Sheet is named `Classes` and the top-left header cell is `A1`, the range will be `Classes!A2:D999`.

### Google Sheets API

* [Enable the Google Sheets API](https://developers.google.com/sheets/api/quickstart/nodejs). Follow the instructions there to save the client configuration to a new `credentials.json` file.
* Run the project with `node sheets.js`. Follow the prompts to authorize access. This is Step 4 in the Quickstart guide linked above.

## Run

Run the server with `npm run server`. Make sure to change SERVER_URL in the client code (You can set it to empty string and it will use the localhost proxy in `package.json`)

Run the client with `npm start` in development. Run `npm deploy` to build and deploy the app to gh-pages.
