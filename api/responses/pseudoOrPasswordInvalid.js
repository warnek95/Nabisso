/**
 *
 * Usage:
 * 
 * ````
 * res.emailAddressInUse();
 * ```
 */

module.exports = function pseudoOrPasswordInvalid() {

  // Get access to `res`
  // (since the arguments are up to us)
  var res = this.res;
  var req = this.req;

  return res.send(410, 'Le pseudo ou le mot de passe est invalide.');

};