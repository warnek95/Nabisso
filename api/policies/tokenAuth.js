module.exports = function(req, res, next) {
  var token;
  console.log(req.params.all());
  console.log(req.param('token'));
   // console.log(req.headers.authorization+ '\n');
   //  console.log('%j \n',req.headers);
  console.log('gffgf');
  if (req.headers && req.headers.authorization) {
    console.log(req.headers.authorization);
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0],
        credentials = parts[1];
        console.log(credentials);
      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
        console.log('fdfd');
      }
    } else {
      return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
    }
  } else if (req.param('token')) {
    console.log('ukog');
    token = req.param('token');
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else if (req.query.token) {
    console.log('nfhuidohdfii');
    token = req.query.token;
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    return res.json(401, {err: 'No Authorization header was found'});
  }

  sailsTokenAuth.verifyToken(token, function(err, token) {
    if (err) return res.json(401, {err: 'The token is not valid'});

    req.token = token;

    next();
  });
}