const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const path = require('path');
const JWT = require(path.join(__dirname, 'lib', 'jwt.js'));
const Pkg = require(path.join(__dirname, '../', 'package.json'));

const app = express();

app.set('port', process.env.PORT || 3000);


// Register middleware that parses the request payload.
app.use(bodyParser.raw({
  type: 'application/jwt'
}));


app.use(express.static(path.join(__dirname, '../public')));


//All logic for save endpoint
app.post('/save', function (req, res) {
  res.status(200);
  res.send({
    route: 'save'
  });
});


//All logic for publis endpoint
app.post('/publish', function (req, res) {
  res.status(200);
  res.send({
    route: 'publish'
  });
});


//All logic for validate endpoint
app.post('/validate', function (req, res) {
  res.status(200);
  res.send({
    route: 'validate'
  });
});


//All logic for execute endpoint and JWT decoding
app.post('/execute', function (req, res) {


  JWT(req.body, Pkg.options.salesforce.marketingCloud.jwtSecret, (err, decoded) => {

    if (err) {
      console.log("ERR: " + err);
      return res.status(401).end();
    }
    if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {

        //Here you have all you body decoded from JWT, you only have to work with params and manage response (200 or 400)
        res.status(200);
        res.send({
            route: 'execute'
        });
    } else {
      console.error('inArguments invalid.');
      return res.status(400).end();
    }



  });


 

});


//This function allows you to extract Field name from In Arguments on body
function extractFieldName(field) {
  var stringField = field.toString();
  var index = stringField.lastIndexOf('.');
  return field.toString().substring(index + 1);
}


app.listen(app.get('port'), () => console.log('App listening on port ' + app.get('port')))
