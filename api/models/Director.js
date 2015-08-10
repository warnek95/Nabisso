/**
* Director.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'Directors',
  schema: true,
  connection: 'mongodbconnect',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
  	name: {
  		type: 'string',
  		required: true
  	}
  }
};

