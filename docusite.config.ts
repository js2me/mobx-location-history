import { defineConfig } from 'docusite';

export default defineConfig({
  colors: {
    light: ['#fb681f', '#c87a45', '#ff8a4f'],
    dark: ['#fb681f', '#ffae77', '#ff8a4f'],
  },
  github: 'http://github.com/js2me/mobx-location-history',
  packageJsonPath: '.',
  changelog: { src: 'CHANGELOG.md' },
  logos: {
    main: '/public/logo.png',
    banner: '/public/banner.png',
  },
  nav: [
    { text: 'Home', link: '/' },
    { text: 'Introduction', link: '/introduction/overview' },
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
        { text: 'blockHistoryWhile', link: '/utilities/blockHistoryWhile' },
        { text: 'QueryParams', link: '/utilities/QueryParams' },
        { text: 'QueryParam', link: '/utilities/QueryParam' },
        { text: 'isObservableHistory', link: '/utilities/isObservableHistory' },
        { text: 'buildSearchString', link: '/utilities/buildSearchString' },
        { text: 'parseSearchString', link: '/utilities/parseSearchString' },
      ],
    },
  ],
});
