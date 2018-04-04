const LocalStrategy   = require('passport-local').Strategy;
const db=require("../bin/db/db.js");
const bCrypt = require('bcrypt-nodejs');

module.exports=function (passport) {
    passport.use("sign-up",new LocalStrategy({
            passwordField : 'password',
            usernameField : 'email',
            passReqToCallback : true
    },
        function (req,email,password,done){
            db.user.findOne({'email':email}).then(async function (data) {
                if(data)
                {
                    done(new Error("user already exists"));
                }
                let newUser=new db.user;
                newUser.password = createHash(password);
                newUser.email = email;
                await newUser.save(function(err) {
                    if (err){
                        console.log('Error in Saving user: '+err);
                        throw err;
                    }
                    req.session.auth=true;
                    console.log(req.session);
                    console.log('User Registration successful');
                    return done(null,newUser);
                });

            }).catch(function (err) {
                console.log(err.message);
                return done(err);
            })

        })
    )
    const createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
}
