const express = require("express");
var fs = require("fs");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

var OpenTok = require("opentok"),
  opentok = new OpenTok("46671412", "63cae316fd2bacf3b53d4bf3f4d867344ce5c839");

var SESSION_ID;
var QUALITY_SESSION_ID;

const port = 4000;
const server = express();

//allow cross-origin request
server.use(cors());

//connect to mlab database
mongoose.connect(
  "mongodb://sawan:sawan@graphql-learning-shard-00-00-bdbje.mongodb.net:27017,graphql-learning-shard-00-01-bdbje.mongodb.net:27017,graphql-learning-shard-00-02-bdbje.mongodb.net:27017/test?ssl=true&replicaSet=GraphQl-Learning-shard-0&authSource=admin&retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.once("open", () => {
  console.log("Connected to database");
});

server.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

// Before starting server we need two OpenTok session id's
// one for quality testing and one for our call
console.log("Creating OpenTok quality session...");
opentok.createSession({ mediaMode: "routed" }, function (error, result) {
  if (error) {
    console.log("Error creating quality session:", error);
    process.exit(1);
  } else {
    QUALITY_SESSION_ID = result.sessionId;
    console.log("Quality session created...");
  }
});
console.log("Creating OpenTok session...");
opentok.createSession({ mediaMode: "relayed" }, function (error, result) {
  if (error) {
    console.log("Error creating session:", error);
    process.exit(1);
  } else {
    SESSION_ID = result.sessionId;
    fs.writeFile("last_session.id", SESSION_ID, function (err) {
      if (err) {
        console.log("Error creating session:", err);
        process.exit(1);
      }

      // Session creation was successful,
      // now we start the server
      console.log("Session created...");
      start_server();
    });
  }
});

function start_server() {
  // Serve files for browser clients
  server.get("/", function (req, res) {
    // Serve index file
    res.type("html");
    res.sendFile(__dirname + "/index.html", {}, function (err) {});
    console.log("User arrived on root...");
  });
  server.get("/:dir/:name", function (req, res, next) {
    // Serve asset files
    var options = {
      root: __dirname + "/" + req.params.dir + "/",
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
      },
    };
    var fileName = req.params.name;
    console.log(fileName);
    res.sendFile(fileName, options, function (err) {
      if (err) {
        console.log(err);
        res.status(err.status).end();
      } else {
        console.log("Sent:", fileName);
      }
    });
  });

  // Send session id's stored in memory
  // when client requests it
  server.get("/quality.session.id", function (req, res) {
    var response = {
      sessionId: QUALITY_SESSION_ID,
    };

    res.type("json");
    res.send(JSON.stringify(response));
  });
  server.get("/session.id", function (req, res) {
    var response = {
      sessionId: SESSION_ID,
    };

    res.type("json");
    res.send(JSON.stringify(response));
  });

  // When client requests token,
  // generate token and send it
  server.get("/quality.token", function (req, res) {
    var token = opentok.generateToken(QUALITY_SESSION_ID);

    var response = {
      token: token,
    };

    res.type("json");
    res.send(JSON.stringify(response));
  });
  server.get("/token", function (req, res) {
    var token = opentok.generateToken(SESSION_ID);

    var response = {
      token: token,
    };

    res.type("json");
    res.send(JSON.stringify(response));
  });

  server.get("/getOpentokConfig", function (req, res) {
    var token = opentok.generateToken(QUALITY_SESSION_ID);

    var response = {
      sessionId: QUALITY_SESSION_ID,
      token: token,
      apiKey: "46671412",
    };

    res.type("json");
    res.send(JSON.stringify(response));
  });

  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}
