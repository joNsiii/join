const STORAGE_TOKEN = 'NDDGU60G0OSQD8WNSDALXGF1VFHEF8WSWS196UZK';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Save key,value and token on a server
 * 
 * @param {string} key - defined key as text for a value
 * @param {string} value - The value will be saved as text for a specific key
 * @returns - send a JSON to a server
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * Get a value from a specific key from a server
 * 
 * @param {string} key - defined key as text for a value
 * @returns - get the JSON from server
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}

/**
 * Set a cookie with name value and expiration hours
 * 
 * @param {string} cookieName - name for the set cookie
 * @param {string} cookieValue - value for the set cookie
 * @param {string} expirationHours - set the time before the cookie is invalid
 */
function setCookie(cookieName, cookieValue, expirationHours) {
    let d = new Date();
    d.setTime(d.getTime() + (expirationHours * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

/**
 * Get the cookie from user
 * 
 * @param {key} cname - is the name of the cookiekey
 * @returns - name of the cookie
 */
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }