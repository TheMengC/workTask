const getters = {
  token: (state) => state.user.token,
  baseInfo: (state) => state.user.baseInfo,
  user: (state) => state.user.user,
  replyList: (state) => state.user.replyList,
  emojList: (state) => state.user.emojList,
  applyFriend: (state) => state.user.applyFriend,
  skin: (state) => state.app.skin,
  isWinMaximize: (state) => state.app.isWinMaximize,
  isSideCollapsed: (state) => state.app.isSideCollapsed,
  winType: (state) => state.app.winType,
  fzIcon: (state) => state.user.fzIcon,
  fzReply: (state) => state.user.fzReply,
  isUpdate: (state) => state.user.isUpdate,
  symbolGroup: (state) => state.user.symbolGroup,
};
export default getters;
