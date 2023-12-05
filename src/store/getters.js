const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  visitedViews: state => state.app.visitedViews,
  cachedViews: state => state.app.cachedViews,
  // token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.nickname,
  // introduction: state => state.user.introduction,
  role: state => state.user.role,
  permission: state => state.user.permission,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs
}
export default getters
