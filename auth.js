const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

/*Please note if you are trying to steal and 
use this idthen let me tell u that you are fool. 

Aarigato!!
*/

require('dotenv').config()

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    
      return done(null, profile);
   
  }
));

passport.serializeUser((user,done)=>{
    done(null,user);
})

passport.deserializeUser((user,done)=>{
    done(null,user);
})