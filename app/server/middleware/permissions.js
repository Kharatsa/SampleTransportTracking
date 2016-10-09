const config = require('config');

const noop = (req, res, next) => next();

const requireAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) {
      next();
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
};
