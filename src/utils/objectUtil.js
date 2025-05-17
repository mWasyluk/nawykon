export const ObjectUtil = {
    areEqual: (value1, value2) => {
        if (value1 === value2) {
            return true;
        }

        const type1 = checkType(value1);
        const type2 = checkType(value2);

        if (type1 !== type2) {
            return false;
        }

        if (type1 === 'array') {
            return areArraysEqual(value1, value2);
        }

        if (type1 === 'object') {
            return areFieldsEqual(value1, value2);
        }

        return false;
    }
}

function checkType(value) {
    if (value === null) {
        return 'null';
    }

    if (Array.isArray(value)) {
        return 'array';
    }

    if (typeof value === 'object') {
        return 'object';
    }

    return 'primitive';
}

function areArraysEqual(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }

    const array2MatchedIndexes = [];
    for (let i = 0; i < array1.length; i++) {
        let isFoundEqual = false;
        for (let j = 0; j < array2.length; j++) {
            if (array2MatchedIndexes.includes(j)) {
                continue;
            }
            if (ObjectUtil.areEqual(array1[i], array2[j])) {
                isFoundEqual = true;
                array2MatchedIndexes.push(j);
                break;
            }
        }
        if (!isFoundEqual) {
            return false;
        }
    }

    return true;
}

function areFieldsEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!object2.hasOwnProperty(key)) {
            return false;
        }

        if (!ObjectUtil.areEqual(object1[key], object2[key])) {
            return false;
        }
    }

    return true;
}
