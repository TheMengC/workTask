<template>
  <van-nav-bar title="通讯录" />
  <div :style="{ height: height + 'px', overflow: 'auto' }">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item.id"
        :title="item.name"
        is-link
        :to="'/userCard?id=' + item.id"
      />
    </van-list>
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
import { useWindowSize } from "@vant/use";
import { watch } from "vue";
export default {
  setup() {
    const active = ref(1);

    const store = useStore();
    const router = useRouter();

    const { width, height } = useWindowSize();
    // console.log("width.value", width.value); // -> 窗口宽度
    // console.log("height.value", height.value); // -> 窗口高度

    const baseInfo = JSON.parse(store.getters.baseInfo);
    const { id, name, telephone } = store.getters.user;

    console.log("baseInfo", baseInfo);
    console.log("id,name,telephone", id, name, telephone);

    const data = reactive({
      id: id,
      name: name,
      telephone: telephone,
      contactList: baseInfo.contactList,
      height: height.value - 100,
    });

    const contactList = baseInfo.contactList;

    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);

    const onLoad = () => {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      if (contactList && contactList.length) {
        for (let i = 0; i < contactList.length; i++) {
          list.value.push(contactList[i]);
        }

        // 加载状态结束
        loading.value = false;

        // 数据全部加载完成
        if (list.value.length == contactList.length) {
          finished.value = true;
        }
      } else {
        list.value = [];
        finished.value = true;
        loading.value = false;
      }
    };

    return {
      ...toRefs(data),
      active,
      list,
      onLoad,
      loading,
      finished,
    };
  },
};
</script>
<style scoped>
.contactList {
  overflow: auto;
}
</style>