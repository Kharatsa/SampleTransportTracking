import {connect} from 'react-redux';
import {MetaTypeTable} from '../../components/Admin';
import {META_TYPES} from '../../../common/sttworkflow.js';

/* Translates the URL/route name into the name for the
 * meta type in the state tree.
 **/
const typeStateNames = {};
typeStateNames[META_TYPES.ARTIFACTS] = 'Artifacts';
typeStateNames[META_TYPES.FACILITIES] = 'Facilities';
typeStateNames[META_TYPES.PEOPLE] = 'People';
typeStateNames[META_TYPES.LABS] = 'Regions';
typeStateNames[META_TYPES.TESTS] = 'LabTests';
typeStateNames[META_TYPES.REJECTIONS] = 'Rejections';
typeStateNames[META_TYPES.STATUSES] = 'Statuses';
typeStateNames[META_TYPES.STAGES] = 'Stages';

/*
 * Given the meta state name, return the matching pair of meta
 * objects from state.
 **/
const getMetaType = ({state, stateName}) => {
  const keysStateKey = `meta${stateName}Keys`;
  const valuesStateKey = `meta${stateName}ByKey`;

  const metaKeys = state[keysStateKey];
  const metaByKey = state[valuesStateKey];

  return {metaKeys, metaByKey};
};

export const MetaTypeContainer = connect(
  (state, {routeParams}) => {
    // Pass only a single metadata type from state,
    // including the "...Keys" and "ByKey" entries.
    const metaTypeName = routeParams.type || META_TYPES.ARTIFACTS;
    const stateName = typeStateNames[metaTypeName];

    const metaType = getMetaType({state, stateName});
    return {metaTypeName, ...metaType};
  })(MetaTypeTable);

export default MetaTypeContainer;
