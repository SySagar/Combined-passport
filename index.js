const express =require('express');
const passport = require('passport');
const session = require ('express-session')
require('dotenv').config()
require('./auth');
const app =express()
const FacebookStrategy = require('passport-facebook');

app.use(session({secret: "cats" , resave : false}));
app.use(passport.initialize());
app.use(passport.session());

//This is for google login

function isLogged(req,res,next){
    req.user ? next() : res.sendStatus(401);
}

app.get('/', (req,res)=>{
    res.sendFile('./main.html', {root: __dirname });
    
})


app.get('/auth/google',
    passport.authenticate('google' , {scope : ['email', 'profile']})
    )

    app.get('/google/callback',
    passport.authenticate('google' , {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure'
    }))

    app.get('/auth/failure', (req,res)=>{
        res.send("INVALID LOGIN")
    })

    app.get('/protected', isLogged , (req,res)=>{
        res.send("hello u have successfully logged in!");
        //res.send(`${req.user.displayname}`)
    })

    app.get('/logout',(req,res)=>{
        req.logOut();
        res.send('Goodbye!');
    })



    // for facebook login

    app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/success');
  });

app.use('/login',(req ,res)=>{
    res.send('login failed')
})

app.get('/success',(req ,res)=>{
    res.send('login successful')
})

passport.serializeUser((user,cb)=>{
    cb(null , user);
})


passport.deserializeUser((obj,cb)=>{
    cb(null , obj);
})

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://login-form.cyclic.app/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.listen(3000,()=>{
    console.log("listening at 3000");
})