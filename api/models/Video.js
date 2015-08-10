/**
* Video.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName: 'Videos',
  schema: true,
  connection: 'mongodbconnect',
  autoCreatedAt: true,
  autoUpdatedAt: true,

  attributes: {
  	title: {
  		type: 'string',
  		required: true
  	},
  	releaseDate: {
  		type: 'date',
  		required: true
  	},
  	description: {
  		type: 'string',
  		required: true
  	},
    season: {
  	},
    link: {
      type: 'string'
    },
    pictures: {
    	type: 'array'
    },
    actors: {
      type: 'array'
    },
    genres: {
      type: 'array'
    },
    director: {
      type: 'string',
      required: true
    },
    views: {
      type: 'integer'
    },
    rating: {
      type: 'float'
    },
    nbRating: {
      type: 'integer'
    },
    comments: {
      type: 'array'
    },
    type: {
      type: 'string'
    },
    toJSON: function() {
  		var obj = this.toObject();
  		delete obj._csrf;
  		return obj;
  	}
  }
};

