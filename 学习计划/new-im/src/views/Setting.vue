<template>
  <div>
    <van-nav-bar title="设置" />
    <van-cell-group>
      <van-cell title="id" :value="id" />
      <van-cell title="姓名" :value="name" />
      <van-cell title="电话" :value="telephone" />
    </van-cell-group>
    <div style="text-align: center; margin-top: 20px">
      <van-button
        type="primary"
        native-type="submit"
        round
        @click="onLogoutClick"
        style="width: 80%"
      >退出登录</van-button>
    </div>
    <TabbarView :name="'setting'"></TabbarView>
  </div>
</template>

<script>
import TabbarView from "@/views/Tabbar.vue";
import api from "@/api";
import { Toast } from "vant";
export default {
  data() {
    const { id, name } = this.$store.state.userInfo;
    return {
      id: id,
      name: name,
      telephone: ""
    };
  },
  components: {
    TabbarView
  },
  methods: {
    onLogoutClick() {
      this.$store.dispatch("ToLayout");
      this.$router.push("/");
      Toast.clear();
    }
  }
};
</script>