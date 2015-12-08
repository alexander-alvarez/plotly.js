/**
* Copyright 2012-2015, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/


'use strict';

var globalTraceAttrs = require('./plots/attributes');

var traceRegistry = exports.traceRegistry = {};
var plotRegistry = exports.plotRegistry = {};
var componentRegistry = exports.componentRegistry = {};

exports.allTypes = [];
exports.allCategories = {};


/**
 * Register a module as the handler for a trace type
 *
 * @param {object} _module
 *  the module that will handle plotting for a given trace
 *      - name {string}
 *      - categories {array of strings}
 *      - meta {object}
 */
exports.registerTrace = function registerTrace(_module) {
    var type = _module.type,
        categories = _module.categories,
        meta = _module.meta;

    if(traceRegistry[type]) {
        throw new Error('type ' + type + ' already registered');
    }

    var categoryObj = {};
    for(var i = 0; i < categories.length; i++) {
        categoryObj[categories[i]] = true;
        exports.allCategories[categories[i]] = true;
    }

    traceRegistry[type] = {
        'module': _module,
        categories: categoryObj
    };

    if(meta && Object.keys(meta).length) {
        exports.traceRegistry[type].meta = meta;
    }

    exports.allTypes.push(type);
};

function getTraceType(traceType) {
    if(typeof traceType === 'object') traceType = traceType.type;
    return traceType;
}

/**
 * Trace object to trace module
 *
 * @param {object} trace trace object in question
 *
 */
exports.getTraceModule = function getTraceModule(trace) {
    if(trace.r !== undefined) {
        console.log('Oops, tried to put a polar trace ' +
            'on an incompatible graph of cartesian ' +
            'data. Ignoring this dataset.', trace
        );
        return false;
    }

    var _module = traceRegistry[getTraceType(trace)];
    if(!_module) return false;
    return _module.module;
};


/**
 * Is this trace type in this category?
 *
 * @param {object or string} traceType a trace (object) or trace type (string)
 * @param {string} category a category (string)
 *
 */
exports.traceIs = function traceIs(traceType, category) {
    traceType = getTraceType(traceType);

    if(traceType === 'various') return false;  // FIXME

    var _module = traceRegistry[traceType];

    if(!_module) {
        if(traceType !== undefined) {
            console.warn('unrecognized trace type ' + traceType);
        }

        // TODO is this correct?
        _module = traceRegistry[globalTraceAttrs.type.dflt] ||
            traceRegistry[exports.allTypes[0]];
    }

    return !!_module.categories[category];
};

// along with registerPlots and registerComponent ...
