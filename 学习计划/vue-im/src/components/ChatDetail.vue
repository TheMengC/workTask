<template>
  <div style="height: 100%">
    <van-nav-bar :title="name" left-arrow @click-left="onClickLeft" />
    <div :style="{height: height + 'px',overflow: 'auto',background: '#F5F5F5',}">
      <van-list>
        <van-cell
          v-for="item in this.msgList"
          :key="item.id"
          ref="scrollRef"
          style="background: #f5f5f5; padding: 7px 5px"
        >
          <div style="width: 100%;display: flex;justify-content: flex-end;align-items: center;">
            <div
              style="background: #fff;min-height: 30px;padding: 2px 10px;max-width: 220px;"
              class="msg-right"
            >{{ item.msg }}</div>
            <van-image
              width="32"
              height="32"
              style="margin-left: 10px"
              :src="'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'"
            />
          </div>
        </van-cell>
      </van-list>
    </div>
    <van-cell-group inset style="border: 2px solid #eee; margin: 0, position:fixed, bottom: 0">
      <van-field v-model="fieldMsg" center clearable label placeholder="请输入..." border>
        <template #button>
          <van-button size="small" type="primary" @click="onSendMsg">发送</van-button>
        </template>
      </van-field>
    </van-cell-group>
  </div>
</template>
<script>
import api from "@/api";
export default {
  name: "chatDeatil",
  data() {
    return {
      height: document.documentElement.clientHeight - 100,
      name: this.$route.query.name,
      fieldMsg: "",
      msgList: []
    };
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    onSendMsg() {
      let params = {
        receiver: this.$route.query.id,
        content: this.fieldMsg,
        action: this.$route.query.action
      };
      api.sendMsg(params).then(res => {
        console.log("res", res);
        if (res.code == 200) {
          this.msgList.push({ id: params.receiver, msg: this.fieldMsg });
          this.fieldMsg = ""
        }
      });
    }
  }
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