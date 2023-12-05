import {
  body2Obj
} from '@/utils'

const userMap = {
  admin: {
    code: 200,
    map: {
      admin: {
        permission: '["M01", "M02"]',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        nickname: 'Super Admin',
        role: 2
      }
    },
    msg: '111'
  },
  editor: {
    admin: {
      code: 200,
      map: {
        permission: '["M02"]',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        nickname: 'Normal Editor',
        role: 1
      },
      msg: '111'
    }
  }
}

export default {
  loginByUsername: config => {
    const {
      username
    } = body2Obj(config.body);
    return userMap[username];
  },
  getUserInfo: () => {
    // const { token } = param2Obj(config.url)
    if (userMap["admin"]) {
      return userMap["admin"];
    } else {
      return Promise.reject('error');
    }
  },
  logout: () => {
    return {
      code: 200,
      msg: '',
      map: {}
    }
  }
}
