/**
* Genre.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'Genres',
  schema: true,
  connection: 'mongodbconnect',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
  	wording: {
  		type: 'string',
  		required: true
  	}
  }
};

