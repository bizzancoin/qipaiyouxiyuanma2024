import {
  loginByUsername,
  logout,
  getUserInfo
} from '@/api/login';
import {
  setRole,
  removeRole
} from '@/utils/auth';

const user = {
  state: {
    nickname: '', // 昵称
    avatar: '', // 头像
    permission: [], // 权限列表
    role: 0, // 角色
    setting: { // 设置？
      articlePlatform: []
    }
  },

  mutations: {
    SET_PERMISSION: (state, permission) => {
      state.permission = permission;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_ROLE: (state, role) => {
      state.role = role;
    },
    SET_NICKNAME: (state, nickname) => {
      state.nickname = nickname;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(res => {
          console.log("登录成功",res);
          const data = res.map.admin;
          // commit('SET_PERMISSION', data.permission);
          // commit('SET_NICKNAME', data.nickname);
          // commit('SET_AVATAR', data.avatar);
          commit('SET_ROLE', data.role);
          setRole(data.role);
          resolve(res);
        }).catch(error => {
          reject(error);
        })
      })
    },

    // 获取用户信息
    GetUserInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          const data = res.map.admin;
          data.permission = JSON.parse(data.permission);
          commit('SET_PERMISSION', data.permission);
          commit('SET_NICKNAME', data.nickname);
          commit('SET_AVATAR', data.avatar);
          commit('SET_ROLE', data.role);
          resolve(res);
        }).catch(error => {
          reject(error);
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_PERMISSION', []);
          removeRole();
          resolve();
        }).catch(error => {
          reject(error);
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_PERMISSION', []);
        removeRole();
        resolve();
      })
    },

    // 动态修改权限
    ChangeRole({
      commit
    }) {
      return new Promise(resolve => {
        setRole(1);
        commit('SET_PERMISSION', ['M02']);
        commit('SET_NICKNAME', 'test_editor');
        commit('SET_AVATAR', '')
        commit('SET_ROLE', 1);
        resolve();
      })
    }
  }
}

export default user
