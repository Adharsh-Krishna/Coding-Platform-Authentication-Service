var express=require('express');

let rand=require('randomstring');
let mailer=require('nodemailer');
var sessionOpts = {
    saveUninitialized: true, // saved new sessions
    resave: false, // do not automatically write to the session store
    secret: 'mySecretKey',
    cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires
}

var app = express();
var passport = require('passport');

var expressSession = require('express-session');
app.use(expressSession({
    key: 'user_sid',
    secret: 'abcd123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 1000
    }
}));

let db=require('../bin/db/db.js');

app.use(passport.initialize());
app.use(passport.session(sessionOpts));

const initPassport = require('../passport/init.js');
initPassport(passport);

var login=require('../routes/login.js')(passport);
app.use('/',login);

var signup=require("../routes/signup.js")(passport);
app.use('/signup',signup);

let key=require('../bin/secret/secret.js');

transporter = mailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure : false,
    service: 'gmail',
    auth: {
        user: key.email,
        pass: key.pass
    }
});
otp_generator=async function (req,res) {

        let new_otp=rand.generate(8);
    let mailOptions = {
        from: key.email,
        to: req.body.email,
        subject: 'OTP  for  '+JSON.stringify(req.body.email),
        text: 'OTP is : '+new_otp
    };
        await db.user.update({email:req.body.email},{$set:{otp:new_otp,otp_date:Date.now()}}).then(function (data) {
            if(data===undefined || data===null || data==="")
            {
                throw new Error("something wrong");
            }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.status(200);
            res.end(new_otp);
        }).catch(function (err) {
            res.status(500);
            res.end("failure");
        })
}

get_otp=async function(req,res){
    await db.user.findOne({email:req.body.email},"otp otp_date").then(function(data){
        if(data===undefined || data===null || data==="")
        {
            throw new Error("Something wrong");
        }
        res.status(200);
        res.end(JSON.stringify(data));
    }).catch(function(err){
        console.log(err.message);
        res.status(500);
        res.end("failure");
    });
}

app.post('/generate-otp',function (req,res) {
    otp_generator(req,res);
});

app.post('/get-otp',function(req,res){
    get_otp(req,res);
});


module.exports = app;
