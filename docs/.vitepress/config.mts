import { defineConfig } from 'vitepress';

import path from 'path';
import fs from 'fs';

const { version, name: packageName, author, license } = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../package.json'),
    { encoding: 'utf-8' },
  ),
);

export default defineConfig({
  title: packageName.replace(/-/g, ' '),
  description: `${packageName.replace(/-/g, ' ')} documentation`,
  base: `/${packageName}/`,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: `/${packageName}/logo.png` }],
  ],
  transformHead: ({ pageData, head }) => {
    head.push(['meta', { property: 'og:site_name', content: packageName }]);
    head.push(['meta', { property: 'og:title', content: pageData.title }]);
    if (pageData.description) {
      head.push(['meta', { property: 'og:description', content: pageData.description }]);   
    }
    head.push(['meta', { property: 'og:image', content: `https://${author}.github.io/${packageName}/logo.png` }]);

    return head
  },
  themeConfig: {
    logo: '/logo.png',
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Introduction', link: '/introduction/getting-started' },
      {
        text: `v${version}`,
        items: [
          {
            items: [
              {
                text: `v${version}`,
                link: `https://github.com/${author}/${packageName}/releases/tag/v${version}`,
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
          { text: 'QueryParams', link: '/utilities/QueryParams' },
          { text: 'QueryParam', link: '/utilities/QueryParam' },
        ],
      },
    ],

    footer: {
      message: `Released under the ${license} License.`,
      copyright: `Copyright © 2025-PRESENT ${author}`,
    },

    socialLinks: [
      { icon: 'github', link: `https://github.com/${author}/${packageName}` },
    ],
  },
});
