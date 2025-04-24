const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const keys = require('./keys');

/**
 * Configure and initialize Passport JWT strategy
 */
const configurePassport = () => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwtSecret
  };

  passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
      try {
        // Find user by ID from JWT payload
        const user = await User.findById(jwtPayload.id);

        if (user) {
          return done(null, user);
        }
        
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );

  return passport;
};

module.exports = configurePassport; 