'use strict';

var Forms;
exports.Forms = function(sequelize, DataTypes) {
  Forms = sequelize.define('Forms', {
    formId: {
      type: DataTypes.STRING,
      field: 'form_id',
      unique: true
    },
    formName: {
      type: DataTypes.STRING,
      field: 'form_name'
    }
  });
  return Forms;
};

var FormData;
exports.FormData = function(sequelize, DataTypes) {
  FormData = sequelize.define('FormData', {
    formId: {
      type: DataTypes.STRING,
      field: 'odk_form_id',
      allowNull: false,
      references: {
        model: Forms,
        key: 'odk_form_id'
      },
      unique: 'form_instance'
    },
    instanceId: {
      type: DataTypes.UUID,
      field: 'odk_instance_id',
      allowNull: false,
      validate: {
        notEmpty: true
      },
      unique: 'form_instance'
    },
    fieldLabel: {
      type: DataTypes.STRING,
      field: 'field_label',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });
  return FormData;
};

var Events;
exports.Events = function(sequelize, DataTypes) {
  Events = sequelize.define('Events', {
    sampleId: {
      type: DataTypes.INTEGER,
      field: 'sample_id',
      allowNull: false,
    },
    odkFormId: {
      type: DataTypes.STRING,
      field: 'odk_form_id',
      allowNull: false,
      references: {
        model: Forms,
        key: 'odk_form_id'
      }
    },
    odkInstanceId: {
      type: DataTypes.UUID,
      field: 'odk_instance_id',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  },
  {
    indexes: [
      {fields: ['sample_id']}
    ]
  });
  return Events;
};

var SampleIds;
exports.SampleIds = function(sequelize, DataTypes) {
  SampleIds = sequelize.define('SampleIds', {
    stId: {
      type: DataTypes.INTEGER,
      field: 'st_id',
      allowNull: false,
      validate: {
        min: 0
      },
      unique: 'sample_ids'
    },
    labId: {
      type: DataTypes.INTEGER,
      field: 'lab_id',
      allowNull: true,
      validate: {
        min: 0
      },
      unique: 'sample_ids'
    }
  }, {
    indexes: [
      {unique: true, fields: ['st_id', 'lab_id']}
    ]
  });
  return SampleIds;
};
