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
  if (fs.existsSync(configPath)) {
    if (fs.existsSync(outputDir)) {
      const configModifyTime = fs.statSync(configPath).mtime;
      const outputDirModifyTime = getFontMTime(outputDir);
      return configModifyTime > outputDirModifyTime;
    }
    return true;
  }

  console.error(`There is no config file at ${configPath}`);
  return false;
}

function fontGenerate(options) {
  const { fontConfig, outputPath, glyphsPath } = options;
  const dir = __dirname;

  if (fontConfig) {
    const fontConfigPath = path.join(dir, '..', '..', fontConfig);
    const outputDirPath = path.join(dir, '..', '..', outputPath);
    const outputDirPathFontana = path.join('..', '..', '..', outputPath);
    const glyphsDirPath = glyphsPath ? path.join(dir, '..', '..', glyphsPath) : path.join(dir, '..', 'fontana', 'icons');

    if (fontUpdateIsNeeded(fontConfigPath, outputDirPath)) {
      const fontFile = fs.readFileSync(fontConfigPath);
      let fontJson = null;

      try {
        fontJson = JSON.parse(fontFile);
      } catch (syntaxError) {
        console.error(`Font config: ${fontConfig} is invalid JSON`);
        return
      }

      fontana.generate({
        fontConfig: fontJson,
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
