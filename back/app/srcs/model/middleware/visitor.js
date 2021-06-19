// const jwt = require('jsonwebtoken');
//
// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
//     const username = decodedToken.username;
//     if (username) {
//       res.send("connected!");
//     } else {
//       next();
//     }
//   } catch(e) {
//     res.status(401).json({
//       error: new Error('Invalid request!')
//     });
//   }
// };
