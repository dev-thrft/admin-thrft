const Admin = require('../models/admin.model');
const Exception = require('../utils/Exception');
const { verify } = require('jsonwebtoken');


exports.signup = async (req, res, next) => {

  const { username, password } = req.body;

  try {
    await Admin.create({ username, password })
      .then((admin) =>
        res.status(201).json({
          success: true,
          message: 'Admin created successfully',
          admin: admin.username,
        })
      )
      .catch((err) => next(err));
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {

    await Admin.findOne({ username })
      .then((admin) => {
        if (!admin)
          return next(new Exception('Username/Password is incorrect.', 401));

        admin.comparePassword(password, (err, isMatch) => {
            if(err) return next(err);

            if (!isMatch)
                return next(new Exception('Username/Password is incorrect.', 401));

            // save refreshtoken to db and send to cookie
            admin.processRefreshToken(res, (err)=>{
                if(err) return next(err);
                    // send response with accesstoken
                    admin.generateAccessToken(res);
                });            
            });
      })
      .catch((err) => next(err));

  } catch (error) {
    return next(error);
  }
};


exports.logout = async (req, res, next) => {
    const refresh_token = req.cookies.refresh_token;
    if(!refresh_token) return next(new Exception('No token provided', 401));
    let payload = null;
    try {
      payload = verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return next(error);
    }

    // remove in database and in browser cookie
    try {
      await Admin.findOne({ _id: payload.id })
        .then(admin=>
            admin.removeRefreshToken(refresh_token, (err)=>{
              if(err) return next(err);

              res.clearCookie('refresh_token');
              res.status(200).json({
                success: true,
                message: 'Logged out successfully'
              });
            }))
        .catch((err) => next(err));
    } catch (error) {
      return next(error);
    }
};


exports.refreshToken = async (req, res, next) => {
    const refresh_token = req.cookies.refresh_token;
    if(!refresh_token) return next(new Exception('No token provided', 401));

    // verify token
    let payload = null;
    try {
        payload = verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);  
    } catch (error) {
        return next(error);
    }

    // verify in database

    try {
        await Admin.findOne({ _id: payload.id })
            .then((admin) => {
                if (!admin)
                    return next(new Exception('Invalid refresh token.', 401));
        
                // check if refresh token is available on database.
                const findToken = new Promise((resolve) =>resolve(
                  admin.refreshTokens.indexOf(refresh_token)));

                Promise.resolve(findToken)
                  .then((tokenIndex) => {
                    if (tokenIndex === -1)
                      return next(new Exception('Invalid refresh token.', 401));
        
                      // remove refresh token from database
                      admin.refreshTokens.splice(tokenIndex, 1);

                      // clear cookie in browser
                      res.clearCookie('refresh_token');

                      admin.processRefreshToken(res, (err)=>{
                          if(err) return next(err);
                              // send response with accesstoken
                              admin.generateAccessToken(res);
                      });
                  })
                  .catch((err) => next(err));
            })
            .catch((err) => next(err));

    } catch (error) {
        return next(error);
    }
};
