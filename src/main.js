var GroupMe = require('groupme');
var API = GroupMe.Stateless;
const sheets = require('./sheets.js');
require('dotenv').config();
var BOT_IDS = {};
const GROUP_IDS = process.env.GROUP_IDS.split(',');

var incoming = new GroupMe.IncomingStream(process.env.ACCESS_TOKEN, process.env.USER_ID, null);
console.log('Succesfully got incoming stream');

// This waits for the IncomingStream to complete its handshake and start listening.
// We then get the bot id for each group the bot is listening to.
incoming.on('connected', function () {
  console.log("[IncomingStream 'connected']");
  GROUP_IDS.map((GROUP_ID) => {
    API.Bots.index(process.env.ACCESS_TOKEN, function (err, ret) {
      if (!err) {
        for (var i = 0; i < ret.length; i++) {
          if (ret[i].group_id == GROUP_ID) {
            bot_id = ret[i].bot_id;
            BOT_IDS[GROUP_ID] = bot_id;
            console.log("[API.Bots.index return] Firing up bot!", GROUP_ID, bot_id);
          }
        }
      }
    });
  });
});

// This waits for messages coming in from the IncomingStream
// If the message starts with /link, we run the query code.
incoming.on('message', function (msg) {
  console.log("[IncomingStream 'message'] Message Received");
  console.log(msg);

  if (msg["channel"] === "/meta/connect") {
    console.log("Reconnecting");
    incoming.disconnect();
    incoming.connect();
  }


  if (msg["data"]
    && msg["data"]["subject"]
    && msg["data"]["subject"]["text"]) {
    const botRegex = /^\/link (.*)$/;
    const messageText = msg["data"]["subject"]["text"];
    const group_id = msg["data"]["subject"]["group_id"];
    const bot_id = BOT_IDS[group_id];

    // Check if the GroupMe message has content and if the regex pattern is true
    if (messageText && botRegex.test(messageText) && bot_id !== undefined) {
      const search = messageText.match(botRegex)[1];
      console.log(search);
      var resultArray = [];
      sheets.searchResults(search, (result) => resultArray.push(result));
      message = resultArray.join('\n');
      if (message === '') {
        message = 'No results found. Make a new chat and put it in the sheet!'
      }

      API.Bots.post(
        process.env.ACCESS_TOKEN, // Identify the access token
        bot_id, // Identify the bot that is sending the message
        message, // Construct the message
        {}, // No pictures related to this post
        function (err, res) {
          if (err) {
            console.log("[API.Bots.post] Reply Message Error!");
          } else {
            console.log("[API.Bots.post] Reply Message Sent!");
          }
        });
    }
  }
})

// This listens for the bot to disconnect
incoming.on('disconnected', function () {
  console.log("[IncomingStream 'disconnect']");
});

// This listens for an error to occur on the Websockets IncomingStream.
incoming.on('error', function () {
  var args = Array.prototype.slice.call(arguments);
  retryCount = 0;
  console.log("[IncomingStream 'error']", args);
  if (retryCount > 3) {
    retryCount = retryCount - 1;
    incoming.connect();
  }
});


// This starts the connection process for the IncomingStream
incoming.connect();
