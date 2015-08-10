/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 require('date-utils');
 var ObjectId = require('mongodb').ObjectID;
module.exports = {
	index: function(req, res, next){
		var videosOnly3 = new Array();
		var videos5 = new Array();
		Video.find({limit: 12, sort: 'createdAt DESC' })
		.exec(function(err, videosRecentes) {
			Video.find({limit: 12, sort: 'rating DESC' })
			.exec(function(err, videosMostRated) {
				Video.find({limit: 12, sort: 'views DESC' })
				.exec(function(err, videosPopulaires) {
					Video.find({where: {genres: 'Comedie' },limit: 12, sort: 'views DESC' })
					.exec(function(err, videosComedie) {
						Video.find({where: {genres: 'Thriller' },limit: 12, sort: 'views DESC' })
						.exec(function(err, videosThriller) {
							Video.find({where: {genres: 'Action' },limit: 12, sort: 'views DESC' })
							.exec(function(err, videosAction) {
								Video.find({where: {genres: 'Romance' },limit: 12, sort: 'views DESC' })
								.exec(function(err, videosRomance) {
									Video.find({where: {genres: 'Drame' },limit: 12, sort: 'views DESC' })
									.exec(function(err, videosDrame) {
										Video.find({where: {genres: 'Animation' },limit: 12, sort: 'views DESC' })
										.exec(function(err, videosAnimation) {
											Video.find({where: {genres: 'Fantastique' },limit: 12, sort: 'views DESC' })
											.exec(function(err, videosFantastique) {
												res.view({
													layout: 'layout2',
													videosRecentes: videosRecentes,
													videosMostRated: videosMostRated,
													videoCaroussel: videosOnly3,
													videosPopulaires: videosPopulaires,
													videosComedie: videosComedie,
													videosThriller: videosThriller,
													videosAction: videosAction,
													videosRomance: videosRomance,
													videosDrame: videosDrame,
													videosAnimation: videosAnimation,
													videosAnimation: videosFantastique,
													videosRecomm:videos5
												});
											})
										})
									})
								})
							})
						})
					})
				})
			})
		});
	},
	search: function (req, res, next) {
		Video.find({ title: { 'contains': req.param('Search') } })
		.exec(function(err, videosFounds) {
			res.view({
					videos: videosFounds,
			});
		})
	},
	films: function (req, res, next) {
		Video.find({ type: 'Film' })
		.exec(function(err, videosFounds) {
			res.view({
					videos: videosFounds,
			});
		})
	},
	series: function (req, res, next) {
		Video.find({ type: 'Serie' })
		.exec(function(err, videosFounds) {
			res.view({
					videos: videosFounds,
			});
		})
	},
	new: function (req, res, next) {
		Genre.find({})
		.exec(function(err, genres) {
			res.view({
				genres: genres
			});
		});
	},
	create: function (req, res, next) {
		Director.findOrCreate({ name: req.param('Director') },{ name: req.param('Director') })
		.exec(function(err, director) {})
		for (var i = req.param('Actors').length - 1; i >= 0; i--) {
			Actor.findOrCreate({ name: req.param('Actors')[i] },{ name: req.param('Actors')[i] })
			.exec(function(err, actor) {})
		};
		var newArray = new Array()
		var season = req.param('Type') == 'Serie' ? newArray : '';
		var pictures = new Array()
		var uploadPath = '../../assets/images';
		req.file('Pictures').upload({ dirname: uploadPath },function fileUploaded(err, files) {
			pictures.push({
		    	link: files[0].fd.replace('/home/dalmace/Documents/hmm/sailsServer/nabissoServ/assets',''),
		    	slide: 0
		    })
			if (err) return next(err);
			Video.create({ 
				title: req.param('Title'),
	  			releaseDate: new Date(req.param('ReleaseDate')),
			  	link: '',
			  	description: req.param('Description'),
			  	season: season,
			    pictures: pictures,
			    actors: req.param('Actors'),
			    genres: req.param('Genres'),
			    director: req.param('Director'),
			    views: 0,
			    rating: 0,
			    nbRating: 0,
			    comments: new Array(),
			    type: req.param('Type')
			}, function videoCreated (err, videoCreated){
				res.redirect('/');
	    	})
		})
	},
	toUpdate: function (req, res, next) {
		Video.find({ sort: 'title ASC' })
		.exec(function(err, videos) {
			res.view({
         		videos : videos
         	});
		})
	},
	update: function (req, res, next) {
		Genre.find( { sort: 'wording ASC' } )
		.exec(function(err, genres) {
			Video.native(function(err, collection) {
			    collection.findOne(
				   {_id: new ObjectId(req.param('Title'))}
				,function(err, videoFound) {
					res.view({
						video : videoFound,
						genres: genres
					});
				})
			});
		});
	},
	show: function (req, res, next) {
		var msg = '';
		var videos2 = new Array();
		Video.native(function(err, collection) {
		    collection.findOne(
			   {_id: new ObjectId(req.query.vi),
			   	title: req.query.vn}
			,function(err, videoFound) {
				videoFound.average = Math.round((videoFound.rating/videoFound.nbRating) * 100) / 100;
				var hasViewed = req.session.User.viewed.filter(function(viewed) {
				    return viewed.videoId == videoFound._id
				});
				var hasVoted = req.session.User.voted.filter(function(voted) {
				    return voted.videoId == videoFound._id
				});
				var hasFavoured = req.session.User.favorites.filter(function(favorites) {
				    return favorites.videoId == videoFound._id
				});

				if (hasViewed.length > 0 && new Date(hasViewed[0].lastValidDate) && new Date(hasViewed[0].lastValidDate).getDaysBetween(new Date()) < 1 ) {
					msg = 'nope';
				}else if(hasViewed.length > 0 && new Date(hasViewed[0].lastValidDate) && new Date(hasViewed[0].lastValidDate).getDaysBetween(new Date()) >= 1 ){
					msg = 'yup1';
					Video.native(function(err, collection) {
						collection.update(
						   {_id: new ObjectId(req.query.vi),
			   				title: req.query.vn},
						   { $inc: { views: 1 } }
						,function(err, videoUpdated) {
							for (var i = 0; i < req.session.User.viewed.length; i++) {
								if (req.session.User.viewed[i].videoId == videoFound._id) {
									req.session.User.viewed[i].lastValidDate = new Date();
								}
							};
						})
						
					})
				}else{
					msg = 'yup2';
					Video.native(function(err, collection) {
						collection.update(
						   {_id: new ObjectId(req.query.vi),
			   				title: req.query.vn},
						   { $inc: { views: 1 } }
						,function(err, userUpdated) {
							req.session.User.viewed.push(
								{
									"videoId":videoFound._id,
									"lastValidDate":new Date()
								}
							)
						})
					})
				}
				User.native(function(err, collection) {
				    collection.update(
					   {_id: new ObjectId(req.session.User.id)}
					   ,{$set: {viewed: req.session.User.viewed}}
					,function(err, userUpdated) {
						res.view({
							video : videoFound,
							hasVoted : hasVoted,
							hasFavoured : hasFavoured,
							videosRecomm:videos2
						});
					})
				});
			})
		});
	},
	fileBind: function (req, res, next) {
		Video.native(function(err, collection) {
		    collection.update(
			   {_id: new ObjectId(req.param('VideoId'))}
			   ,{$set: {link: "/videos/"+req.param('FileName')}}
			,function(err, videoFound) {
				res.redirect('/');
			})
		});
	},
	findTitles: function (req, res, next) {
		Video.native(function(err, collection) {
	      collection.find({}, {
	        title: true
	      }).toArray(function (err, titles) {
	        res.json(titles);
	      });
	    });
	},
	vote: function (req, res, next) {
		var msg = '';
		console.log(req.param('VideoId'))
		Video.native(function(err, collection) {
		    collection.findOne(
			   {_id: new ObjectId(req.param('VideoId'))}
			,function(err, videoFound) {
				var hasVoted = req.session.User.voted.filter(function(voted) {
				    return voted.videoId == req.param('VideoId')
				});
				if (hasVoted.length <= 0) {
					Video.native(function(err, collection) {
						collection.update(
						   {_id: new ObjectId(req.param('VideoId'))},
						   { $set: {rating: videoFound.rating + parseInt(req.param('star')) } , $inc: { nbRating: 1 }},
						   function(err, userUpdated) {
								req.session.User.voted.push(
									{
										"videoId":req.param('VideoId'),
										"Rate":parseInt(req.param('star')),
										"lastVotedDate":new Date()
									}
								)
								User.native(function(err, collection) {
								    collection.update(
									   {_id: new ObjectId(req.session.User.id)}
									   ,{$set: {voted: req.session.User.voted}}
									,function(err, userUpdated) {
										res.redirect(req.headers.referer.replace(req.headers.origin,''));
									})
								});
							})
					})
				}else{
					res.redirect(req.headers.referer.replace(req.headers.origin,''));
				}
			})
		})
	},
	addComment: function (req, res, next) {
		Video.native(function(err, collection) {
		    collection.findOne(
			   {_id: new ObjectId(req.param('VideoId'))}
			,function(err, videoFound) {
				videoFound.comments.push({
					wording: req.param('Wording'),
					poster: req.session.User.pseudo
				})
				Video.native(function(err, collection) {
				    collection.update(
					   {_id: new ObjectId(req.param('VideoId'))}
					   ,{$set: {comments: videoFound.comments}}
					,function(err, videoUpdated) {
						res.redirect(req.headers.referer.replace(req.headers.origin,''));
					})
				});
			})
		})
	}
// 	indexMob: function(req, res, next){
// 		var videos = new Array();
// 		var videos2 = new Array();
// 		var videosOnly3 = new Array();
// 		var videos4 = new Array();
// 		var videos5 = new Array();
// 		var videos6 = new Array();
// 		var videos7 = new Array();
// 		var videos8 = new Array();
// 		var videos9 = new Array();
// 		var videos10 = new Array();
// 		VideoDAO.findLastUploaded(function foundVideos(videosOnly, actorsOnly , genreOnly){
// 			VideoDAO.findMostRated(function foundVideos(videosOnly2, actorsOnly2,genreOnly2){
// 				VideoDAO.findMostViewed(function foundVideos(videosOnly4, actorsOnly4,genreOnly4){
// 					VideoDAO.findByGenre(3,function foundVideos(videosOnly5, actorsOnly5,genreOnly5){
// 						VideoDAO.findByGenre(4,function foundVideos(videosOnly6, actorsOnly6,genreOnly6){
// //							VideoDAO.findByGenre(2,function foundVideos(videosOnly7, actorsOnly7,genreOnly7){
// 								VideoDAO.findByGenre(6,function foundVideos(videosOnly8, actorsOnly8,genreOnly8){
// 									VideoDAO.findByGenre(7,function foundVideos(videosOnly9, actorsOnly9,genreOnly9){
// //										VideoDAO.findByGenre(1,function foundVideos(videosOnly10, actorsOnly10,genreOnly10){
// //											VideoDAO.findCaroussel(function foundVideos(videosOnly3){
// 												videos = VideoDAO.bindActors(videosOnly, actorsOnly);
// 												videos = VideoDAO.bindGenres(videos, genreOnly);
// 												videos4 = VideoDAO.bindActors(videosOnly4, actorsOnly4);
// 												videos4 = VideoDAO.bindGenres(videos4, genreOnly4);
// 												videos5 = VideoDAO.bindActors(videosOnly5, actorsOnly5);
// 												videos5 = VideoDAO.bindGenres(videos5, genreOnly5);
// 												videos6 = VideoDAO.bindActors(videosOnly6, actorsOnly6);
// 												videos6 = VideoDAO.bindGenres(videos6, genreOnly6);
// //												videos7 = VideoDAO.bindActors(videosOnly7, actorsOnly7);
// //												videos7 = VideoDAO.bindGenres(videos7, genreOnly7);
// 												videos8 = VideoDAO.bindActors(videosOnly8, actorsOnly8);
// 												videos8 = VideoDAO.bindGenres(videos8, genreOnly8);
// 												videos9 = VideoDAO.bindActors(videosOnly9, actorsOnly9);
// 												videos9 = VideoDAO.bindGenres(videos9, genreOnly9);
// //												videos10 = VideoDAO.bindActors(videosOnly10, actorsOnly10);
// //												videos10 = VideoDAO.bindGenres(videos10, genreOnly10);
// 												videos2 = VideoDAO.bindActors(videosOnly2, actorsOnly2);
// 												videos2 = VideoDAO.bindGenres(videos2, genreOnly2);
// 												res.send({
// 														videosRecentes: videos,
// 														videosMostRated: videos2,
// 														videoCaroussel: videosOnly3,
// 														videosPopulaires: videos4,
// 														videosComedy: videos5,
// 														videosThriller: videos6,
// 														videosAction: videos7,
// 														videosRomance: videos8,
// 														videosDrame: videos9,
// 														videosAnimation: videos10,
// 														videosRecomm:videos5
// 												});
// 										//	});
// 									//	});
// 									});
// 								});
// 						//	});
// 						});
// 					});
// 				});
// 			});
// 		});
// 	},
};



// db.Genres.insert({"wording":"Comedie"})
// Genre.findOrCreate({ wording: 'Thriller' },{ wording: 'Thriller' })
// 			.exec(function(errA, genresA) {
// 			console.log(genresA)