import { defineDocsVitepressConfig } from "sborshik/vitepress";
import { ConfigsManager } from "sborshik/utils";

const configs = ConfigsManager.create('../')

export default defineDocsVitepressConfig(configs, {
  createdYear: '2024',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Introduction', link: '/introduction/overview' },
      {
        text: `${configs.package.version}`,
        items: [
          {
            items: [
              {
                text: `${configs.package.version}`,
                link: `https://github.com/${configs.package.author}/${configs.package.name}/releases/tag/${configs.package.version}`,
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
