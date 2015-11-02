'use strict';

var Forms;
exports.Forms = function(sequelize, DataTypes) {
  Forms = sequelize.define('Forms', {
    formId: {
      type: DataTypes.STRING,
      field: 'form_id',
      unique: true,
    },
    formName: {
      type: DataTypes.STRING,
      field: 'form_name',
    }
  });
  return Forms;
};

var SampleIds;
exports.SampleIds = function(sequelize, DataTypes) {
  SampleIds = sequelize.define('SampleIds', {
    stId: {
      type: DataTypes.INTEGER,
      field: 'st_id',
    },
    labId: {
      type: DataTypes.INTEGER,
      field: 'lab_id',
    }
  }, {
    indexes: [{unique: true, fields: ['st_id', 'lab_id']}]
  });
  return SampleIds;
};

var STEvents;
exports.STEvents = function(sequelize, DataTypes) {
  STEvents = sequelize.define('STEvents', {
    sampleId: {
      type: DataTypes.INTEGER,
      field: 'sample_id',
      allowNull: false,
    },
    formId: {
      type: DataTypes.STRING,
      field: 'form_id',
      allowNull: false,
      unique: 'form_submission',
      references: {
        model: Forms,
        key: 'form_id',
      },
    },
    instanceId: {
      type: DataTypes.UUID,
      field: 'instance_id',
      allowNull: false,
      unique: 'form_submission',
    },
    formEndDate: {
      type: DataTypes.DATE,
      field: 'form_end_date',
    },
    odkCompletedDate: {
      type: DataTypes.DATE,
      field: 'odk_completed_date',
    },
  }, {
    indexes: [{fields: ['sample_id', 'instance_id']}]
  });
  return STEvents;
};

var FormData;
exports.FormData = function(sequelize, DataTypes) {
  FormData = sequelize.define('FormData', {
    formId: {
      type: DataTypes.STRING,
      field: 'form_id',
      allowNull: false,
      // references: {
      //   model: STEvents,
      //   key: 'form_id',
      // },
    },
    instanceId: {
      type: DataTypes.UUID,
      field: 'instance_id',
      allowNull: false,
      // references: {
      //   model: STEvents,
      //   key: 'instance_id',
      // },
    },
    fieldLabel: {
      type: DataTypes.STRING,
      field: 'field_label',
      allowNull: false,
    },
    fieldValue: {
      type: DataTypes.STRING,
      field: 'field_value',
      allowNull: false,
    }
  }, {
    indexes: [{fields: ['instance_id']}]
  });
  return FormData;
};
