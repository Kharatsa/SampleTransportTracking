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
  },
  {
    tableName: 'forms'
  });

  return Forms;
};

var SampleIds;
exports.SampleIds = function(sequelize, DataTypes) {
  SampleIds = sequelize.define('SampleIds', {
    stId: {
      type: DataTypes.STRING,
      field: 'st_id',
      unique: true
    },
    labId: {
      type: DataTypes.STRING,
      field: 'lab_id',
      unique: true
    }
  },
  {
    indexes: [{name: 'id_pair', unique: true, fields: ['st_id', 'lab_id']}],
    tableName: 'sample_ids'
  });

  return SampleIds;
};

var TrackerEvents;
exports.TrackerEvents = function(sequelize, DataTypes) {
  TrackerEvents = sequelize.define('TrackerEvents', {
    stId: {
      type: DataTypes.STRING,
      field: 'st_id',
      references: {
        model: SampleIds,
        key: 'st_id'
      }
    },
    labId: {
      type: DataTypes.STRING,
      field: 'lab_id',
      references: {
        model: SampleIds,
        key: 'lab_id'
      }
    },
    formId: {
      type: DataTypes.STRING,
      field: 'form_id',
      allowNull: false,
      references: {
        model: Forms,
        key: 'form_id',
      },
    },
    instanceId: {
      type: DataTypes.UUID,
      field: 'instance_id',
      allowNull: false,
      unique: true
    },
    formEndDate: {
      type: DataTypes.DATE,
      field: 'form_end_date',
    },
    odkCompletedDate: {
      type: DataTypes.DATE,
      field: 'odk_completed_date',
    },
  },
  {
    tableName: 'tracker_events',
    validate: {
      requireSampleId: function() {
        if (this.stId === null && this.labId === null) {
          throw new Error('Either stId or labId must be included');
        }
      }
    }
  });

  return TrackerEvents;
};

var SubmissionData;
exports.SubmissionData = function(sequelize, DataTypes) {
  SubmissionData = sequelize.define('SubmissionData', {
    fieldLabel: {
      type: DataTypes.STRING,
      field: 'field_label',
      allowNull: false,
      unique: 'submission_field'
    },
    fieldValue: {
      type: DataTypes.STRING,
      field: 'field_value'
    },
    formId: {
      type: DataTypes.STRING,
      field: 'form_id',
      allowNull: false,
      references: {
        model: Forms,
        key: 'form_id',
      },
    },
    instanceId: {
      type: DataTypes.UUID,
      field: 'instance_id',
      allowNull: false,
      unique: 'submission_field',
      references: {
        model: TrackerEvents,
        key: 'instance_id'
      }
    },
  },
  {
    tableName: 'submission_data'
  });

  return SubmissionData;
};
