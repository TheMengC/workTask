<!--
 * @Author: songmengchao@powerpms.com songmengchao@powerpms.com
 * @Date: 2022-07-21 15:48:39
 * @LastEditors: songmengchao@powerpms.com songmengchao@powerpms.com
 * @LastEditTime: 2022-08-02 17:02:26
 * @FilePath: \vue-im\src\components\Login.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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
            </div> -->
        </van-form>
    </div>
</template>

<script>
    import md5 from 'js-md5'
    import { Toast } from 'vant';
    import api from '@/api'
    export default {
        name: "Login",
        data() {
            return {
                username: '',
                password: '',
            };
        },
        methods: {
            onSubmit() {
                let telephone = this.username.trim()
                let password = md5(this.password)
                api.Login({telephone:telephone, password:password})
                .then((res) => {
                    console.log("res", res)
                    if(res.code == 200) {
                        Toast.success('登录成功');
                        localStorage.setItem("loginData", JSON.stringify(res.data))
                        this.$router.push('/session')
                    } else {
                        Toast.error("账号或密码错误，请重新输入")
                    }
                })
            }                
        }
    }

</script>

<style scoped>
    .title {
        /* border-radius: 15px; */
        size:1px;
        height: 50px;
        line-height: 50px;
        background-color: #20a0ff;
        color: #fff;
        text-align: center;
    }

</style>