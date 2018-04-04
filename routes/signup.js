var express = require('express');
var router = express.Router();

// const cont=require("../controllers/login-controller.js");

module.exports = function(passport) {

    router.get('/', function (req, res) {
        req.session.auth=false;
        console.log(req.session);
        res.render('signup.html', {title: ' Register Page '});
    });

    router.post('/confirm', passport.authenticate('sign-up', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash : true
    }));

    return router;
}