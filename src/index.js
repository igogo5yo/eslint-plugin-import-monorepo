const noSrcOrBuild = require('./noSrcOrBuild');
const smartWorkspaceImport = require('./smartWorkspaceImport');

module.exports = {
  rules: {
    'no-src-or-build': noSrcOrBuild,
    'smart-workspace-import': smartWorkspaceImport
  }
};
