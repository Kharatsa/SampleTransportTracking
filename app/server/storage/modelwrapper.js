'use strict';

/**
 * This callback is displayed as part of the Database class.
 * @callback ModelCallback
 * @param {Sequelize.Sequelize} Sequelize instance
 * @param {Sequelize.DataTypes} DataTypes
 */

/**
 * @typedef {ModelWrapper}
 * @param {string} name [description]
 * @param {Array} references [description]
 * @param {ModelCallback} import [description]
 * @param {Sequelize.Model} model [description]
 */

/**
 * Wraps a Sequelize model to encapsulate all the data required to import the
 * model when a Sequelize instance (i.e., database connection) becomes
 * available. Critically, this class allows references between models to be
 * defined in model specs/modules/files before the models are imported to a
 * Sequelize instance.
 *
 * The options.import wrapper function should be a function that returns an
 * import function for the model conforming to the Sequelize import interface.
 * http://docs.sequelizejs.com/en/latest/docs/models-definition/#import
 *
 * The parameters of the options.import wrapper function will be called the
 * model objects (i.e., model property) from each ModelWrapper included in
 * options.references. The order of the wrapper function parameters must match
 * the order of the ModelWrappers passed to options.references.
 *
 * For example, given options.references = [dep1, dep2, dep3], options.import
 * should have the following composition:
 *   function(Dep1Model, Dep2Model, Dep3Model) {
 *     return function(sequelize, DataTypes) {
 *       // use Dep1Model, Dep2Model, Dep3Model in define
 *       return sequelize.define(...);
 *     }
 *   }
 *
 * @param {!Object} options [description]
 * @param {!string} options.name [description]
 * @param {!Function} options.import [description]
 * @param {?Array.<ModelWrapper>} options.references Models referenced by this
 *                                                   model in column definitions
 *                                                   or an association (e.g.,
 *                                                   belongsTo).
 */
function ModelWrapper(options) {
  if (!options.name) {
    throw new Error('Model name is a required parameter');
  }
  this.name = options.name;

  this.references = options.references || [];

  if (!options.import) {
    throw new Error('Model import function is a required parameter');
  }

  this.import = (sequelize, DataTypes) => {
    // Intercept, save, then return the model returned from the import call.
    var referenceModels = this.references.map(ref => ref.model);
    const importFunc = options.import.apply(this, referenceModels);
    this.model = importFunc(sequelize, DataTypes);
    return this.model;
  };

  // This model object is defined when the model is imported by a Sequelize
  // instance with the model name (this.name) and model import function
  // (this.import).
  //  sequelize.import(myWrappedModel.name, myWrappedModel.import)
  this.model = undefined;
}

module.exports = function(options) {
  return new ModelWrapper(options);
};
