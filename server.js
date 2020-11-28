require('dotenv').config();
const https = require('https');
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');

const fccTestingRoutes = require('./routes/fcctesting.js');
const apiRoutes = require('./routes/api.js');
const runner = require('./test-runner');

const app = express();

// Log all requests
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`${Date.now()}: ${req.method} ${req.path} - ${req.ip}`);
  }
  next();
});

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Index page (static HTML)
app.route('/')
  .get(function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

// User routes
apiRoutes(app);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Setup server and use SSL if enabled
let server;
let PORT;
if (!!process.env.ENABLE_SSL) {
  const certOptions = {
    key: fs.readFileSync(path.resolve('certs/server.key')),
    cert: fs.readFileSync(path.resolve('certs/server.crt')),
  };

  server = https.createServer(certOptions, app);
  PORT = process.env.PORT || 8443;
} else {
  server = app;
  PORT = process.env.PORT || 3000;
}

//Start our server and tests!
const listener = server.listen(PORT, function() {
  console.log(`Listening on port ${listener.address().port}`);
  // process.env.NODE_ENV='test'
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function() {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // for testing
