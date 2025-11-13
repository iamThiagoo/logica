import blogPosts from './components/blog-posts';
import button from './components/button';
import colors from './components/colors';
import container from './components/container';
import dashboardPanel from './components/dashboard-panel';
import dashboardSidebar from './components/dashboard-sidebar';
import main from './components/main';
import modal from './components/modal';
import navigationMenu from './components/navigation-menu';
import pageHeader from './components/page-header';
import radioGroup from './components/radio-group';
import select from './components/select';
import tabs from './components/tabs';
import uiSwitch from './components/switch';
import inputDate from './components/input-date';
import accordion from './components/accordion';
import stepper from './components/stepper';
import checkbox from './components/checkbox';

/**
 * @rules
 * Necessário ser um default export para funcionar em
 * processamento/inicialização do Vite conforme documentação oficial do Nuxt UI
 * @see https://ui.nuxt.com/docs/getting-started/theme/components
 */
export default {
  colors,
  navigationMenu,
  pageHeader,
  dashboardPanel,
  dashboardSidebar,
  modal,
  container,
  tabs,
  main,
  button,
  blogPosts,
  select,
  radioGroup,
  switch: uiSwitch,
  inputDate,
  accordion,
  stepper,
  checkbox,
};
