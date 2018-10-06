#!/usr/bin/env node
const getObjectDiff = require('object-diff');
const path = require('path');
const lo = require('lodash');

let [, , filePath1, filePath2, ...args] = process.argv;


// it should looks like

// pkdiff <file-one> <file-two> -p <property1> -p <property2>

// acceptance criteria:

// 3. Common rules
//   * it should throw an error if files not found
//   * it should show difference if one of provided properties not found in older file
//   * it should show the difference as specific object in case of diff found
//   * if objects are equal it should return nothing
//   * it should compare whole objects till properties not provided
//   * it should compare only exact given properties if it is provided by args
//   * properties may have depth - for example it may looks like "dependency.tree.something-else" or even "dep[4].rty"

// STEPS:
//   1. Get all conditions
//     * get file names
//     * get properties
//     * get flags
//   2. Check files exists
//   3. Get two objects
//   4. if properties is not passed so
//     * compare whole objects and return result
//   5. if properties is passed through args so
//     * compare all given properties and return result
//   6. Returning result - regarding to whether --quiet flag presented or not


if (!filePath1 || !filePath2) {
    throw new Error('Requird at least two params')
}
filePath1 = path.isAbsolute(filePath1) ? filePath1 : path.join(process.cwd(), filePath1);
filePath2 = path.isAbsolute(filePath2) ? filePath2 : path.join(process.cwd(), filePath2);


let object1;
let object2;
try {
    object1 = require(filePath1);
    object2 = require(filePath2);
} catch (e) {
    console.error(e);
    throw new Error('Unable to find file');
}

let objectFields = [];
if (args.length) {
    objectFields = findAllObjectFieldParams(args);
}

let diffTree = {};
if (objectFields.length) {
    for (let i = 0; i < objectFields.length; i++) {
        let treeFromIteration;
        const fromNewOb = lo.get(object1, objectFields[i], null);
        const fromOldOb = lo.get(object2, objectFields[i], null);
        if (fromNewOb && !fromOldOb) {
            lo.set(diffTree, objectFields[i], [fromNewOb, fromOldOb]);
            continue;
        }
        if(!fromNewOb && !fromNewOb) {
            continue;
        }
        treeFromIteration = getObjectDiff(fromNewOb, fromOldOb);
        if (!lo.isEmpty(treeFromIteration)) {
            lo.set(diffTree, objectFields[i], treeFromIteration);
        }
    }
} else {
    diffTree = getObjectDiff(object1, object2);
}
if (!lo.isEmpty(diffTree)) {
    return console.log(diffTree);
}


function findAllObjectFieldParams(arr) {

    let ln = arr.length;
    let i = 0;
    const output = [];
    while (i < ln) {
        if (arr[i] === '-p') {
            if (arr[i + 1] !== void(0)) {
                output.push(arr[i + 1]);
                arr.splice(i, 2);
                ln = arr.length;
            } else {
                arr.splice(i, 1);
                ln = arr.length;
            }
            continue;
        }
        i++;
    }
    return output;
}