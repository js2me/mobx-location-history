import { defineGhPagesDocConfig } from "sborshik/vitepress/define-gh-pages-doc-config";

import path from 'path';
import fs from 'fs';

const pckgJson = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../package.json'),
    { encoding: 'utf-8' },
  ),
);

export default defineGhPagesDocConfig(pckgJson, {
  createdYear: '2024',
  themeConfig: {
    logo: '/logo.png',
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Introduction', link: '/introduction/overview' },
      {
        text: `${pckgJson.version}`,
        items: [
          {
            items: [
              {
                text: `${pckgJson.version}`,
                link: `https://github.com/${pckgJson.author}/${pckgJson.name}/releases/tag/${pckgJson.version}`,
              },
            ],
          },
        ],
      },
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Overview', link: '/introduction/overview' },
          { text: 'Getting started', link: '/introduction/getting-started' },
        ],
      },
      {
        text: 'Core',
        items: [
          { text: 'BrowserHistory', link: '/core/BrowserHistory' },
          { text: 'HashHistory', link: '/core/HashHistory' },
          { text: 'MemoryHistory', link: '/core/MemoryHistory' },
        ],
      },
      {
        text: 'Utilities',
        items: [
          { text: 'blockHistoryWhile', link: '/utilities/blockHistoryWhile'},  
          { text: 'QueryParams', link: '/utilities/QueryParams' },
          { text: 'QueryParam', link: '/utilities/QueryParam' },
          { text: 'isObservableHistory', link: '/utilities/isObservableHistory' },
          { text: 'buildSearchString', link: '/utilities/buildSearchString' },
          { text: 'parseSearchString', link: '/utilities/parseSearchString' },
        ],
      },
    ],
  },
});
