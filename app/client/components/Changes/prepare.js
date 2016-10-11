const dereference = ({change, labTests, artifacts, samples}) => {
  const labTestRef = change.get('labTest', null);
  const artifactRef = change.get('artifact', null);
  const labTest = labTests.get(labTestRef, null);
  const artifact = artifacts.get(artifactRef, null);
  const subject = labTest || artifact;
  const sample = subject ? samples.get(subject.get('sampleId')) : null;
  return {
    stId: sample.get('stId'),
    labId: sample.get('labId'),
    stage: change.get('stage'),
    status: change.get('status'),
    labRejection: change.get('labRejection'),
    testType: labTest ? labTest.get('testType') : '',
    artifactType: artifact ? artifact.get('artifactType') : '',
    person: change.get('person'),
    facility: change.get('facility'),
    statusDate: new Date(change.get('statusDate'))
  };
};

/*
 * Resolve references to Lab Tests, Artifacts, and Samples in Changes data
 **/
export const dereferenceChanges = (
  changeIds, changes, labTests, artifacts, samples
) => {
  const changeDetails = changeIds.map((changeId) => {
    const change = changes.get(changeId, null);
    if (change) {
      return dereference({change, labTests, artifacts, samples});
    }
    return null;
  });

  return changeDetails.filter((detail) => detail !== null);
};
