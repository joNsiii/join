/**
 * Adds a class to an element.
 * @param {String} id - The requested element's id.
 * @param {String} className - The adding class name.
 */
function addClass(id, className) {
    document.getElementById(id).classList.add(className);
}


/**
 * Closes a dialog by id.
 * @param {String} id - The requested dialog's id.
 */
function closeDialog(id) {
    document.getElementById(id).close();
}


/**
 * Provides an element by id.
 * @param {String} id - The requested element's id.
 * @returns - The requested element.
 */
function getElement(id) {
    return document.getElementById(id);
}


/**
 * Provides an element's attribute.
 * @param {String} id - The requested element's id.
 * @param {String} attribute - The requested attribute's name.
 * @returns - The requested attribute's value.
 */
function getElementAttribute(id, attribute) {
    return document.getElementById(id).getAttribute(attribute);
}


/**
 * Provides an input's value.
 * @param {String} id - The requested element's id.
 * @returns - The requested input's value.
 */
function getInputValue(id) {
    return document.getElementById(id).value;
}


/**
 * Provides a json's deep object value.
 * @param {json} variable - The providing json.
 * @param {value} key - The requested object's key.
 * @param {value} subkey - The requested object's subkey.
 * @returns - The requested object's deep value.
 */
function getJsonObjectDeepValue(variable, key, subkey) {
    return variable[key][subkey];
}


/**
 * Provides a json's object value.
 * @param {json} variable - The providing json.
 * @param {value} key - The requested object's key.
 * @returns - The requested object's value.
 */
function getJsonObjectValue(variable, key) {
    return variable[key];
}


/**
 * Opens a dialog by id.
 * @param {String} id - The requested dialog's id.
 */
function openDialog(id) {
    document.getElementById(id).show();
}


/**
 * Removes a class from an element.
 * @param {String} id - The requested element's id.
 * @param {String} className - The removing class name.
 */
function removeClass(id, className) {
    document.getElementById(id).classList.remove(className);
}


/**
 * Removes an element's attribute.
 * @param {String} id - The requested element's id.
 * @param {String} attribute - The removing attribute's name.
 */
function removeElementAttribute(id, attribute) {
    document.getElementById(id).removeAttribute(attribute);
}


/**
 * Sets an element's class.
 * @param {String} id - The requested element's id.
 * @param {function} subfunction - The running function.
 * @param {String} className - The setting class name.
 */
function setClass(id, subfunction, className) {
    subfunction(id, className);
}


/**
 * Sets an element's attribute.
 * @param {String} id - The requested element's id.
 * @param {String} attribute - The setting attribute's name.
 * @param {value} value - The setting attribute's value.
 */
function setElementAttribute(id, attribute, value) {
    document.getElementById(id).setAttribute(attribute, value);
}


/**
 * Prevents closing of a dialog by clicking on the dialog window.
 * @param {event} event - The onclick event.
 */
function stop(event) {
    event.stopPropagation();
}


/**
 * Toggles a class of an element.
 * @param {String} id - The requested element's id.
 * @param {String} className - The toggling class name.
 */
function toggleClass(id, className) {
    document.getElementById(id).classList.toggle(className);
}