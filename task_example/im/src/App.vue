<template>
  <van-config-provider :theme-vars="themeVars" class="appProvider">
    <router-view />
  </van-config-provider>
</template>
<script>
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "App",
  setup() {
    const route = useRoute();
    const store = useStore();

    const themeVars = {
      navBarBackgroundColor: "#1989fa",
      navBarIconColor: "#fff",
      navBarTextColor: "#fff",
      navBarTitleTextColor: "#fff",
    };

    return {
      route,
      store,
      themeVars,
    };
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.appProvider {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
