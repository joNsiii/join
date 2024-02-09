/**
 * Provides an element by id.
 * @param {String} id - The requested element's id.
 * @returns - The requested element.
 */
function getElement(id) {
    return document.getElementById(id);
}


/**
//  * Provides a json's object value.
 * @param {json} variable - The providing json.
 * @param {value} key - The requested object's key.
 * @returns - The requested object's value.
 */
function getJsonObjectValue(variable, key) {
    return variable[key];
}


/**
 * Provides a a json's deeper object value.
 * @param {json} variable - The providing json.
 * @param {value} key - The requested object's key.
 * @param {value} subkey - The requested object's subkey.
 * @returns - The requested object's deep value.
 */
function getJsonObjectDeepValue(variable, key, subkey) {
    return variable[key][subkey];
}


function setClassOnCommand(id, command, className) {
    let toggling = command == 'toggle';
    (toggling) ? toggleClass(id, className) : addOrRemoveClass(id, command, className);
}


function toggleClass(id, className) {
    document.getElementById(id).classList.toggle(className);
}


function addOrRemoveClass(id, command, className) {
    let adding = command == 'add';
    (adding) ? addClass(id, className) : removeClass(id, className);
}


function addClass(id, className) {
    document.getElementById(id).classList.add(className);
}


function removeClass(id, className) {
    document.getElementById(id).classList.remove(className);
}


function replaceClasses(id, remove, add) {    // replaces element's classes
    document.getElementById(id).classList.replace(remove, add);
}