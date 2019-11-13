'use strict';

/**
 * token util
 */
import * as jwt from 'jsonwebtoken';
import config from '../../config/config.default';
const secret = config().token.tokenSecret;
const expiresIn = config().token.tokenExpiresIn;

export const tokenService = {
  createToken(userinfo) {
    const token = jwt.sign(userinfo, secret, {
      expiresIn,
    });
    return token;
  },
  verifyToken(token) {
    if (!token) {
      return false;
    }

    try {
      const result = jwt.verify(token, secret);
      return result;
    } catch (err) {
      return false;
    }
  },
  expiresIn,
};
