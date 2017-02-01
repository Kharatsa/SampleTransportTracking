/**
* Converts the string value from react-router to its final representation.
* @callback convertValueCallback
* @param {string} value - The raw value
* @returns {Any}
*/

/**
* Returns either the string or converted value from react-router.
* @callback paramValueCallback
* @param {Object} router - react-router
* @returns {Any}
*/

/**
* @param {string} key - the router parameter key
 * @param {convertValueCallback} [convert]
* @returns {paramValueCallback}
*/
export const paramValue = (key, convert=null) => {
  return ({params}) => {
    const value = params[key];
    if (convert) {
      return convert(value);
    } else {
      return value;
    }
  };
};

/**
 * @callback queryValueCallback
 * @param {Object} router - react-router
 * @returns {string|undefined}
 */

/**
 * @param {string} key - The location query key
 * @param {convertValueCallback} [convert]
 * @returns {queryValueCallback}
 */
export const queryValue = (key, convert=null) => {
  return ({location: {query}}) => {
    const value = query[key];
    if (convert) {
      return convert(value);
    } else {
      return value;
    }
  };
};

/**
 * Compose param and query callbacks into a single function.
 * @param {queryValueCallback|paramValueCallback[]} args
 * @returns {Any[]}
 */
export const manyValues = (...args) => {
  return router => args.map((getValue) => getValue(router));
};

/**
 * State container referenced by saveQuery and the lastQueryLoader
 */
let LAST_QUERY = {};

/**
 * Saves the router query in the module-level LAST_QUERY object.
 * @param {Object} router - React-router object
 */
export const saveQuery = ({location}) => {
  const {query={}} = location;
  console.debug(`Saving query from location: ${JSON.stringify(location)}`)
  LAST_QUERY = query;
};

/**
 * @callback loadLastQueryCallback
 * @param {Object} query - A location query
 * @returns {Object|null} - Query updated with the saved or previous query.
 *                          Returns null when no updates are applied.
 */

/**
 * @param {string[]} keys - The query keys that should be restored from the 
 *                          previous or saved query.
 * @returns {loadLastQueryCallback}
 */
export const makeLastQueryLoader = (...keys) => {
  const missingKeys = (source, target) => {
    return keys.some((key) => {
      console.debug(`Checking source[${key}] (${source[key]}) && !target[${key}] (${target[key]})`)
      return source[key] && !target[key]
    });
  };

  const filterKeys = (source, target) => {
    return keys.reduce((result, key) => {
      if (!result[key]) {
        result[key] = source[key];
      }
      return result;
    }, target);
  };

  return (query, prevQuery=null)  => {
    let result;

    if (prevQuery && missingKeys(prevQuery, query)) {
      // called from onChange
      const filtered = filterKeys(prevQuery, query);
      console.debug(`Query ${JSON.stringify(query)} missing previous keys ${JSON.stringify(prevQuery)}`)
      result = Object.assign({}, filtered, query);

    } else if (missingKeys(LAST_QUERY, query)) {
      // called from onEnter
      console.debug(`Query ${JSON.stringify(query)} missing saved keys ${JSON.stringify(LAST_QUERY)}`)
      const filtered = filterKeys(LAST_QUERY, query);
      result = Object.assign({}, filtered, query);
      LAST_QUERY = {};

    } else {
      result = null;
    }

    return result;
  };
};

/**
 * @callback loadDefaultQueryCallback
 * @param {Object} query - A location query
 * @returns {Object|null} - Query updated with defaults, or null when no
 *                          updates are applied.
 */

/**
 * @param {Object} defaults
 * @returns {loadDefaultQueryCallback}
 */
export const makeDefaultQueryLoader = defaults => {
  const keys = Object.keys(defaults);

  const missingDefault = query => {
    return keys.some((key) => !query[key]);
  };

  return query => {
    if (missingDefault(query)) {
      return Object.assign({}, defaults, query);
    }
    return null;
  };
};

/** Extended React Router helper class */
export class AppRouter {
  /**
   * Create a new AppRouter.
   * @param {Object} router - React Router router instance
   */
  constructor(router) {
    // Mirror a regular router instance's properties
    Object.getOwnPropertyNames(router).forEach((name) => {
      const prop = router[name];
      if (typeof prop === 'function') {
        this[name] = prop.bind(router);
      } else {
        this[name] = prop;
      }
    });
  }

  /**
   * Returns a new location with an updated query. Any key/value pairs in the
   * provided query argument will replace the corresponding value in the
   * current location's query. Any falsy value in the new query will exclude
   * that corresponding key from the final query object.
   * @param {Object} query - New query parameters.
   * @param {Object} [state] - new history state
   * @returns {Object}
   */
  locationFromQuery({query={}, state}) {
    const oldQuery = this.location.query;

    // Exclude any falsy values passed to set
    const filtered = Object.keys(query).reduce((result, key) => {
      const value = query[key];
      const oldValue = oldQuery[key];

      if (value) {
        result[key] = value;
      } else if (oldValue) {
        // explicit falsy values in new query erase any existing value
        delete oldQuery[key];
      }

      return result;
    }, {});

    return {
      pathname: this.location.pathname,
      query: Object.assign({}, oldQuery, filtered),
      state,
    };
  }

  /**
   * Just like replace, but with just a query paramter
   * @param {Object} query - New query parameters.
   * @param {Object} [state] - History state
   */
  replaceWithQuery({query, state}) {
    return this.replace(this.locationFromQuery({query, state}));
  }

  /**
   * Just like push, but with just a query parameter
   * @param {Object} query - New query parameters.
   * @param {Object} [state] - History state
   */
  pushWithQuery({query, state}) {
    return this.push(this.locationFromQuery({query, state}));
  }
}
