/* eslint-disable */
import "./message.js";
import "./replybody.js";
import "./sentbody.js";

/*CIM服务器IP*/
const CIM_HOST = "8.130.28.191"; //window.location.hostname;
/*
 * 服务端 websocket端口
 */
const CIM_PORT = 30000;
// const CIM_URI = "ws://" + CIM_HOST + ":" + CIM_PORT;
const CIM_URI = "ws://8.130.28.191:8081/websocket/";
//const CIM_URI = "ws://dev.powerpms.com:16980/hxws/";
const APP_VERSION = "1.0.0";
const APP_CHANNEL = "web";
const APP_PACKAGE = "com.farsunset.cim";

/*
 *特殊的消息类型，代表被服务端强制下线
 */
const ACTION_999 = "999";
const DATA_HEADER_LENGTH = 1;

const MESSAGE = 2;
const REPLY_BODY = 4;
const SENT_BODY = 3;
const PING = 1;
const PONG = 0;
/**
 * PONG字符串转换后
 * @type {Uint8Array}
 */
const PONG_BODY = new Uint8Array([80, 79, 78, 71]);

let socket;
let manualStop = false;
const CIMPushManager = {};
const onConnect = CIMPushManager.connect = function () {
  manualStop = false;
  window.localStorage.account = "";
  socket = new WebSocket(CIM_URI);
  socket.cookieEnabled = false;
  socket.binaryType = "arraybuffer";
  socket.onopen = CIMPushManager.innerOnConnectFinished;
  socket.onmessage = CIMPushManager.innerOnMessageReceived;
  socket.onclose = CIMPushManager.innerOnConnectionClosed;
}

const onbindAccount = CIMPushManager.bindAccount = function (account) {
  // '绑定账号'
  window.localStorage.account = account;
  let deviceId = window.localStorage.deviceId;
  if (deviceId == "" || deviceId == undefined) {
    deviceId = generateUUID();
    window.localStorage.deviceId = deviceId;
  }

  let browser = getBrowser();
  let body = new proto.com.farsunset.cim.sdk.web.model.SentBody();
  body.setKey("client_bind");
  body.setTimestamp(new Date().getTime());
  body.getDataMap().set("uid", account);
  body.getDataMap().set("channel", APP_CHANNEL);
  body.getDataMap().set("appVersion", APP_VERSION);
  body.getDataMap().set("osVersion", browser.version);
  body.getDataMap().set("packageName", APP_PACKAGE);
  body.getDataMap().set("deviceId", deviceId);
  body.getDataMap().set("deviceName", browser.name);
  CIMPushManager.sendRequest(body);
};

CIMPushManager.stop = function () {
  manualStop = true;
  socket.close();
};
//new
window.stopConnect = function () {
  console.log('退出登录')
  manualStop = true;
  socket.close();
};

CIMPushManager.resume = function () {
  manualStop = false;
  CIMPushManager.connect();
};

CIMPushManager.innerOnConnectFinished = function () {
  console.log("websocket的onopen方法:链接成功");
  let account = window.localStorage.account;
  if (account === "" || account === undefined) {
    window.onConnectFinished();
  } else {
    CIMPushManager.bindAccount(account);
  }
};

CIMPushManager.innerOnMessageReceived = function (e) {
  console.log("websocket的onMessage方法:接收消息");

  let data = new Uint8Array(e.data);
  let type = data[0];
  let body = data.subarray(DATA_HEADER_LENGTH, data.length);
  if (type === PING) {
    console.log("websocket的onMessage方法,type:ping", type, body);
    CIMPushManager.pong();
    // console.log("ping");
    return;
  }
  if (type == MESSAGE) {
    console.log("websocket的onMessage方法,type:message", body);
    let message = proto.com.farsunset.cim.sdk.web.model.Message.deserializeBinary(
      body
    );
    onInterceptMessageReceived(message.toObject(false));
    return;
  }

  if (type == REPLY_BODY) {
    console.log("websocket的onMessage方法,type:reply_body", body);
    let message = proto.com.farsunset.cim.sdk.web.model.ReplyBody.deserializeBinary(
      body
    );
    // console.log(message.getMessage());
    /**
     * 将proto对象转换成json对象，去除无用信息
     */
    let reply = {};
    reply.code = message.getCode();
    reply.key = message.getKey();
    reply.message = message.getMessage();
    reply.timestamp = message.getTimestamp();
    reply.data = {};

    /**
     * 注意，遍历map这里的参数 value在前key在后
     */
    message.getDataMap().forEach(function (v, k) {
      reply.data[k] = v;
    });

    window.onReplyReceived(reply);
  }
};

CIMPushManager.innerOnConnectionClosed = function (e) {
  console.log("websocket的onclose方法:关闭连接");
  if (!manualStop) {
    let time = Math.floor(Math.random() * (30 - 15 + 1) + 15);
    setTimeout(function () {
      CIMPushManager.connect();
    }, time);
  }
};

CIMPushManager.sendRequest = function (body) {
  let data = body.serializeBinary();
  let protobuf = new Uint8Array(data.length + 1);
  protobuf[0] = SENT_BODY;
  protobuf.set(data, 1);
  socket.send(protobuf);
};

CIMPushManager.pong = function () {
  let pong = new Uint8Array(PONG_BODY.byteLength + 1);
  pong[0] = PONG;
  pong.set(PONG_BODY, 1);
  socket.send(pong);
};
function onInterceptMessageReceived(message) {
  /*
   *被强制下线之后，不再继续连接服务端
   */
  if (message.action == ACTION_999) {
    manualStop = true;
  }
  /*
   *收到消息后，将消息发送给页面
   */
  if (onMessageReceived instanceof Function) {
    window.onMessageReceived(message);
  }
}

function getBrowser() {
  let explorer = window.navigator.userAgent.toLowerCase();
  if (explorer.indexOf("msie") >= 0) {
    let ver = explorer.match(/msie ([\d.]+)/)[1];
    return { name: "IE", version: ver };
  } else if (explorer.indexOf("firefox") >= 0) {
    let ver = explorer.match(/firefox\/([\d.]+)/)[1];
    return { name: "Firefox", version: ver };
  } else if (explorer.indexOf("chrome") >= 0) {
    let ver = explorer.match(/chrome\/([\d.]+)/)[1];
    return { name: "Chrome", version: ver };
  } else if (explorer.indexOf("opera") >= 0) {
    let ver = explorer.match(/opera.([\d.]+)/)[1];
    return { name: "Opera", version: ver };
  } else if (explorer.indexOf("Safari") >= 0) {
    let ver = explorer.match(/version\/([\d.]+)/)[1];
    return { name: "Safari", version: ver };
  }
  return { name: "Other", version: "1.0.0" };
}

function generateUUID() {
  let d = new Date().getTime();
  let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
    c
  ) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid.replace(/-/g, "");
}

export { onConnect, onbindAccount };
