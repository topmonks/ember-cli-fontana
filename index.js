/* jshint node: true */
'use strict';
const fs = require('fs');
const path = require('path');
const fontana = require('fontana/lib');

module.exports = {
  name: 'ember-fontana',

  included: (app) => {
    const options = app.options.fontana || {};
    const { fontConfig, outputPath, glyphsPath } = options;

    if (fontConfig) {
      const fontConfigPath = path.join('..', '..', fontConfig);
      const outputDirPath = path.join('..', '..', '..', outputPath);
      const glyphsDirPath = glyphsPath ? path.join('..', '..', glyphsPath) : path.join('..', 'fontana', 'icons');

      fontana.generate({
        fontConfig: require(fontConfigPath),
        outputPath: outputDirPath,
        glyphsPath: glyphsDirPath
      });
    }
  }
};
