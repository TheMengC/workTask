<template>
  <div v-if="groupLs">
    <van-nav-bar :title="name" left-arrow @click-left="onClickLeft" />
    <div
      :style="{
        height: height + 'px',
        overflow: 'auto',
        background: '#F5F5F5',
      }"
    >
      <van-list>
        <!-- <van-cell
        v-for="item in list"
        :key="item.id"
        :title="item.author"
        :label="item.msg"
      /> -->

        <van-cell
          v-for="item in groupLs.msgList"
          :key="item.id"
          ref="scrollRef"
          style="background: #f5f5f5; padding: 7px 5px"
        >
          <div
            v-if="item.format == 0 && item.sender == id"
            style="
              width: 100%;
              display: flex;
              justify-content: flex-start;
              align-items: center;
            "
          >
            <van-image
              width="32"
              height="32"
              style="margin-right: 10px"
              :src="
                item.avatar
                  ? item.avatar
                  : 'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
              "
            />
            <div
              style="
                background: #fff;
                min-height: 30px;
                padding: 2px 10px;
                max-width: 220px;
              "
              class="msg-left"
            >
              {{ item.msg }}
            </div>
          </div>
          <div
            v-if="item.format == 0 && item.sender == userId"
            style="
              width: 100%;
              display: flex;
              justify-content: flex-end;
              align-items: center;
            "
          >
            <div
              style="
                max-width: 220px;
                margin-right: 10px;
                background: rgba(86, 152, 195, 0.3);
                min-height: 30px;
                padding: 2px 10px;
                color: #323233;
              "
              class="msg-right"
            >
              <div>{{ item.msg }}</div>
            </div>
            <van-image
              width="32"
              height="32"
              :src="
                item.avatar
                  ? item.avatar
                  : 'https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
              "
            />
          </div>
        </van-cell>
      </van-list>
    </div>
    <van-cell-group inset style="border: 2px solid #eee; margin: 0">
      <van-field
        v-model="fieldMsg"
        center
        clearable
        label=""
        placeholder="请输入..."
        border
      >
        <template #button>
          <van-button size="small" type="primary" @click="onSendMsg"
            >发送</van-button
          >
        </template>
      </van-field>
    </van-cell-group>
  </div>
</template>
<script>
import { ref, reactive, toRefs, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { Toast } from "vant";
import { useWindowSize } from "@vant/use";
import { watch } from "vue";
import moment from "moment";
import * as API_message from "@/api/message";
import guid from "@/utils/guid";
export default {
  setup() {
    const active = ref(0);
    const scrollRef = ref(null);
    const $el = ref(null);
    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    const show = ref(false);
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    console.log("route.query", route.query);
    const { width, height } = useWindowSize();

    let replyList = store.getters.replyList;
    console.log("replyList", replyList);
    const baseInfo = JSON.parse(store.getters.baseInfo);
    let fri = baseInfo.friendList || [];
    let both = baseInfo.bothList || [];
    let contact = baseInfo.contactList || [];
    let groupList = baseInfo.groupList || [];

    const { id, name } = route.query;
    const { id: userId, name: userName } = store.getters.user;

    const data = reactive({
      id: id,
      name: name,
      userId: userId,
      userName: userName,
      height: height.value - 100,
      recordList: store.getters.replyList,
      fieldMsg: "",
      groupLs: null,
      msgList: [],
    });

    const getGroupJSON = () => {
      console.log("getGroupJSON replyList", replyList);
      if (replyList && replyList.length) {
        replyList.map((item) => {
          console.log("getGroupJSON", item.id == route.query.id);
          if (item.id == route.query.id) {
            //
            data.groupLs = item;
          }
        });
      }else{
        data.groupLs = {
          msgList:[],
        };
      }

      // 定位消息到底部
      // nextTick(() => {
      //   imgLoaded(scrollRef);
      //   show.value = data.groupLs.badge;
      // });
    };

    onMounted(() => {
      console.log("onMounted-->");
      getGroupJSON();
      // document.onclick = function () {
      //   if ($el.value) $el.value.close();
      //   $el.value = null;
      // };
    });

    watch(
      () => store.getters.replyList,
      (newValue) => {
        nextTick(() => {
          console.log("watch newValue", newValue);
          console.log("watch data", data);
          // if (!isScroll.value) {
          //   imgLoaded(scrollRef);
          // }
          replyList = newValue;
          // computedHeight();
        });
      }
    );

    /**
     * 图片加载完成处理函数
     */
    const preloadImages = (arr) => {
      let loadedCount = 0;
      let imgs = [];
      return new Promise(function (resolve, reject) {
        for (let i = 0; i < arr.length; i++) {
          imgs[i] = new Image();
          imgs[i].src = arr[i];
          imgs[i].onload = function () {
            loadedCount++;
            if (loadedCount == arr.length) {
              resolve();
            }
          };
          imgs[i].onerror = function () {
            reject();
          };
        }
      });
    };

    /**
     * 图片加载完成，聊天信息滚到最底部
     */
    const imgLoaded = (ref) => {
      scrollBottom(ref);
      if (!ref.value) return false;
      let msgBox = ref.value.$el;
      if (msgBox) {
        let imgs = msgBox.querySelectorAll("img");
        if (imgs) {
          let arr = [];
          for (let i = 0; i < imgs.length; i++) {
            arr[i] = imgs[i].src;
          }
          preloadImages(arr)
            .then(() => {
              setTimeout(() => {
                scrollBottom(ref);
                computedHeight();
              });
            })
            .catch(function () {
              setTimeout(() => {
                scrollBottom(ref);
                computedHeight();
              });
            });
        }
      }
    };
    /** 滚动条到底部
     */
    const scrollBottom = (ref) => {
      let viewport = ref.value;
      if (viewport) {
        viewport.scrollTo("bottom");
      }
    };
    const computedHeight = () => {
      // 计算最细消息高度
      //
      msgLiUnread.value = [];
      msgLiHeight.value = 0;
      //
      for (let i = 0; i < data.groupLs.msgList.length; i++) {
        const element = data.groupLs.msgList[i];
        if (element.unread === true) {
          if (msgLi.value[i].clientHeight) {
            msgLiHeight.value =
              msgLiHeight.value + msgLi.value[i].clientHeight + 38;
          }

          if (msgLi.value[i].offsetTop) {
            const msgElement = {
              offsetTop: msgLi.value[i].offsetTop + msgLi.value[i].clientHeight,
              msg: data.groupLs.msgList[i],
            };
            msgLiUnread.value.push(msgElement);
          }
        }
      }
      // console.log(
      //   msgLiUnread.value,
      //   scrollRef.value.$el.clientHeight,
      //   msgLiHeight.value
      // );
      if (
        msgLi.value[msgLi.value.length - 1] &&
        msgLiHeight.value < scrollRef.value.$el.clientHeight &&
        msgLi.value[msgLi.value.length - 1].offsetTop <
          scrollRef.value.$el.clientHeight
      ) {
        msgLiUnread.value.forEach((item) => {
          if (item.msg.unread && item.msg.sender != store.getters.user.id) {
            setMsgUnread(item.msg.id, route.query.id);
          }
        });
      }
    };

    console.log("data", data);
    data.msgList =
      data.groupLs && data.groupLs.msgList ? data.groupLs.msgList : [];

    // const onLoad = () => {
    //   // 异步更新数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   for (let i = 0; i < msgList.length; i++) {
    //     list.value.push(msgList[i]);
    //   }
    //   // 加载状态结束
    //   loading.value = false;
    //   // 数据全部加载完成
    //   if (list.value.length == msgList.length) {
    //     finished.value = true;
    //   }
    // };

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

    const onClickLeft = () => router.back();

    const getDomValue = (row) => {
      console.log("getDomValue row", row);
      const format = row.format;
      const msg = row.msg;

      switch (format) {
        case 0:
          return msg;
        case 1:
          return (
            <img
              src={row.imgsrc}
              style={{ maxWidth: "54%" }}
              onClick={onImageClick}
            ></img>
          );
        case 4:
          return (
            <a
              onClick={() => {
                onFileClick(row.file.url);
              }}
              style={{ maxWidth: "54%" }}
            >
              {row.file.name}
            </a>
          );

        default:
          return "";
      }
    };

    const showedCB = (e) => {};
    const onFileClick = (fileUrl) => {
      console.log("onFileClick fileUrl", fileUrl);
      var signwb = plus.webview.create(fileUrl, "fileWebview", {
        titleNView: {
          backgroundColor: "#4ba4f6",
          titleText: "返回",
          titleColor: "#fff",
          autoBackButton: true,
        },
      });
      plus.webview.show("fileWebview", "auto", 600, showedCB); // 显示窗口
      signwb.addEventListener("close", function () {
        console.log("addEventListener close");
        plus.webview.close("fileWebview");
      });
      // 注册返回按键事件
      plus.key.addEventListener(
        "backbutton",
        function () {
          // 事件处理
          console.log("addEventListener backbutton");
          plus.webview.close("fileWebview");
        },
        false
      );
    };

    const onImageClick = (v) => {
      console.log("onImageClick v", v);
      if (v.format == 1) {
      }
    };

    const isEmpty = (html) => {
      let regExp1 = new RegExp("<br[s/]{0,2}>", "gi");
      let regExp2 = new RegExp("<[^img].*?>", "gi");
      let regExp3 = new RegExp("&nbsp;", "gi");
      let regExp4 = new RegExp("\r\n|\n|\r");
      let regExp5 = new RegExp("(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)", "g");

      html = html.replace(regExp1, "\r\n");
      html = html.replace(regExp2, "");
      html = html.replace(regExp3, "");
      return html.replace(regExp4, "").replace(regExp5, "") == "";
    };

    const onSendMsg = () => {
      console.log("onSendMsg data", data);
      if (isEmpty(data.fieldMsg)) return;
      submitMessage(false, "0");
    };

    const submitMessage = async (forward, format, msgTypeJson = {}, img) => {
      console.log('submitMessage store.getters.user',store.getters.user)
      let params = {
        sender: store.getters.user.id,
        receiver: route.query.id,
        action: route.query.action,
        content: data.fieldMsg,
        format: format,
      };
      const r = /<\/?[divbr]+(\s+[divbr]+=".*")*>/g;
      const mathcSpan = /<\/?[span]+(\s+[span]+=".*")*>/g;
      params.content = params.content.replace(r, "\\n");
      if (params.content.substr(-2) == "\\n") {
        params.content = params.content
          .slice(0, -2)
          .split("\\n")
          .filter((item) => !!item)
          .join("\n");
      }
      params.content = params.content.replace(mathcSpan, "");
      if (JSON.stringify(msgTypeJson) != "{}")
        params.content = JSON.stringify(msgTypeJson);
      if (forward) {
        params = {
          sender: store.getters.user.id,
          receiver: forward.id,
          action: forward.memberList ? "1" : "0",
          content: forwardMsg.value.msg,
          format: forwardMsg.value.format,
        };
        format = forwardMsg.value.format;
      }
      const guidKey = guid();
      console.log("guidKey", guidKey);
      console.log(
        "forward, format, msgTypeJson, img, guidKey-->",
        forward,
        format,
        msgTypeJson,
        img,
        guidKey
      );
      messageCallBack(forward, format, msgTypeJson, img, guidKey); // 先存消息
      if (data.groupLs.remove == true) {
        return false;
      }
      if (data.groupLs.state == 1) {
        return false;
      }
      console.log("submitMessage params", params);
      API_message.sendMsg(params).then((resp) => {
        console.log("submitMessage resp", resp);
        data.groupLs.msgList.forEach((item, index) => {
          if (item.id == guidKey) {
            data.groupLs.msgList[index].id = resp.data;
          }
        });
        store.dispatch("user/replyList", data.groupLs);
      });
    };

    const messageCallBack = (
      forward,
      format,
      msgTypeJson = {},
      img,
      guidKey
    ) => {
      let reply = "";
      let msgLs = data.groupLs.msgList;
      console.log('messageCallBack msgLs',msgLs)
      let arrLS = {
        id: guidKey,
        action: route.query.action == "1" ? "3" : "0",
        sender: store.getters.user.id,
        receiver: route.query.id,
        author: store.getters.user.name,
        msg: data.fieldMsg,
        imgsrc: img,
        videosrc: msgTypeJson.video,
        emojsrc: msgTypeJson.itemId,
        format: format,
        fileName: msgTypeJson.name,
        fileSize: msgTypeJson.size,
        unread: true,
        timestamp: new Date().getTime(),
        extra: store.getters.user.id,
      };
      if (forward) {
        // 转发
        replyList = store.getters.replyList;
        replyList.map((item) => {
          if (item.id == forward.id) {
            reply = item;
          }
        });
        if (!reply) {
          if (forward.memberList) {
            reply = {
              id: forward.id,
              action: "3",
              title: forward.name,
              msgList: [],
              groups: [...forward.memberList],
              motto: forward.motto,
              badge: 0,
              uid: forward.uid,
              remove: forward.remove,
              state: forward.state,
            };
          } else {
            reply = {
              id: forward.id,
              action: "0",
              title: forward.name,
              msgList: [],
              groups: [],
              motto: forward.motto,
              badge: 0,
            };
          }
        }

        arrLS = {
          id: guidKey,
          action: forward.memberList ? "3" : "0",
          sender: store.getters.user.id,
          receiver: forward,
          author: store.getters.user.name,
          msg: forwardMsg.value.msg,
          imgsrc: forwardMsg.value.imgsrc,
          videosrc: forwardMsg.value.videosrc,
          emojsrc: forwardMsg.value.emojsrc,
          format: forwardMsg.value.format,
          fileName: forwardMsg.value.fileName,
          fileSize: forwardMsg.value.fileSize,
          unread: true,
          timestamp: new Date().getTime(),
        };
        if (data.groupLs.remove === true) {
          arrLS.fail = true;
        }
        if (data.groupLs.state == 1) {
          arrLS.fail = true;
        }
        reply.msgList.push(arrLS);
      } else {
        if (data.groupLs.remove === true) {
          arrLS.fail = true;
        }
        if (data.groupLs.state == 1) {
          arrLS.fail = true;
        }
        reply = data.groupLs;
        msgLs = msgLs.concat(arrLS);
        reply.msgList = msgLs;
      }
      if (format != 0) {
        arrLS.msg = JSON.stringify(msgTypeJson);
      }
      store.dispatch("user/replyList", reply);
      // 清空文本框内容
      nextTick(() => {
        console.log("messageCallBack nextTick");
        data.fieldMsg = "";
        // imgLoaded(scrollRef);
        // pickVideoRef.value.value = ""; // 清空视频input内容
        // pickFileRef.value.value = ""; // 请空file视频内容
      });
    };

    return {
      ...toRefs(data),
      scrollRef,
      active,
      list,
      getLastTime,
      loading,
      finished,
      onClickLeft,
      getDomValue,
      onSendMsg,
    };
  },
};
</script>
<style scoped>
.msg-left:after {
  border-style: dashed dashed solid solid;
  border-color: transparent;
  border-top-color: inherit;
  border-left-color: inherit;
  right: -8px;
}
.msg-right:before {
  border-style: dashed dashed solid solid;
  border-color: transparent;
  border-top-color: inherit;
  border-left-color: inherit;
  right: -8px;
}
</style>