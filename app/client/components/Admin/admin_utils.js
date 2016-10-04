export const columnDefaults = {
  width: 150,
  flexGrow: 1
};

/**
* Keys is an sequence of ordered unique IDs, while valuesByKey is
* a mapping or Object keyed on these unique IDs. Returns a
* rowGetter function accepting a single index parameter, for use
* with react-virtualized.
**/
export const immutablePairRowGetter = ({keys, valuesByKey}) => {
  return ({index}) => {
    const rowKey = keys.get(index, null);
    if (rowKey !== null) {
      return valuesByKey.get(`${rowKey}`, null);
    } else {
      return null;
    }
  };
};
