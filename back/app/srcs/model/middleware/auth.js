const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  //console.log("authMw")
  try {
    console.log(req.headers);
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const id = decodedToken.id;
    console.log(id)
    if (req.id && req.id !== id) {
      throw 'Invalid user info';
    } else {
      next();
    }
  } catch(e) {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
