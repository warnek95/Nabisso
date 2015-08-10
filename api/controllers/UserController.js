/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var ObjectId = require('mongodb').ObjectID;

module.exports = {
	new: function (req, res) {
		var error = '';
		if (req.session.errorSignUp) {
			error = req.session.errorSignUp;
		}
		req.session.errorSignUp = '';
			res.view({
				errors: error
			});
	},
	// addFav: function (req, res) {
	// 	UserDAO.find(req.session.User.Id, function userFound(user){
	// 		if(!user) return next('User doesn\'t exist.');
	// 		user = user[0]
	// 		user.Favorites = user.Favorites.replace(/\'/g,'');
	// 		var Favorites = JSON.parse(user.Favorites);
	// 		Favorites.Favorites.push({ 
	// 			videoId: req.param('VideoId'),
	// 			title: req.param('Title'),
	// 			link: req.param('Link')
	// 		})
	// 		var FavoritesStr = JSON.stringify(Favorites); 
	// 		UserDAO.addFav(req.session.User.Id,FavoritesStr, function favAdded(fav){
	// 			res.redirect(req.headers.referer.replace(req.headers.origin,''));
	// 		});
	// 	});
	// },
	create: function (req, res, next) {
		var error = new Object();
		var emailv = false;
	    var pseudov = false;
	    User.find({})
		.exec(function(err, users) {
			console.log(req.params.all())
			console.log(users)
			var Passwords = require('machinepack-passwords');

				// Encrypt a string using the BCrypt algorithm.
				Passwords.encryptPassword({
					password: req.param('mdp'),
				}).exec({
				// An unexpected error occurred.
				error: function (err){
					res.negotiate(err);
				},
				// OK.
				success: function (result){
					if (!req.param('mdp') || (req.param('mdp') != req.param('mdp2'))) {
				      error.errPass = true;
				    };

				    for (var i = users.length - 1; i >= 0; i--) {
				      if (users[i].Email == req.param('email')) emailv = true;
				      if (users[i].Pseudo == req.param('pseudo')) pseudov = true;
				    };
				    if(emailv ){
				      error.errEmail = true;
				    };
				    if(pseudov ){
				      error.errPseudo = true;
				    };
				    if (error.errEmail || error.errPseudo || error.errPass) {
					    req.session.errorSignUp = error;
					    res.redirect('/user/new');						    	
				    }else{
				    	User.create({ 
				    		pseudo: 	req.param('Pseudo'),
				    		lastName: 	req.param('LastName'),
							name: 		req.param('Name'),
							password: 	result,
							email: 		req.param('Email'),
							online: 	false,
							status: 	"user",
							viewed: 	new Array(),
						    voted: 		new Array(),
						    favorites: 	new Array()
						}, function userCreated (err, userCreated){
						if (err) return next(err);
						User.native(function(err, collection) {
						    collection.findOne(
							   {_id: new ObjectId(userCreated.id)}
							,function(err, userFound) {
								req.session.authenticated = true;
								req.session.User = userFound;
								// user.online = 1;
								res.redirect('/');
							})
						});
				    })
				}
			}
		})
	})
	},
	// show: function (req, res, next) {
	// 	UserDAO.find(req.session.User.Id, function userFound(user){
	// 		if(!user) return next('User doesn\'t exist.');
	// 		user[0].Voted = user[0].Voted.replace(/\'/g,'');
	// 		var Voted = JSON.parse(user[0].Voted);
	// 		user[0].Favorites = user[0].Favorites.replace(/\'/g,'');
	// 		var Favorites = JSON.parse(user[0].Favorites);
	// 		var FavoritesArr = Favorites.Favorites.slice(-6);
	// 		matched = FavoritesArr.filter(function(favs) {
	// 		    return !isNaN(favs.videoId)
	// 		});
	// 		res.view({
	// 			layout: 'layout3',
	// 			matched: matched,
	// 			user: user[0]
	// 		});
	// 	});
	// },
	// edit: function (req, res, next) {
	// 	req.session.passwordInUseNotValid = false;
	// 	if (req.param('passwordUsed') == '' ) {
	// 		UserDAO.update(req, function userFound(user){
	// 			if(!user) return next('User doesn\'t exist.');
	// 			res.redirect('/user/show/')
	// 		});
	// 	} else {
	// 		require('bcrypt').compare(req.param('passwordUsed'), req.session.User.Password, function (err, valid) {
	//         	if (!valid) {
	// 	            req.session.passwordInUseNotValid = true;
	// 		res.redirect('/user/show/')
	// 	        } else {
	// 	        	require('bcrypt').hash(req.param('newPassword'), 10, function passwordEncrypted(err, encryptedPassword) {
	// 			       	if (err) return next(err);
	// 			       	UserDAO.updatePass(req,encryptedPassword,function userFound(user){
	// 						if(!user) return next('User doesn\'t exist.');
	// 	            		req.session.User.Password = encryptedPassword;
	// 		res.redirect('/user/show/')
	// 					});
	// 			    });
	// 	        }
	// 		})
	// 	};
	// },
	// update: function (req, res, next) {
	// 	User.update(req, function userUpdated(){			
	// 		res.redirect('/user/show/' + req.param('id'));
	// 	});	
	// },
	// destroy: function (req, res, next) {
	// 	UserDAO.find(req.param('id'), function userFound(user){
	// 		if(!user) return next('User doesn\'t exist.');
	// 		UserDAO.destroy(req.param('id'), function userDestroyed(err){
	// 			if(err) return next(err);	
	// 		});
	// 		res.redirect('/session/destroy');
	// 	});
	// }
	//Promote users
};

