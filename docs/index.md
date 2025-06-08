---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: '{packageJson.name}'
  text: Remix's history package
  tagline: + other MobX utilities
  image:
    src: /logo.png
  actions:
    - theme: brand
      text: Get Started
      link: /introduction/overview.md
    - theme: alt
      text: View on GitHub
      link: https://github.com/{packageJson.author}/{packageJson.name}

features:
  - title: MobX-based
    icon: <span class="i-logos:mobx-icon"></span>
    details: Experience the power of MobX
  - title: TypeScript
    icon: <span class="i-logos:typescript-icon"></span>
    details: Out-of-box TypeScript support
  - title: Isomorphic
    icon: 🌐
    details: API is equal with original history package
---
