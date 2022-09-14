<template>
  <div>
    <van-nav-bar title="通讯录" :fixed="true" />
    <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in list" :key="item.id" :title="item.name" @click="toDetail(item)" />
    </van-list>
    <TabbarView :name="'friendsList'"></TabbarView>
  </div>
</template>

<script>
import TabbarView from "@/views/Tabbar.vue";
export default {
  components: {
    TabbarView
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false
    };
  },
  methods: {
    onLoad() {
      // this.$store.dispatch("ToFriendsList");
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      let friendList = this.$store.state.friendsList;
      if (friendList && friendList.length > 0) {
        setTimeout(() => {
          for (let i = 0; i < friendList.length; i++) {
            this.list.push(friendList[i]);
          }

          // 加载状态结束
          this.loading = false;

          // 数据全部加载完成
          if (this.list.length == friendList.length) {
            this.finished = true;
          }
        }, 500);
      }
    },
    toDetail(item) {
      this.$router.push({
        path: "/friendDetail",
        query: { id: item.id, name: item.name }
      });
    }
  }
};
</script>

<style scoped>
</style>