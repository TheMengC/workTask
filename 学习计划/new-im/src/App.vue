<template>
    <van-config-provider :theme-vars="themeVars" class="appProvider">
      <router-view />
    </van-config-provider>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      themeVars: {
        navBarBackgroundColor: "#1989fa",
        navBarIconColor: "#fff",
        navBarTextColor: "#fff",
        navBarTitleTextColor: "#fff"
      }
    };
  }
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
