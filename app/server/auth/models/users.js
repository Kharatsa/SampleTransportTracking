'use strict';

const modelwrapper = require('server/storage/modelwrapper.js');
const credentials = require('server/auth/credentials.js');

/**
 * @typedef {User}
 * @property {string} username [description]
 * @property {string} digest [description]
 */

/**
 * User model. The default scope for Users will exclude sensitive
 * credentials from queries. Use the `unsafe` scope to retrieve
 * credential fields.
 *
 * @typedef {UsersModel}
 * @extends {Sequelize.Model}
 * @property {User}
 */

const modelName = 'Users';

const users = modelwrapper({

  name: modelName,

  import: function() {
    return function(sequelize, DataTypes) {
      return sequelize.define(modelName,
        {
          username: {
            type: DataTypes.CHAR,
            field: 'username',
            unique: true
          },
          digest: {
            type: DataTypes.CHAR(credentials.HASH_LENGTH),
            field: 'digest'
          },
          isAdmin: {
            type: DataTypes.BOOLEAN,
            field: 'is_admin',
            defaultValue: false
          }
        },
        {
          tableName: 'auth_users',
          defaultScope: {
            attributes: {exclude: ['digest']}
          },
          scopes: {
            unsafe: {
              attributes: {}
            },
          }
        });
    };
  }

});

module.exports = users;
