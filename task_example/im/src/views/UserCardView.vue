<template>
  <van-nav-bar :title="name" left-arrow @click-left="onClickLeft" />
  <van-cell-group>
    <van-cell title="姓名" :value="name" />
    <van-cell title="电话" :value="telephone" />
  </van-cell-group>
  <div style="text-align: center; margin-top: 20px">
    <van-button
      type="primary"
      native-type="submit"
      round
      @click="onChatClick"
      style="width: 80%"
      >聊天</van-button
    >
  </div>
</template>
<script>
import { ref, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { Toast } from "vant";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    console.log("router", router);
    console.log("route.query", route.query);

    const id = route.query.id;
    const baseInfo = JSON.parse(store.getters.baseInfo);
    const contactList = baseInfo.contactList;
    console.log("baseInfo", baseInfo);
    console.log("contactList", contactList);
    console.log("id", id);

    const user = contactList.find((value, index, arr) => {
      return value.id === id;
    });

    console.log("user", user);

    const { name, telephone } = user;

    console.log("baseInfo", baseInfo);
    console.log("name,telephone", name, telephone);

    const data = reactive({
      id: id,
      name: name,
      telephone: telephone,
    });

    const onChatClick = () => {
      Toast.loading({
        forbidClick: true,
        loadingType: "spinner",
      });

      router.push(`/chat/group-chat?id=${id}&name=${name}&action=${0}`);
      Toast.clear();
    };

    const onClickLeft = () => router.back();

    return {
      ...toRefs(data),
      onChatClick,
      onClickLeft,
    };
  },
};
</script>
<style scoped>
</style>