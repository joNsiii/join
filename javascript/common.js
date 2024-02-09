/**
 * Provides an element by id.
 * 
 * @param {*} id - The requested element's id.
 * @returns - The requested element.
 */
function getElement(id) {
    return document.getElementById(id);
}


/**
//  * Provides a json's object value.
 * 
 * @param {json} variable - The providing json.
 * @param {value} key - The requested object's key.
 * @returns - The requested object's value.
 */
function getJsonObjectValue(variable, key) {
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
function getJsonObjectDeepValue(variable, key, subkey) {
    return variable[key][subkey];
}