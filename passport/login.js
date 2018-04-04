const LocalStrategy   = require('passport-local').Strategy;
let db = require('../bin/db/db.js');
const bCrypt = require('bcrypt-nodejs');

module.exports=function (passport) {

    passport.use("login",new LocalStrategy({
        usernameField:'email',
        passwordField : 'password',
        passReqToCallback : true
    },
        function (req,email,password,done) {
        if(!check_values===true)
        {
            console.log("values incorrect");
            done(new Error("provide correct values"));
        }
            db.user.findOne({'email':email}).then((function (data) {
                if(data===undefined)
                {
                    console.log("user does not exists");
                    done(new Error("user does not exist"));
                }
                else if (!isValidPassword(data, password)){
                    console.log('Invalid Password');
                    return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                }
                req.session.auth=true;
                console.log(req.session);
                done(null,data);
            })).catch(function (err) {
                console.log(err.message);
                done(err);
            })
        })
    )

    let isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
    
    let check_values=function (email,password) {
        if(email && password)
        {
            return true;
        }
        return false;
    }
}