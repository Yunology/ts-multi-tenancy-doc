import { DefaultTheme, defineConfig } from "vitepress";

const nav: DefaultTheme.NavItem[] = [
  { text: 'Home', link: '/' },
  { text: 'Guide', link: '/guide/introduction' },
  { text: 'GitHub', link: 'https://github.com/yunology/ts-multi-tenancy' },
];
const sidebar: DefaultTheme.Sidebar = [
  {
    text: 'Guide',
    items: [
      { text: 'Introduction', link: '/guide/introduction' },
      { text: 'Installation', link: '/guide/installation' },
      { text: 'Environment Require', link: '/guide/environment-require' },
      { text: 'Usage', link: '/guide/usage' },
    ],
  },
  {
    text: 'Designs',
    items: [
      {
        text: 'Modeling Entities',
        items: [
          { text: 'Base Entity', link: '/designs/entities/base' },
          { text: 'Tenant Base Entity', link: '/designs/entities/tenant-base' },
        ],
      },
    ],
  },
];

export default defineConfig({
  base: '/ts-multi-tenancy-doc/',
  title: 'ts-multi-tenancy',
  themeConfig: {
    nav,
    sidebar,
  },
});
