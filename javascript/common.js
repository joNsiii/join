/**
//  * Provides a json's object value.
 * 
 * @param {json} variable - The providing json.
 * @param {value} key - The requested object's key.
 * @returns - The requested object's value.
 */
function getJSONObjectValue(variable, key) {
    return variable[key];
}


/**
 * Provides a a json's deeper object value.
 * 
 * @param {json} variable - The providing json.
 * @param {value} key - The requested object's key.
 * @param {value} subkey - The requested object's subkey.
 * @returns - The requested object's deep value.
 */
function getJSONObjectValueDeep(variable, key, subkey) {
    return variable[key][subkey];
}


/**
 * Provides a Boolean value by making a comparison between an including array and a requested value. 
 * 
 * @param {*} array - The including array.
 * @param {*} value - The requested value.
 * @returns - True or false.
 */
function getIncludingMatch(array, value) {
    return array.includes(value);
}