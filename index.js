const path = require('path');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const { getDownloadObject } = require('./lib/utils');

async function setup() {
  try {
    // Get version of tool to be installed
    const version = core.getInput('version');

    console.log('Version is ' + version);

    // Download the specific version of the tool, e.g. as a tarball/zipball
    const download = getDownloadObject(version);

    console.log('download', download);

    const pathToTarball = await tc.downloadTool(download.url);

    console.log('Path to tarball is ' + pathToTarball);
    // Extract the tarball/zipball onto host runner
    const extract = download.url.endsWith('.zip') ? tc.extractZip : tc.extractTar;
    const pathToCLI = await extract(pathToTarball);

    console.log('Path to CLI is ' + pathToCLI);

    // Expose the tool by adding it to the PATH
    core.addPath(path.join(pathToCLI, download.binPath));
  } catch (e) {
    core.setFailed(e);
  }
}

module.exports = setup

if (require.main === module) {
  setup();
}
