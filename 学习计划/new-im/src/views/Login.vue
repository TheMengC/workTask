<template>
  <div>
    <van-nav-bar title="登录" />
    <van-image
      round
      width="6rem"
      height="6rem"
      style="display:flex;justify-content:center;align-items:center;"
      :src="require('../assets/logo.png')"
    />
    <van-form>
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit" @click="onSubmit">登录</van-button>
      </div>
      <!-- <div class="reg">
                <div @click="toRegister">没有账号？立即注册</div>
      </div>-->
    </van-form>
  </div>
</template>

<script>
// import md5 from 'js-md5'
import { Toast } from "vant";
import { Login } from "@/api";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    onSubmit() {
      let telephone = this.username.trim();
      this.$store
        .dispatch("ToLogin", {
          telephone: telephone,
          password: this.password
        })
        .then(res => {
            this.$store.dispatch("ToFriendsList")
        });
      this.$router.push("/session");
    }
  }
};
</script>

<style scoped>
.title {
  /* border-radius: 15px; */
  size: 1px;
  height: 50px;
  line-height: 50px;
  background-color: #20a0ff;
  color: #fff;
  text-align: center;
}
</style>