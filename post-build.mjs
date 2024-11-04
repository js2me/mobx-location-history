import { postBuildScript, publishScript } from './dist/index.js';

postBuildScript({
  buildDir: 'dist',
  rootDir: '.',
  srcDirName: 'src',
  filesToCopy: ['LICENSE', 'README.md'],
  updateVersion: process.env.PUBLISH_VERSION,
  onPackageVersionChanged: (nextVersion, currVersion) => {
    if (process.env.PUBLISH) {
      publishScript({
        nextVersion,
        currVersion,
        publishCommand: 'pnpm publish',
        commitAllCurrentChanges: true,
        createTag: true,
        githubRepoLink: 'https://github.com/js2me/mobx-location-history',
        cleanupCommand: 'pnpm clean',  
      });
    }
  }
});
