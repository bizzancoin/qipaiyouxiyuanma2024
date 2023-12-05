import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    meta :{ hidden: true},
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  },
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/email',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     component: _import('email/email'),
  //     name: 'email',
  //     meta: {
  //       title: 'email',
  //       icon: 'email'
  //     }
  //   }]
  // },
  {
    path: '/gamemgr',
    component: Layout,
    redirect: 'noredirect',
    name: 'gamemgr',
    meta: {
      title: 'gamemgr',
      icon: 'component',
      mcode: 'A'
    },
    children: [
      { path: 'gamelist', component: _import('gamemgr/gamelist'), name: 'gamelist', meta: { title: 'gamelist', mcode: 'A0101' } },
      // { path: 'shuihuroommgr', component: _import('gamemgr/shuihuroom'), name: 'shuihuroommgr', meta: { title: 'shuihuroommgr' }, hidden: true },
      // { path: 'fruitsroommgr', component: _import('gamemgr/fruitsroom'), name: 'fruitsroommgr', meta: { title: 'fruitsroommgr' }, hidden: true },
      // { path: 'animalsroommgr', component: _import('gamemgr/animalsroom'), name: 'animalsroommgr', meta: { title: 'animalsroommgr' }, hidden: true },
      // { path: 'niuniuroommgr', component: _import('gamemgr/niuniuroom'), name: 'niuniuroommgr', meta: { title: 'niuniuroommgr' }, hidden: true },
      { path: 'brnnroommgr', component: _import('gamemgr/bairen_niuniuroom'), name: 'brnnroommgr', meta: { title: 'brnnroommgr', mcode: 'A0201' }, hidden: true },
      { path: 'ddzroommgr', component: _import('gamemgr/ddzroom'), name: 'ddzmgr', meta: { title: 'ddzroommgr', mcode: 'A0201' }, hidden: true },
      // { path: 'lkpyroommgr', component: _import('gamemgr/lkpyroom'), name: 'lkpyroommgr', meta: { title: 'lkpyroommgr' }, hidden: true },
      { path: 'jcbyroommgr', component: _import('gamemgr/jcbyroom'), name: 'jcbyroommgr', meta: { title: 'jcbyroommgr', mcode: 'A0201' }, hidden: true },
      // { path: 'bjroommgr', component: _import('gamemgr/blackjackroom'), name: 'bjroommgr', meta: { title: 'bjroommgr' }, hidden: true },
      // { path: 'zjhroommgr', component: _import('gamemgr/zjhroom'), name: 'zjhroommgr', meta: { title: 'zjhroommgr' }, hidden: true },
      { path: 'baccaratroommgr', component: _import('gamemgr/baccaratroom'), name: 'baccaratroommgr', meta: { title: 'baccaratroommgr', mcode: 'A0201' }, hidden: true },
      { path: 'noticemgr', component: _import('gamemgr/gamenotice'), name: 'noticemgr', meta: { title: 'noticemgr', mcode: 'A0301' } },

    ]
  },
  {
    path: '/usermgr',
    component: Layout,
    redirect: 'noredirect',
    name: 'usermgr',
    meta: {
      title: 'usermgr',
      icon: 'peoples',
      mcode: 'B'
    },
    children: [
      { path: 'userlist', component: _import('usermgr/userlist'), name: 'userlist', meta: { title: 'userlist', mcode: 'B0101' } },
      { path: 'useronlines', component: _import('usermgr/useronlines'), name: 'useronlines', meta: { title: 'useronlines', mcode: 'B0201' } },
    ]
  },
  {
    path: '/personctrl',
    component: Layout,
    redirect: 'noredirect',
    name: 'personctrl',
    meta: {
      title: 'personctrl',
      icon: 'component',
      mcode: 'C',
      hidden: true
    },
    children: [{
      path: 'index',
      component: _import('personctrl/index'),
      name: 'personctrl',
      meta: { title: 'personctrl', icon: 'people', mcode: 'C0101' }
    }]
  },
  {
    path: '/gamectrl',
    component: Layout,
    redirect: 'noredirect',
    name: 'gamectrl',
    meta: {
      title: 'gamectrl',
      icon: 'component',
      mcode: 'D'
    },
    children: [
      // { path: 'shuihucontrol', component: _import('gamectrl/shuihucontrol'), name: 'shuihucontrol', meta: { title: 'shuihucontrol' } },
      // { path: 'fruitcontrol', component: _import('gamectrl/fruitcontrol'), name: 'fruitcontrol', meta: { title: 'fruitcontrol' } },
      // { path: 'fqzscontrol', component: _import('gamectrl/fqzscontrol'), name: 'fqzscontrol', meta: { title: 'fqzscontrol' } },
      // { path: 'srnncontrol', component: _import('gamectrl/srnncontrol'), name: 'srnncontrol', meta: { title: 'srnncontrol' } },
      { path: 'brnncontrol', component: _import('gamectrl/brnncontrol'), name: 'brnncontrol', meta: { title: 'brnncontrol', mcode: 'D0101' } },
      // { path: 'lkpycontrol', component: _import('gamectrl/lkpycontrol'), name: 'lkpycontrol', meta: { title: 'lkpycontrol' } },
      { path: 'jcbycontrol', component: _import('gamectrl/jcbycontrol'), name: 'jcbycontrol', meta: { title: 'jcbycontrol', mcode: 'D0101' } },
      // { path: 'goldflowercontrol', component: _import('gamectrl/goldflowercontrol'), name: 'goldflowercontrol', meta: { title: 'goldflowercontrol' } },
      // { path: 'blackjackcontrol', component: _import('gamectrl/blackjackcontrol'), name: 'blackjackcontrol', meta: { title: 'blackjackcontrol' } },
      { path: 'baccaratcontrol', component: _import('gamectrl/baccaratcontrol'), name: 'baccaratcontrol', meta: { title: 'baccaratcontrol', mcode: 'D0101' } }
    ]
  },
  {
    path: '/transmgr',
    component: Layout,
    redirect: 'noredirect',
    name: 'transmgr',
    meta: {
      title: 'transmgr',
      icon: 'shoppingCard',
      mcode: 'E'
    },
    children: [
      { path: 'giftlist', component: _import('transmgr/giftlist'), name: 'giftlist', meta: { title: 'giftlist', mcode: 'E0101' } },
      // { path: 'orderlist', component: _import('transmgr/orderlist'), name: 'orderlist', meta: { title: 'orderlist' } },
      { path: 'goldlog', component: _import('transmgr/goldlog'), name: 'goldlog', meta: { title: 'goldlog', mcode: 'E0201' } },
      { path: 'safegoldlog', component: _import('transmgr/safegoldlog'), name: 'safegoldlog', meta: { title: 'safegoldlog', mcode: 'E0301' } },
      { path: 'gamegoldlog', component: _import('transmgr/gamegoldlog'), name: 'gamegoldlog', meta: { title: 'gamegoldlog', mcode: 'E0401' } },
      { path: 'transfermoneylog', component: _import('transmgr/transfermoneylog'), name: 'transfermoneylog', meta: { title: 'transfermoneylog', mcode: 'E0501' } },
      { path: 'dailylog', component: _import('transmgr/dailylog'), name: 'dailylog', meta: { title: 'dailylog', mcode: 'E0601' } }
    ]
  },
  {
    path: '/robot',
    component: Layout,
    redirect: 'noredirect',
    name: 'robotsys',
    meta: {
      title: 'robotsys',
      icon: 'star',
      mcode: 'F',
      hidden: true
    },
    children: [
      // { path: 'robotadd', component: _import('robot/robotadd'), name: 'addrobot', meta: { title: 'addrobot' } },
      { path: 'robotcfg', component: _import('robot/robotcfg'), name: 'robotconfig', meta: { title: 'robotconfig', icon: 'star', mcode: 'F0101' } },
    ]
  },

  {
    path: '/config',
    component: Layout,
    redirect: 'noredirect',
    name: 'config',
    meta: {
      title: 'config',
      icon: 'setting',
      mcode: 'G',
      hidden: true
    },
    children: [
      { path: 'channel', component: _import('config/channel'), name: 'channelConfig', meta: { title: 'channelConfig', icon: 'setting', mcode: 'G0101' } },
    ]
  },
  {
    path: '/admin',
    component: Layout,
    redirect: 'noredirect',
    name: 'config',
    meta: {
      title: 'admin',
      icon: 'admin',
      mcode: 'H',
      hidden: true,
    },
    children: [
      { path: 'list', component: _import('admin/admin'), name: 'adminMgr', meta: { title: 'adminMgr', icon: 'admin-manage', mcode: 'H0101' } },
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
