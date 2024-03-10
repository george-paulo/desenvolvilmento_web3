const initializeAdminController = require('./AdminController');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SEGREDO_JWT
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log('verificação jwt', jwt_payload);
    const adminController = await initializeAdminController();
    const admin = await adminController.Admin.findOne({ where: { id: jwt_payload.id } });
    if (admin) {
        return done(null, admin);
    } else {
        return done(null, false);
    }
}));

module.exports = passport;