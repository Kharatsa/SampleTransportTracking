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

var People;
exports.People = function(sequelize, DataTypes) {
  People = sequelize.define('People', {
    name: {
      type: DataTypes.STRING,
      field: 'name',
    },
    type: {
      type: DataTypes.STRING,
      field: 'type',
      defaultValue: 'rider'
    },
  },
  {
    tableName: 'people'
  });

  return People;
};

var Facilities;
exports.Facilities = function(sequelize, DataTypes) {
  Facilities = sequelize.define('Facilities', {
    name: {
      type: DataTypes.STRING,
      field: 'name',
      unique: true
    },
    region: {
      type: DataTypes.STRING,
      field: 'region',
    },
    type: {
      type: DataTypes.STRING,
      field: 'type',
    },
  },
  {
    tableName: 'facilities',
  });

  return Facilities;
};

var Samples;
exports.Samples = function(sequelize, DataTypes) {
  Samples = sequelize.define('Samples', {
    stId: {
      type: DataTypes.STRING,
      field: 'st_id',
      unique: true
    },
    labId: {
      type: DataTypes.STRING,
      field: 'lab_id',
      unique: true
    },
    type: {
      type: DataTypes.STRING,
      field: 'type'
    }
  },
  {
    tableName: 'samples',
    indexes: [{name: 'id_pair', unique: true, fields: ['st_id', 'lab_id']}],
  });

  return Samples;
};

var Submissions;
exports.Submissions = function(sequelize, DataTypes) {
  Submissions = sequelize.define('Submissions', {
    form: {
      type: DataTypes.STRING,
      field: 'form',
      allowNull: false,
      references: {
        model: Forms,
        key: 'form_id',
      },
    },
    submissionId: {
      type: DataTypes.UUID,
      field: 'submission_id',
      allowNull: false,
      unique: true
    },
    facility: {
      type: DataTypes.STRING,
      field: 'facility',
      references: {
        model: Facilities,
        key: 'name',
      },
    },
    person: {
      type: DataTypes.STRING,
      field: 'rider',
    },
    deviceId: {
      type: DataTypes.STRING,
      field: 'device_id',
    },
    simSerial: {
      type: DataTypes.STRING,
      field: 'sim_serial',
    },
    formStartDate: {
      type: DataTypes.DATE,
      field: 'form_start_date',
    },
    formEndDate: {
      type: DataTypes.DATE,
      field: 'form_end_date',
    },
    completedDate: {
      type: DataTypes.DATE,
      field: 'completed_date',
    },
  },
  {
    tableName: 'submissions',
    indexes: [{name: 'submission', unique: true, fields: ['submission_id']}],
  });

  return Submissions;
};

var TrackerEvents;
exports.TrackerEvents = function(sequelize, DataTypes) {
  TrackerEvents = sequelize.define('TrackerEvents', {
    submissionId: {
      type: DataTypes.STRING,
      field: 'submission_id',
      allowNull: false,
      references: {
        model: Submissions,
        key: 'submission_id',
      },
    },
    stId: {
      type: DataTypes.STRING,
      field: 'st_id',
      references: {
        model: Samples,
        key: 'st_id'
      }
    },
    labId: {
      type: DataTypes.STRING,
      field: 'lab_id',
      references: {
        model: Samples,
        key: 'lab_id'
      }
    },
    sampleStatus: {
      type: DataTypes.STRING,
      field: 'sample_status',
    }
  },
  {
    tableName: 'tracker_events',
    indexes: [
      {name: 'sample_ids', fields: ['st_id', 'lab_id']},
      {name: 'form_submission', fields: ['submission_id']},
    ],
    validate: {
      requireSampleId: function() {
        if (this.stId === null && this.labId === null) {
          throw new Error('Either stId or labId must be included with submissions');
        }
      }
    },
  });

  return TrackerEvents;
};

// var SubmissionData;
// exports.SubmissionData = function(sequelize, DataTypes) {
//   SubmissionData = sequelize.define('SubmissionData', {
//     fieldLabel: {
//       type: DataTypes.STRING,
//       field: 'field_label',
//       allowNull: false,
//       unique: 'submission_field'
//     },
//     fieldValue: {
//       type: DataTypes.STRING,
//       field: 'field_value'
//     },
//     formId: {
//       type: DataTypes.STRING,
//       field: 'form_id',
//       allowNull: false,
//       references: {
//         model: Forms,
//         key: 'form_id',
//       },
//     },
//     instanceId: {
//       type: DataTypes.UUID,
//       field: 'instance_id',
//       allowNull: false,
//       unique: 'submission_field',
//       references: {
//         model: TrackerEvents,
//         key: 'instance_id'
//       }
//     },
//   },
//   {
//     tableName: 'submission_data'
//   });

//   return SubmissionData;
// };
