/* jshint node: true */
'use strict';
const fs = require('fs');
const path = require('path');
const fontana = require('fontana/lib');
let addonOptions = null;

function getFontMTime(outputDir) {
  const outputDirFiles = fs.readdirSync(outputDir);

  if (outputDirFiles.length) {
    const fontPath = path.join(outputDir, outputDirFiles[0]);
    return fs.statSync(fontPath).mtime
  }

  return null;
}

function fontUpdateIsNeeded(configPath, outputDir) {
  const normalizedConfigPath = path.join(__dirname, configPath);
  const normalizedOutputDirPath = path.join(__dirname, outputDir);

  if (fs.existsSync(normalizedConfigPath)) {
    if (fs.existsSync(normalizedOutputDirPath)) {
      const configModifyTime = fs.statSync(normalizedConfigPath).mtime;
      const outputDirModifyTime = getFontMTime(normalizedOutputDirPath);
      return configModifyTime > outputDirModifyTime;
    }
    return true;
  }

  console.error(`There is no config file at ${configPath}`);
  return false;
}

function fontGenerate(options) {
  const { fontConfig, outputPath, glyphsPath } = options;

  if (fontConfig) {
    const fontConfigPath = path.join('..', '..', fontConfig);
    const outputDirPath = path.join('..', '..', outputPath);
    const outputDirPathFontana = path.join('..', '..', '..', outputPath);
    const glyphsDirPath = glyphsPath ? path.join('..', '..', glyphsPath) : path.join('..', 'fontana', 'icons');

    if (fontUpdateIsNeeded(fontConfigPath, outputDirPath)) {
      fontana.generate({
        fontConfig: require(fontConfigPath),
        outputPath: outputDirPathFontana,
        glyphsPath: glyphsDirPath
      });
    }
  }
}

module.exports = {
  name: 'ember-fontana',

  included: (app) => {
    addonOptions = app.options.fontana || {};
  },
  preBuild: function(result) {
    fontGenerate(addonOptions);
  }
};
