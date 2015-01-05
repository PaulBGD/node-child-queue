/**
 * The utils object
 * @constructor
 */
function Utils() {

}

/**
 * Takes all the properties of the mergingFrom object that the
 * mergingTo object doesn't have and gives them to it
 * @param mergingTo the object to merge properties to
 * @param mergingFrom the object to merge properties from
 */
Utils.prototype.mergeObject = function (mergingTo, mergingFrom) {
    for (var property in mergingFrom) {
        if (mergingFrom.hasOwnProperty(property) && !mergingTo[property]) {
            mergingTo[property] = mergingFrom[property];
        }
    }
};

/**
 * Creates a deep copy of an object
 * @param object the object o make a copy of
 * @returns {*}
 */
Utils.prototype.copyObject = function (object) {
    return JSON.parse(JSON.stringify(object));
};

/**
 * Looks through all properties in an object or values in an array
 * and calls the function
 * @param object the object or array
 * @param func a function with the parameters property, value for object and index, value for array
 * @returns the returned value from the function, if there is one
 */
Utils.prototype.each = function (object, func) {
    if (Array.isArray(object)) {
        for (var i = 0; i < object.length; i++) {
            var value = func(i, object[i]);
            if (value) {
                return value;
            }
        }
    } else {
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                value = func(property, object[property]);
                if (value) {
                    return value;
                }
            }
        }
    }
};

module.exports = new Utils();