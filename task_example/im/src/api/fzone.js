import request from "@/utils/request";
//获取朋友圈列表
export function getFzList(currentPage) {
  return request({
    url: `/moment/timeline/${currentPage}`,
    method: "get",
  });
}
//添加评论
export function sendFzCom(data) {
  return request({
    url: `/comment`,
    method: "post",
    data,
  });
}

//获取评论详情
export function getFzCom(id) {
  return request({
    url: `/comment/${id}`,
    method: "get",
  });
}

//删除评论
export function delFzCom(id) {
  return request({
    url: `/comment/${id}`,
    method: "delete",
  });
}
///comment/praise/{momentId}
//点赞评论
export function praiseFzCom(momentId, data) {
  return request({
    url: `/comment/praise/${momentId}`,
    method: "post",
    data,
  });
}

//发朋友圈
export function postPubFz(data) {
  return request({
    url: `/moment`,
    method: "post",
    data,
  });
}
//删除朋友圈
export function delPubFz(id) {
  return request({
    url: `/moment/${id}`,
    method: "delete",
  });
}
//获取别人朋友圈
export function getOtherFz(makerId, currentPage) {
         return request({
           url: `/moment/list/other/${makerId}/${currentPage}`,
           method: "get",
         });
}
//获取自己朋友圈
export function getselfFz(currentPage) {
         return request({
           url: `/moment/list/me/${currentPage}`,
           method: "get",
         });
}
//上传朋友圈接口
export function uploadFile1(bucket, key, data) {
  return request({
    url: `/file/${bucket}/${key}`,
    method: "post",
    data,
  });
}
