/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

 tableName: 'Users',
  schema: true,
  connection: 'mongodbconnect',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
  	pseudo: {
  		type: 'string',
  		required: true
  	},
  	lastName: {
  		type: 'string',
  		required: true
  	},
  	name: {
  		type: 'string',
  		required: true
  	},
  	email: {
  		type: 'string',
  		email: true,
  		required: true,
  		unique: true
  	},
    password: {
  		type: 'string',
      required: true
  	},
    online: {
      type: 'boolean',
      defaultsTo: false
    },
    status: {
      //(user , subscriber , admin , director)
      type: 'string',
      required: true
    },
    viewed: {
      type: 'array'
    },
    voted: {
      type: 'array'
    },
    favorites: {
      type: 'array',
    },
    toJSON: function() {
  		var obj = this.toObject();
  		delete obj.mdp;
  		delete obj.mdp2;
  		delete obj.encryptedPassword;
  		delete obj._csrf;
  		return obj;
  	}
  }
};

