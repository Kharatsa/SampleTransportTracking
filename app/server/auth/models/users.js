'use strict';

const modelwrapper = require('server/storage/modelwrapper.js');

/**
 * @typedef {User}
 * @property {string} username [description]
 * @property {string} digest [description]
 * @property {string} salt [description]
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
            type: DataTypes.STRING,
            field: 'username',
            unique: true
          },
          salt: {
            type: DataTypes.STRING,
            field: 'salt'
          },
          digest: {
            type: DataTypes.STRING,
            field: 'digest'
          },
          isAdmin: {
            type: DataTypes.BOOLEAN,
            field: 'is_admin',
            defaultValue: false
          }
        },
        {
          tableName: 'sys_Users',
          defaultScope: {
            attributes: {exclude: ['salt', 'digest']}
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
