#!/usr/bin/env node
const objectDiff = require('object-diff');
const [, , ...args] = process.argv;


// it should looks like

// pkdiff <file-one> <file-two> -p <property1> -p <property2> --quiet

// acceptance criteria:
// 1. as for quiet mode - it should say true (objects are differ) or nothing - empty string
// 2. If not with quiet flag -
//   * it should throw an error if files not found
//   * it should show the difference as specific object in case of diff found
//   * if objects are equal it should return nothing
// 3. Common rules
//   * it should compare whole objects till properties not provided
//   * it should compare only exact given properties if it is provided by args
//   * properties may have depth - for example it may looks like "dependency.tree.something-else" or even "dep.4.rty"

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


const fileName1 = args[0];
const fileName2 = args[1];
const isQuiet = args.includes('--quiet') || args.includes('-q');



if (!fileName1 || !fileName2) {
    if (isQuiet) {
        return;
    } else {
        throw new Error('Required at least two params')
    }
}

let args1 = args.slice(2);
let objectFields;

if (args1.length) {
    objectFields = findAllObjectFieldParams(args1);
    console.log('outputs:, args', objectFields, args1);
}

let objec1;
let object2;

try {
objec1 = require(`${process.cwd()}/${fileName1}`);
object2 = require(`${process.cwd()}/${fileName2}`);
} catch (e) {
    if(isQuiet){
        return;
    } else {
        console.error(e);
        throw new Error('Unable to find file');
    }
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