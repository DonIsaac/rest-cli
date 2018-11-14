// TODO: Add as dependency and publish to npm

/** Object containing dictionary (object) utilities */
const MapUtils = module.exports = {

    /**
     * Maps an object's keys and values to a new object. The original object
     * is not modified. Map functions should take a single parameter, which 
     * will be the current key or value (for the key or value map respectively)
     * being iterated over.
     * 
     * Method Overloads:
     * map(obj, valFn) => mappedObject
     * map(obj, keyFn, valFn) => mappedObject
     * 
     * @param {object} obj the Object to map
     * @param {Function} keyFn the map function for the object's keys
     * @param {Function} valFn the map function for the 
     */
    map: (obj, keyFn, valFn) => {
        if (!valFn) {
            return MapUtils.map(obj, null, valFn);
        }

        /* If no map function is given for keys, a default map
         * is provided that does not perform any transformations.
         */
        keyFn = keyFn || (k => k);

        let mappedObj = {};

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                //const element = object[key];
                let mappedKey = keyFn(key);
                let mappedVal = valFn(obj[key]);
                mappedObj[mappedKey] = mappedVal;

            }
        }
    },

    /**
     * Checks to see if the object has a value stored at a given key.
     * 
     * If a value is provided, this function checks if the value stored at
     * the given key is equal to the value. If a value is not provided, 
     * then this function simply checks if a value exists at all at the 
     * given key.
     * 
     * @param {object} obj  the object to check
     * @param {any} key     the key to check
     * @param {any?} value  the value the value stored at the key must have.
     *                      If this parameter is not provided, this function 
     *                      simply checks if any value at all is stored under
     *                      the given key.
     * 
     * @returns {boolean} True if the object has the key, false otherwise
     */
    has: (obj, key, value) => {
        return value ? obj[key] === value : obj[key] != null
    },
    /**
     * Applies a filter function to each key/value pair in the object.
     * 
     * Method overrides:
     * - filter(obj, valueFilter)
     * - filter(obj, keyFilter, valueFilter)
     */
    filter: (obj, keyFilter, valueFilter) => {
        if (!valueFilter) {// Handle (obj, valueFilter) method overload
            return MapUtils.filter(obj, null, keyFilter);
        }

        let filteredObj = {};

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (!keyFilter || keyFilter(key)) {
                    if (valueFilter(obj[key])) {
                        filteredObj[key] = obj[key];
                    }
                }
            }
        }

        return filteredObj;
    },

    /**
     * Performs a task on each key/value pair of the object.
     * 
     * @param {object} obj the object to traverse
     * @param {(key, value) => any} task The task function. should take (key, value) as it's parameters
     */
    processElement(obj, task){
        for(let key in obj){
            task(key, obj[key]);
        }
    },

    processElementRecursively(obj, task) {
        for(let key in obj){
            if(typeof obj[key] === 'object'){
                MapUtils.processElementRecursively(obj[key], task);
            } else {
                task(key, obj[key]);
            }
            
        }
    }
}

