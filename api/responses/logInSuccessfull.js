/**
 *
 * Usage:
 * 
 * ````
 * res.emailAddressInUse();
 * ```
 */

module.exports = function logInSuccessfull() {

  // Get access to `res`
  // (since the arguments are up to us)
  var res = this.res;
  var req = this.req;

  return res.send(209, 'Bienvenue ' + req.session.User.pseudo + '.\n Bon visionnage');

};