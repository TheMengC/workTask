const config = {
  title: "MobileChat",

  /**
   * @type {String} true | false
   * @description 跟地址
   */
  baseUrl: process.env.VUE_APP_BASE_URL,
  /**
   * @type {String} true | false
   * @description 跟地址代理
   */
  proxy: "/api",
  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: "production",

  /**
   * @type {string} 1200 | 100%
   * @description 头部是否铺满
   */
  headerWith: "100%",
};
config.install = app => {
  // app.component('v3-layer', LayerConstructor)
  console.log('config app',app)
  app.provide("config", config);
};
export default config;
