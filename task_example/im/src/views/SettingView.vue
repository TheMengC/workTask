<template>
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
      >退出登录</van-button
    >
  </div>

  <van-tabbar v-model="active">
    <!-- <van-tabbar-item icon="home-o"></van-tabbar-item> -->
    <van-tabbar-item replace to="/chat" icon="home-o">最近会话</van-tabbar-item>
    <van-tabbar-item replace to="/contact" icon="friends-o"
      >通讯录</van-tabbar-item
    >
    <van-tabbar-item replace to="/setting" icon="setting-o"
      >设置</van-tabbar-item
    >
  </van-tabbar>
</template>
<script>
import { ref, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Toast } from "vant";

export default {
  setup() {
    const active = ref(2);

    const store = useStore();
    const router = useRouter();

    const baseInfo = JSON.parse(store.getters.baseInfo);
    const { id, name, telephone } = store.getters.user;

    console.log("baseInfo", baseInfo);
    console.log("id,name,telephone", id, name, telephone);

    const data = reactive({
      id: id,
      name: name,
      telephone: telephone,
    });

    const onLogoutClick = () => {
      Toast.loading({
        forbidClick: true,
        loadingType: "spinner",
      });

      store.dispatch("user/logout").then(() => {
        router.push("/login");
        window.stopConnect();
        Toast.clear();
      });
    };

    return {
      ...toRefs(data),
      active,
      onLogoutClick,
    };
  },
};
</script>
<style scoped>
</style>