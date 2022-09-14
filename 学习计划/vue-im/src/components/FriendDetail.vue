<template>
  <div>
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
      >聊天</van-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "FriendDetail",
  data() {
    return {
      name: this.$route.query.name,
      telephone: "139748943029"
    };
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    onChatClick() {
      this.$router.push({
        path: "/chatDetail",
        query: {
          id: this.$route.query.id,
          name: this.$route.query.name,
          action: 0
        }
      });
    }
  }
};
</script>