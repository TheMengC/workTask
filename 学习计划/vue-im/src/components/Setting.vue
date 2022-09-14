<!--
 * @Author: songmengchao@powerpms.com songmengchao@powerpms.com
 * @Date: 2022-07-22 09:39:06
 * @LastEditors: songmengchao@powerpms.com songmengchao@powerpms.com
 * @LastEditTime: 2022-08-08 17:10:15
 * @FilePath: \vue-im\src\components\Setting.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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
import TabbarView from "@/components/Tabbar.vue";
import api from "@/api";
import { Toast } from "vant";
export default {
  data() {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    return {
      id: loginData.id,
      name: loginData.name,
      telephone: loginData.telephone
    };
  },
  components: {
    TabbarView
  },
  methods: {
    onLogoutClick() {
      api.layout().then(res => {
        if (res.code == 200) {
          this.$router.push("/");
          localStorage.clear();
          Toast.clear();
        }
      });
    }
  }
};
</script>