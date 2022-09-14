<template>
  <van-nav-bar title="最近会话" />
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
        :title="item.title"
        :value="getLastTime(item.msgList)"
        :label="lastMessage(item)"
        is-link
        :to="
          '/chat/group-chat?id=' +
          item.id +
          '&name=' +
          item.title +
          '&action=' +
          0
        "
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
import { useRouter, useRoute } from "vue-router";
import { Toast } from "vant";
import { useWindowSize } from "@vant/use";
import { watch } from "vue";
import moment from "moment";
export default {
  setup() {
    const active = ref(0);

    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    console.log("route", route);
    const { width, height } = useWindowSize();
    // console.log("width.value", width.value); // -> 窗口宽度
    // console.log("height.value", height.value); // -> 窗口高度
    const replyList = store.getters.replyList;

    console.log("replyList", replyList);

    const { id, name, telephone } = store.getters.user;
    console.log("id,name,telephone", id, name, telephone);

    const data = reactive({
      id: id,
      name: name,
      telephone: telephone,
      height: height.value - 100,
      recordList: store.getters.replyList,
    });

    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);

    //处理@服务 给数据植入 symbol 变量
    const setRecord = (list) => {
      console.log(
        "setRecord store.getters.symbolGroup",
        store.getters.symbolGroup
      );
      let curArr = store.getters.symbolGroup.filter(
        (item) => item.sender == route.query.id
      );
      let curObj = list.find((item) => item.id == route.query.id);
      if (curObj) {
        curObj["symbol"] = curArr || [];
      }
      console.log("setRecord list", list);
      return list;
    };

    const contactList = setRecord(data.recordList);

    const onLoad = () => {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      for (let i = 0; i < contactList.length; i++) {
        list.value.push(contactList[i]);
      }
      // 加载状态结束
      loading.value = false;
      // 数据全部加载完成
      if (list.value.length == contactList.length) {
        finished.value = true;
      }
    };

    const isToday = (date) => {
      let d = new Date(date.toString().replace(/-/g, "/"));
      let todaysDate = new Date();
      if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
        return true;
      } else {
        return false;
      }
    };
    const setCurTime = (time) => {
      return isToday(time.format("YYYY-MM-DD HH:mm:ss"))
        ? time.format("HH:mm:ss")
        : time.format("MM-DD HH:mm:ss");
    };
    const getLastTime = (arr) => {
      let cur = new Date();
      if (arr.length > 0) {
        return setCurTime(
          moment(
            arr[arr.length - 1].timestamp || arr[arr.length - 1].createTime
          )
        );
      } else {
        return "";
      }
    };

    const lastMessage = (item) => {
      let unread = item.badge;
      let msgList = item.msgList;
      if (msgList.length > 0) {
        const index = msgList.length - 1;
        const msg = msgList[index];
        if (msg.action == 100 || msg.msgType === 0 || msg.action == 2) {
          return msg.tips || msg.msg;
        } else {
          // if (item.symbol && item.symbol.length > 0) {
          //
          //   return '<span style="color:red">有人</span>';
          // }
          if (msg.format == 4) {
            return unread > 0
              ? "[" + unread + "条]" + msg.author + "：文件"
              : msg.author + "：文件";
          } else if (msg.format == 1) {
            return unread > 0
              ? "[" + unread + "条]" + msg.author + "：图片"
              : msg.author + "：图片";
          } else if (msg.format == 3) {
            return unread > 0
              ? "[" + unread + "条]" + msg.author + "：视频"
              : msg.author + "：视频";
          } else if (msg.format == 15) {
            return unread > 0
              ? "[" +
                  unread +
                  "条]" +
                  msg.author +
                  "：[" +
                  JSON.parse(msg.msg).name +
                  "]"
              : msg.author + "：[" + JSON.parse(msg.msg).name + "]";
          } else if (msg.format == 5) {
            return unread > 0
              ? "[" + unread + "条]" + "[" + msg.author + "]" + "位置"
              : "[" + msg.author + "]" + "位置";
          } else {
            return unread > 0
              ? "[" +
                  unread +
                  "条]" +
                  msg.author +
                  "：" +
                  msg.msg.replace("<br/>", "")
              : msg.author +
                  "：" +
                  msg.msg
                    .replace("<br/>", "")
                    .replace("<div>", "")
                    .replace("</div>", "");
          }
        }
      } else {
        return "";
      }
    };

    watch(
      () => store.getters.replyList,
      (newValue) => {
        data.recordList = newValue;
      }
    );

    return {
      ...toRefs(data),
      active,
      list,
      setRecord,
      onLoad,
      getLastTime,
      lastMessage,
      loading,
      finished,
    };
  },
};
</script>
<style scoped>
</style>