<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log v-if="errorLogs.length>0" class="errLog-container right-menu-item" :logsList="errorLogs"></error-log>

      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <el-dropdown trigger="click" class='international' @command="handleSetLanguage">
        <div>
          <svg-icon class-name='right-menu-item international-icon' icon-class="language" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh" :disabled="language==='zh'">中文</el-dropdown-item>
          <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-tooltip effect="dark" content="换肤" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="default_avatar">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="handleModifyPwd" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
         <!--新增界面-->
		<el-dialog title="修改密码" :visible.sync="addFormVisible" >
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="旧密码" prop="oldPassword">
					<el-input placeholder="输入旧密码" type="password" v-model="addForm.oldPassword" auto-complete="off"></el-input>
				</el-form-item>
	    <el-form-item label="新密码" prop="newPassword">
					<el-input placeholder="新密码" type="password" v-model="addForm.newPassword" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="handleModify" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ThemePicker from '@/components/ThemePicker'
import Screenfull from '@/components/Screenfull'
import ErrorLog from '@/components/ErrorLog'
import { modifyPwd } from "@/api/login";

import default_avatar from '@/assets/avatar/default_avatar.gif'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ThemePicker,
    ErrorLog,
    Screenfull
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'nickname',
      'avatar',
      'language',
      'errorLogs'
    ])
  },
  data() {
    return {
      default_avatar,
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        oldPassword: [{ required: true, min:6, max:32, message: "请输入合法旧密码[6-32]", trigger: "blur" }],       
        newPassword: [{ required: true, min:6, max:32, message: "请输入合法新密码[6-32]", trigger: "blur" }],       
      },
      //新增界面数据
      addForm: {
        oldPassword: "",
        newPassword: "",
      }
    };
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('setLanguage', lang)
      this.$message({
        message: 'switch language success',
        type: 'success'
      })
    },
     //显示修改密码界面
    handleModifyPwd: function() {
      this.addFormVisible = true;
      this.addForm = {
        oldPassword: "",
        newPassword: "",
      };
    },
    handleModify: function(index, row) {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;

            let para = {
              oldPassword: this.addForm.oldPassword,
              newPassword: this.addForm.newPassword
            };
            modifyPwd(para)
              .then(res => {
                this.addLoading = false;
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                
                this.$store.dispatch("FedLogOut").then(() => {
                  location.reload(); // 为了重新实例化vue-router对象 避免bug
                });
              })
              .catch(() => {
                this.addLoading = false;
              });
          });
        }
      });
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
      .international-icon{
        font-size: 20px;
        cursor: pointer;
        vertical-align: -5px;
      }
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
