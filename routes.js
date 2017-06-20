/*
 * File : routes.js
 */

'use strict';

// load all the things we need
var path = require('path'),
  questionnaire = require('./controllers/questionnaire'),
  configAuth = require('./config/auth'),
  users = require('./controllers/users'),
  platforms = require('./controllers/platforms'),
  jwt = require('jsonwebtoken'),
  log = require('./config/logger.js').logger;

var appRouter = function (app, passport) {

  // Default API
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '', './UI/index.html'));
  });

  // ============================= Set up the RESTful APIs ==================================

  // API to create Questionnaire
   app.route("/api/createQuestionnaire")
     .post(questionnaire.createQuestionnaire)

     // API to get Questionnaire
  app.route("/api/getQuestionnaire")
    .get(questionnaire.getQuestionnaire)

  // API to create platform
   app.route('/api/createPlatform')
     .post(platforms.createPlatform);

     // API to get platform
  app.route("/api/getPlatform")
    .get(platforms.getPlatform)

  // API to update selected questionnaires in user profiles.
  app.route('/api/updateUserSelectedQuestionnaires')
    .put(users.updateUserSelectedQuestionnaires);

  // API to get selected questionnaires for user.
  app.route('/api/getSelectedQuestionnaires')
    .get(users.getSelectedQuestionnaires);

  // API to update matched platform in user profiles.
  app.route('/api/updateUserMatchedPlatforms')
    .put(users.updateUserMatchedPlatforms);

  // API to update matched platform in user profiles.
 // app.route('/api/updateUserMatchedPlatforms2')
  //  .put(users.updateUserMatchedPlatforms2);

  // API to get matched platform for user.
  app.route('/api/getMatchedPlatforms')
    .get(users.getMatchedPlatforms);

  // API to get matched platform for user.
  //app.route('/api/getMatchedPlatforms2')
 //   .get(users.getMatchedPlatforms2);

  // Register new users
  app.route('/api/register')
    .post(users.userRegistration);


  // ========================================
  // START LOCAL-LOGIN ROUTES ===============
  // ========================================

  // Authenticate the user and create a JSON Web Token for future convenince.
  // User login API (Note : local users only)
  app.route('/auth/login')
    .post(function (req, res, next) {
      passport.authenticate('local-login', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) {
          log.error({ status : 200, success: false, message: info.message });
          res.status(200).json({ success: false, message: info.message });
        }
        // This function calls passport.serializeUser() automatically.
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          } else {
            // {id : user._id, email : user.email}
            var token = jwt.sign({ id: user._id, email: user.email }, configAuth.secret, {
              expiresIn: configAuth.tokenExpiresIn
            });

            res.status(200).json({ success: true, token: 'JWT ' + token });
          }
        });

      })(req, res, next);
    });
  // ========================================
  // END LOCAL-LOGIN ROUTES =================
  // ========================================


  // ========================================
  // START FACEBOOK ROUTES ==================
  // ========================================

  // route for facebook authentication and login
  app.route('/auth/facebook')
    .get(passport.authenticate('facebook', { scope: ['email'] }));

  // handle the callback after facebook has authenticated the user
  app.route('/auth/facebook/callback')
    .get(function (req, res, next) {
      passport.authenticate('facebook', function (err, user, userExists) {
        if (err) { return next(err); }
        if (!user) { 
          res.sendFile(path.join(__dirname, '', './views/index.html'));
        //  console.log(req.connection.remoteAddress)
        //  console.log(req.socket.remoteAddress)
          //  res.render('http://52.53.118.133:1081/#/Questionnaire', {
          //       user : user // get the user out of session and pass to template
          //   });


          //Here's my redirect - the router is listening for this route and will render accordingly
         // res.redirect("http://52.53.118.133:1081/#/Questionnaire");
         // res.status(200).json({ success: false, message: "Email address already exists."});
          return;
        }
        if (userExists) {
          var token = jwt.sign(user, configAuth.secret, {
            expiresIn: 231
          });
          res.status(200).json({ success: true, data: user, token: 'JWT ' + token });
          return;
        }

        // This function calls passport.serializeUser() automatically.
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          } else {
            var token = jwt.sign(user, configAuth.secret, {
              expiresIn: configAuth.tokenExpiresIn
            });
            // return response with TWT Token
            res.status(200).json({ success: true, data: user, token: 'JWT ' + token });
          }
        });
      })(req, res, next);
    });

  // =========================================
  // END FACEBOOK ROUTES =====================
  // =========================================



  // =========================================
  // START GOOGLE ROUTES =====================
  // =========================================

  // GET /auth/google
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in Google authentication will involve redirecting
  //   the user to google.com.  After authorization, Google will redirect the user
  //   back to this application at /auth/google/callback
  app.route('/auth/google')
    .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

  // GET /auth/google/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.route('/auth/google/callback')
    .get(function (req, res, next) {
      passport.authenticate('google', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) {
          log.error({ status : 200, success: false, message: info.message });
          res.status(200).json({ success: false, message: info.message });
          return;
        }

        // This function calls passport.serializeUser() automatically.
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          } else {
            // create the user token
            var token = jwt.sign(user, configAuth.secret, {
              expiresIn: configAuth.tokenExpiresIn// Expiry date of user token
            });
            // return response with TWT Token
            res.status(200).json({ success: true, token: 'JWT ' + token });
          }
        });
      })(req, res, next);
    });

  // =========================================
  // END GOOGLE ROUTES =======================
  // =========================================


  // Update user
  app.route('/api/updateUser')
    .put(
    passport.authenticate('jwt', { session: false }), function (req, res, next) {
      next()// user is authorized.
    }, users.updateUser);

  // Change password of the user
  app.route('/api/changePassword')
    .put(passport.authenticate('jwt', { session: false }), function (req, res, next) {
      next()// user is authorized.
    }, users.changePassword);

  // Forgot password authentication
  app.route('/auth/forgotPassword')
    .post(users.forgotPassword);

  // Reset password of the user
  app.route('/auth/resetPassword')
    .post(users.resetPassword);

  // Get user details
  app.route('/api/getUserDetails')
    .get(passport.authenticate('jwt', { session: false }), function (req, res, next) {
      next()// user is authorized.
    }, users.getUserDetails);

  // Get user details
  app.route('/api/checkEmailExistance')
    .post(users.checkEmailExistance);

}


module.exports = appRouter;