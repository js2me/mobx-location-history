import { defineConfig } from 'docusite';

export default defineConfig({
  colors: {
    light: ['#fb681f', '#c87a45', '#ff8a4f'],
    dark: ['#fb681f', '#ffae77', '#ff8a4f'],
  },
  github: 'http://github.com/js2me/mobx-location-history',
  packageJsonPath: '.',
  base: `/@{packageJson.name}/`,
  title: '@{packageJson.name}',
  description: '@{packageJson.description}',
  search: 'local',
  changelog: { src: 'CHANGELOG.md' },
  logos: {
    main: '/public/logo.png',
    banner: '/public/banner.png',
  },
  versions: {
    latest: '@{packageJson.version}',
    older: [{ label: '9x', link: '/v9' }],
  },
  nav: {
    '/v9': [
      { text: 'Home', link: '/' },
      { text: 'Introduction', link: '/v9/introduction/overview' },
    ],
    '/': [
      { text: 'Home', link: '/' },
      { text: 'Introduction', link: '/introduction/overview' },
    ],
  },
  sidebar: {
    '/v9': [
      {
        text: 'Introduction',
        items: [
          { text: 'Overview', link: '/v9/introduction/overview' },
          { text: 'Getting started', link: '/v9/introduction/getting-started' },
        ],
      },
      {
        text: 'Core',
        items: [
          { text: 'BrowserHistory', link: '/v9/core/BrowserHistory' },
          { text: 'HashHistory', link: '/v9/core/HashHistory' },
          { text: 'MemoryHistory', link: '/v9/core/MemoryHistory' },
        ],
      },
      {
        text: 'Utilities',
        items: [
          {
            text: 'blockHistoryWhile',
            link: '/v9/utilities/blockHistoryWhile',
          },
          { text: 'QueryParams', link: '/v9/utilities/QueryParams' },
          { text: 'QueryParam', link: '/v9/utilities/QueryParam' },
          {
            text: 'isObservableHistory',
            link: '/v9/utilities/isObservableHistory',
          },
          {
            text: 'buildSearchString',
            link: '/v9/utilities/buildSearchString',
          },
          {
            text: 'parseSearchString',
            link: '/v9/utilities/parseSearchString',
          },
        ],
      },
    ],
    '/': [
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
          { text: 'blockHistoryWhile', link: '/utilities/blockHistoryWhile' },
          { text: 'QueryParams', link: '/utilities/QueryParams' },
          { text: 'QueryParam', link: '/utilities/QueryParam' },
          {
            text: 'isObservableHistory',
            link: '/utilities/isObservableHistory',
          },
          { text: 'buildSearchString', link: '/utilities/buildSearchString' },
          { text: 'parseSearchString', link: '/utilities/parseSearchString' },
        ],
      },
    ],
  },
});
