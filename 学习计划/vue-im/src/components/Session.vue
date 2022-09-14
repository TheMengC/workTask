<template>
    <div>
        <van-nav-bar title="最近会话" />
        <TabbarView :name="'session'"></TabbarView>
    </div>
</template>

<script>
import TabbarView from "@/components/Tabbar.vue";
export default {
  name:"Session",
  data() {
    return {

    }
  },
  components: {
    TabbarView
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
