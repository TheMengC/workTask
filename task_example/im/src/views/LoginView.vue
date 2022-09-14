<template>
  <div class="g-window">
    <div class="warp">
      <div class="content">
        <img alt="logo" src="../assets/logo.png" />
        <h2>MobileChat</h2>
        <van-form @submit="handleSubmit">
          <van-cell-group inset>
            <van-field
              v-model="telephone"
              name="telephone"
              label="用户名"
              placeholder="用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
              v-model="password"
              type="password"
              name="password"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
          </van-cell-group>
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">
              登录
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Toast } from "vant";
import { getOfflineMessage } from "@/api/message";
import filterMessage from "@/utils/filterMessage";
import Cache, { Keys } from "@/utils/cache";
import { webSocket } from "@/utils/webSocket"; // 开启webSocket
export default {
  components: {},
  setup() {
    const store = useStore();
    const router = useRouter();

    const telephone = ref("");
    const password = ref("");

    const handleSubmit = (values) => {
      console.log("submit values", values);

      Cache.removeItem(Keys.baseInfo);
      store.commit("user/SET_BASEINFO", "");
      
      store.dispatch("user/login", values).then((response) => {
        console.log(".then response", response);
        webSocket(); // 开启webSocket

        Toast.loading({
          message: "加载中...",
        }),
          loginCallBack(response);
      });
    };

    const loginCallBack = async (response) => {
      // console.log("loginCallBack loadingInstance1", loadingInstance1);
      // console.log("loginCallBack response", response);
      // 登录回调
      const baseInfo = store.getters.baseInfo; // 初始化信息
      if (localStorage.getItem("fzList")) {
        localStorage.removeItem("fzList");
      }

      console.log("loginCallBack baseInfo", baseInfo);
      if (!baseInfo) {
        await store.dispatch("user/getInfo");
      }
      const res = await getOfflineMessage(); // 获取离线消息
      console.log("loginCallBack res", res);
      if (res.code === 200) {
        let data = res.data;
        if (data) {
          // 有离线消息
          await filterMessage(data, response.id);
        } else {
          console.log("没有离线消息");
          const replyList = JSON.parse(Cache.getItem(response.id)) || [];
          console.log("replyList", replyList);
          store.commit("user/SET_CACHEREPLYLIST", replyList);
        }
      }
      router.push("/chat");
      Toast.clear();
    };

    return {
      // 这里返回的任何内容都可以用于组件的其余部分
      telephone,
      password,
      handleSubmit,
      loginCallBack,
    };
  },
};
</script>
<style scoped>
.g-window {
  width: 100%;
  height: 100%;
  position: relative;
}
.warp {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: #0091e4; */
}
.content {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 80%;
  height: auto;
  transform: translate(-50%, -50%);
}
</style>