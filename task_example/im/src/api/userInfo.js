import request from "@/utils/request";
//修改logo
export function editLogo() {
  return request({
    url: `/user/logo`,
    method: "patch",
  });
}
