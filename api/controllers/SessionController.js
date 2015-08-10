/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create: function(req, res, next) {
    User.findOne({pseudo: req.param('pseudo')})
    .exec(function(err, user) {
      if (user) {
        var Passwords = require('machinepack-passwords');

        // Compare a plaintext password attempt against an already-encrypted version.
        Passwords.checkPassword({
          passwordAttempt: req.param('mdp'),
          encryptedPassword: user.password,
        }).exec({
          // An unexpected error occurred.
          error: function (err){
           res.negotiate(err);
          },
          // Password attempt does not match already-encrypted version
          incorrect: function (){
           res.pseudoOrPasswordInvalid();
          },
          // OK.
          success: function (){
            req.session.authenticated = true;
            req.session.User = user;
            req.session.group = new Array();
            req.session.group.push(req.session.User.Pseudo)
            user.online = 1;
            User.update({ pseudo: req.param('pseudo')}, { online: true })
            .exec(function(err, users) {});
            res.logInSuccessfull();
          },
        });
      };
    })
	},
  createMob: function(req, res, next) {
    console.log(req.params.all())
    SessionDAO.findUserByPseudo(req.param('pseudo'), function (user){
      if(user) {
        require('bcrypt').compare(req.param('mdp'), user.Password, function (err, valid) {
          if (err) return next(err);
          if (!valid) {
            res.pseudoOrPasswordInvalid();
            return;
          }

          req.session.authenticated = true;
          req.session.User = user;
          req.session.group = new Array();
          req.session.group.push(req.session.User.Pseudo)
          user.online = 1;
          SessionDAO.userOnline(user, function () {
            // res.redirect(req.headers.referer.replace(req.headers.origin,''));
            res.logInSuccessfullMob(user);
          });
        });
      }
      else {
        res.redirect('/');
      }
    });
  },
	destroy: function(req, res, next) {
    User.findOne({pseudo: req.session.User.pseudo})
    .exec(function(err, user) {
      if (user) {
        User.update({ pseudo: req.param('pseudo')}, { online: false })
        .exec(function(err, users) {
          req.session.destroy();
          res.logOutSuccessfull();
        });
      }
    })
	}
};

