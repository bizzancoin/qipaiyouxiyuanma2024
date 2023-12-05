import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param permission
 * @param route
 */
function hasPermission(permission, route) {
  if (route.meta && route.meta.mcode) {
    return permission.some(mcode => route.meta.mcode==mcode);
  } else {
    return true;
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param permission
 */
function filterAsyncRouter(asyncRouterMap, permission) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(permission, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, permission);
      }
      return true;
    }
    return false;
  })
  return accessedRouters;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { role, permission } = data;
        let accessedRouters;
        if (role == 2) {
          accessedRouters = asyncRouterMap;
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, permission);
        }
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
}

export default permission
