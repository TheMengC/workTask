<template>
  <van-tabbar v-model="activeName">
    <van-tabbar-item replace name="session" icon="home-o" to="/session">最近会话</van-tabbar-item>
    <van-tabbar-item replace name="friendsList" icon="friends-o" to="/friendsList">通讯录</van-tabbar-item>
    <van-tabbar-item replace name="setting" icon="setting-o" to="/setting">设置</van-tabbar-item>
  </van-tabbar>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: () => "session"
    }
  },
  data() {
    return {
      activeName: this.name
    };
  }
};
</script>
<style>
</style>
