var express = require('express');
var router = express.Router();



destroy_cookie=function (req,res,next) {
    if (req.cookies.user_sid && !req.session.user) {
        console.log("destroy cookie called");
        res.clearCookie('user_sid');
    }
    console.log(res.cookies);
    next();
};

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods"," GET, PUT, POST, DELETE, HEAD");
    next();
});

module.exports = function(passport) {

    router.get('/', destroy_cookie, function (req, res) {
        req.session.auth=false;
        console.log(req.session);
        res.render('Login/login.html', {title: ' Login Page '});
    });

/*    router.post('/login', passport.authenticate('login', {
        successRedirect: 'http://localhost:8080/',
        failureRedirect: '/',
        failureFlash: true}));*/

router.post('/login',function (req,res) {
    passport.authenticate('login',function (err,user) {
        console.log("here");
        if(err)
        {
            res.status(500);
            res.end("failure");
        }
        if(!user)
        {
            res.status(500);
            res.end("does not exist");
        }

            res.status(200);
            res.json({user_id:user.id,user_type:user.type});
    })(req, res);
});

return router;
}

//
// app.get('/login', function(req, res, next) {
//     passport.authenticate('local', function(err, user, info) {
//         if (err) { return next(err); }
//         if (!user) { return res.redirect('/login'); }
//         req.logIn(user, function(err) {
//             if (err) { return next(err); }
//             return res.redirect('/users/' + user.username);
//         });
//     })(req, res, next);
// });

