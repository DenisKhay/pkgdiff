const _ = require('lodash');

module.exports = function (base, target) {

    // history = []

    // base
    // target
    // keys = base.keys
    // currentIdx = 0
    // diffTree = {}

    // step in condition:
    // store all above as history object
    // set base target from two new and to go up

    // step out condition:
    // get last history object and set diffTree[keys[currentIdx]] = diffTree
    // set main refs from history
    // remove last history object and continue


    const parents = [];
    let idx = 0;
    let keys = Object.keys(base);
    let diffTree = {};
    while (true) {

        while (keys.length > idx) {
            const prop = keys[idx];

            if (_.isEqual(base[prop], target[prop])) {
                idx++;
                continue;
            }

            if (_.isObject(base[prop]) && _.isObject(target[prop]) && !_.isEmpty(base[prop]) && !_.isEmpty(target[prop])) {
                parents.push({base, target, keys, idx, diffTree});
                base = base[prop];
                target = target[prop];
                idx = 0;
                keys = Object.keys(base);
                diffTree = {};
            } else {
                diffTree[prop] = [base[prop], target[prop]];
                idx++;
            }
        }

        if (parents.length) {
            const parentIter = parents.pop();
            base = parentIter['base'];
            target = parentIter['target'];
            keys = parentIter['keys'];
            const oldDiffTree = parentIter['diffTree'];
            oldDiffTree[keys[parentIter['idx']]] = diffTree;
            diffTree = oldDiffTree;
            idx = parentIter['idx'] + 1;
        } else {
            break;
        }
    }
    return diffTree;
};