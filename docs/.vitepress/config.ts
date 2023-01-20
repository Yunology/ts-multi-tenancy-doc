import { DefaultTheme, defineConfig } from "vitepress";

const nav: DefaultTheme.NavItem[] = [
  { text: 'Home', link: '/' },
  { text: 'Usage', link: '/guide/usage/0-build-the-environement' },
  { text: 'GitHub', link: 'https://github.com/yunology/ts-multi-tenancy' },
];
const sidebar: DefaultTheme.Sidebar = {
  '/': [
    {
      text: 'Guide',
      items: [
        { text: 'Introduction', link: '/guide/introduction' },
        { text: 'Installation', link: '/guide/installation' },
        { text: 'Environment Require', link: '/guide/environment-require' },
      ],
    },
    {
      text: 'Usage',
      collapsed: true,
      collapsible: true,
      items: [
        { text: '0. Build the environment', link: '/guide/usage/0-build-the-environement' },
        { text: '1. Prepare your model', link: '/guide/usage/1-prepare-your-model' },
        { text: '2. Database infrastructure', link: '/guide/usage/2-database-infrastructure' },
        { text: '3. Service with busniess logics', link: '/guide/usage/3-service-with-busniess-logics' },
        { text: '4. Plan groups services', link: '/guide/usage/4-plan-groups-services' },
        { text: '5. Tool scripts for migration', link: '/guide/usage/5-toolscripts-for-migration' },
      ],
    },
    {
      text: 'Designs',
      collapsed: true,
      collapsible: true,
      items: [
        {
          text: 'Model Entities',
          link: '/designs/entities/index.md',
          items: [
            { text: 'Base Entity', link: '/designs/entities/base' },
            { text: 'Tenant Base Entity', link: '/designs/entities/tenant-base' },
          ],
        },
      ],
    },
  ],
};

export default defineConfig({
  base: '/ts-multi-tenancy-doc/',
  title: 'ts-multi-tenancy',
  themeConfig: {
    nav,
    sidebar,
  },
});
