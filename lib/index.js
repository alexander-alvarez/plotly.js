/**
* Copyright 2012-2016, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

'use strict';

/*
 * This file is browserify'ed into a standalone 'Plotly' object.
 */

var Core = require('./core');

// Load all trace modules
Core.register([
    require('./bar'),
    require('./pie')
]);

module.exports = Core;
