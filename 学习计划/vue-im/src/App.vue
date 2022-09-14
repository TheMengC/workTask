<!--
 * @Author: songmengchao@powerpms.com songmengchao@powerpms.com
 * @Date: 2022-07-21 15:46:58
 * @LastEditors: songmengchao@powerpms.com songmengchao@powerpms.com
 * @LastEditTime: 2022-08-02 15:49:42
 * @FilePath: \vue-im\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <van-config-provider :theme-vars="themeVars" class="appProvider">
    <router-view />
  </van-config-provider>
</template>
<script>

export default {
  name: "App",
 
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.appProvider {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
