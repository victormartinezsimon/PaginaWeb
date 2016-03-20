var express = require('express');
var app = express();

var nodemailer = require('nodemailer');
var credentials = require('./credentials.js')

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: credentials.gmail.user,
        pass: credentials.gmail.password
    }
};


// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);


// This responds with "Hello World" on the homepage
app.post('/sendEmail', function (req, response) {

    var mailOptions = {
    from: req.body.name + '|' + '<' + req.body.email + '>', // sender address
    to: 'victormartinezsimon@gmail.com', // list of receivers
    subject: 'Email contact', // Subject line
    text: req.body.msg, // plaintext body
  };


  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });

  response.writeHead(200, {"Content-Type": "application/json"});
  var json = JSON.stringify({ 
    result: "ok"
  });
  response.end(json);

})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

  // verify connection configuration
  transporter.verify(function(error, success) {
     if (error) {
          console.log(error);
     } else {
          console.log('Server is ready to take our messages');
     }
  });
})

