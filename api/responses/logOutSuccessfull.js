/**
 *
 * Usage:
 * 
 * ````
 * res.emailAddressInUse();
 * ```
 */
require('date-utils');
module.exports = function logOutSuccessfull() {

  // Get access to `res`
  // (since the arguments are up to us)
  var res = this.res;
  var req = this.req;
  if (new Date().getHours() < 19) {
  	return res.send(210, 'Au revoir.Passez une bonne journée :)');
  } else if (new Date().getHours() > 19 && new Date().getHours() < 22 ) {
  	return res.send(210, 'Au revoir.Passez une bonne soirée :)');
  } else if (new Date().getHours() >= 22) {
  	return res.send(210, 'Au revoir.Passez une bonne nuit, reposez-vous bien ;)');
  }
  

};