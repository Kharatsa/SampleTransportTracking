const config = require('config');

const noop = (req, res, next) => next();

/** 
 * Requires that the requester be an admin user
 **/
const requireAdmin = (req, res, next) => {
  console.log(`process.end.NODE_ENV=${process.env.NODE_ENV}`);
  if (req.user) {
    if (req.user.isAdmin) {
      next()
      return;
    } else {
      const accessErr = new Error('Administrator access required');
      accessErr.status = 403;
      next(accessErr);
      return;
    }

  } else {
    const authErr = new Error('Authentication required');
    authErr.status = 401;
    next(authErr);
    return;
  }
};

module.exports = {
  'requireAdmin': config.server.AUTH_ENABLED ? requireAdmin : noop,
}
