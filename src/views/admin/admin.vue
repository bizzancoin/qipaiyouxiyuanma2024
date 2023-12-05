<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      帐号：  <el-input style="width:180px" placeholder="帐号" v-model="pageQuery.username" clearable/>
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button v-if="hasPermission('H0102')" type="primary" plain @click="handleAdd">新增</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" 
      @selection-change="handleSelectChange" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" prop="id" label="ID" width="120" />
      <el-table-column align="center" prop="username" label="帐号" width="200" />
      <el-table-column align="center" prop="nickname" label="昵称" width="200" >
      </el-table-column>
      <el-table-column align="center" prop="status" label="玩家状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">冻结</span>
          <span v-if="scope.row.status === 1">解禁</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="role" label="玩家状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.role === 1">普通管理员</span>
          <span v-if="scope.row.role === 2">超级管理员</span>
        </template>
      </el-table-column>
       <el-table-column label="操作" >
        <template slot-scope="scope" v-if="scope.row.role === 1">
            <el-button v-if="scope.row.status === 0 && hasPermission('H0103')" size="small" type="success"  @click="handleStatus(scope.row, 1)">解禁</el-button>
            <el-button v-if="scope.row.status === 1 && hasPermission('H0103')" size="small" type="danger"  @click="handleStatus(scope.row, 0)">冻结</el-button>
            <el-button v-if="hasPermission('H0102')"  size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="hasPermission('H0104')" size="small" type="danger" @click="handleResetPassword(scope.row)">重置密码</el-button>
            <el-button v-if="hasPermission('H0105')" size="small" type="primary" @click="handleSetPermission(scope.row)">权限配置</el-button>
        </template>
        </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="pageQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>

    <!--新增界面-->
		<el-dialog :title="addFormTitle" :visible.sync="addFormVisible" @close="handleAddClose">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" >
				<el-form-item label="帐号" prop="username">
					<el-input placeholder="帐号" :maxlength="20" v-model="addForm.username" auto-complete="off" ></el-input>
				</el-form-item>
        <el-form-item label="密码" prop="password">
					<el-input placeholder="密码" :maxlength="20" type="password" v-model="addForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
						<el-input placeholder="昵称" :maxlength="20" v-model="addForm.nickname" auto-complete="off"></el-input>
				</el-form-item>      
			</el-form>
		<div slot="footer" class="dialog-footer">
				<el-button @click.native="handleAddClose">取消</el-button>
				<el-button type="primary" @click.native="handleAddForm" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

    <!--编辑界面-->
		<el-dialog :title="editFormTitle" :visible.sync="editFormVisible" @close="handleEditClose">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" >
				<el-form-item label="昵称" prop="nickname">
						<el-input placeholder="昵称" :maxlength="20" v-model="editForm.nickname" auto-complete="off"></el-input>
				</el-form-item>      
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handleEditClose">取消</el-button>
				<el-button type="primary" @click.native="handleEditForm" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

    <!--重置界面-->
		<el-dialog :title="resetFormTitle" :visible.sync="resetFormVisible" @close="handleResetClose">
			<el-form :model="resetForm" label-width="80px" :rules="resetFormRules" ref="resetForm" >
				<el-form-item label="密码" prop="password">
					<el-input placeholder="密码" :maxlength="20" type="password" v-model="resetForm.password" auto-complete="off"></el-input>
				</el-form-item>    
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handleResetClose">取消</el-button>
				<el-button type="primary" @click.native="handleResetForm" :loading="resetLoading">提交</el-button>
			</div>
		</el-dialog>

    <!--权限设置-->
    <el-dialog :title="permissionFormTitle" width="400px" :visible.sync="permissionFormVisible" @close="handlePermissionClose">
      <el-tree :data="permissions"
  show-checkbox
  node-key="id"
  :default-checked-keys="permissionForm.userPermission"
   ref="tree"
  :props="defaultProps">
</el-tree>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handlePermissionClose">取消</el-button>
				<el-button type="primary" @click.native="handlePermissionForm" :loading="permissionLoading">提交</el-button>
			</div>
		</el-dialog>
  </div>
</template>


<script>
import axios from "axios";
import {
  getList,
  add,
  update,
  resetPassword,
  changeStatus,
  getPermissions,
  updatePermission
} from "@/api/admin";
import { parseTime, deepClone } from "@/utils";
import { hasPermission } from '@/utils/auth' // 验权

export default {
  name: "adminTable",
  data() {
    return {
      permissions: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      tableKey: "adminTable",
      list: null,
      listLoading: true,
      totalSize: 0,
      multipleSelection: [],
      pageQuery: {
        page: 1,
        pageSize: 10,
        username: ""
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormTitle: "",
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入帐号[4,20]",
            min: 4,
            max: 20,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码[6,20]",
            min: 6,
            max: 20,
            trigger: "blur"
          }
        ],
        nickname: [
          {
            required: true,
            message: "请输入昵称[4-20]",
            min: 2,
            max: 20,
            trigger: "blur"
          }
        ]
      },
      //新增界面数据
      addForm: {
        username: "",
        password: "",
        nickname: ""
      },

      editFormVisible: false, //edit界面是否显示
      editLoading: false,
      editFormTitle: "",
      editFormRules: {
        nickname: [
          {
            required: true,
            message: "请输入昵称[4-20]",
            min: 2,
            max: 20,
            trigger: "blur"
          }
        ]
      },
      //edit界面数据
      editForm: {
        id: null,
        nickname: ""
      },

      resetFormVisible: false, //reset界面是否显示
      resetLoading: false,
      resetFormTitle: "",
      resetFormRules: {
        nickname: [
          {
            required: true,
            message: "请输入昵称[4-20]",
            min: 4,
            max: 20,
            trigger: "blur"
          }
        ]
      },
      //reset界面数据
      resetForm: {
        id: null,
        password: ""
      },
      permissionForm: {
        id: null,
        userPermission: []
      },
      permissionFormVisible: false, //edit界面是否显示
      permissionLoading: false,
      permissionFormTitle: ""
    };
  },
  created() {
    this.findList();
    this.findPermissions();
  },
  methods: {
    hasPermission : hasPermission,
    // 监听穿梭框组件添加
    add(keys, nodes) {
      console.log(keys, nodes);
      console.log(this.toData);
    },
    // 监听穿梭框组件移除
    remove(keys, nodes) {
      console.log(keys, nodes);
      console.log(this.toData);
    },
    handleAddClose() {
      this.addFormVisible = false;
      this.$refs["addForm"].resetFields();
    },
    handleEditClose() {
      this.editFormVisible = false;
      this.$refs["editForm"].resetFields();
    },
    handleResetClose() {
      this.resetFormVisible = false;
      this.$refs["resetForm"].resetFields();
    },
    handlePermissionClose() {
      this.permissionFormVisible = false;
      this.$refs.tree.setCheckedKeys([]);
    },
    findPermissions() {
      getPermissions()
        .then(res => {
          this.permissions = res.map.list;
        })
        .catch(() => {
          this.permissions = [];
        });
    },
    findList() {
      this.listLoading = true;
      getList(this.pageQuery)
        .then(res => {
          this.list = res.map.list;
          this.totalSize = res.map.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    handleSizeChange(val) {
      this.pageQuery.pageSize = val;
      this.findList();
    },
    handleCurrentChange(val) {
      this.pageQuery.page = val;
      this.findList();
    },
    // 搜索
    handleSearch() {
      this.pageQuery.page = 1;
      this.findList();
    },
    // 复选框事件
    handleSelectChange(val) {
      if (val && val.length > 0) {
        this.multipleSelection = [];
        for (let i = 0; i < val.length; i++) {
          this.multipleSelection.push(val[i].playerId);
        }
      } else {
        this.multipleSelection = [];
      }
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addFormTitle = "添加";
      this.addForm = {
        id: null,
        username: "",
        password: "",
        nickname: ""
      };
    },
    handleEdit(row) {
      this.editFormVisible = true;
      this.editFormTitle = "编辑";
      this.editForm = deepClone(row);
    },
    handleResetPassword(row) {
      this.resetFormVisible = true;
      this.resetFormTitle = "重置密码";
      this.resetForm = {
        id: row.id
      };
    },
    handleSetPermission(row) {
      this.permissionFormVisible = true;
      this.permissionForm.userPermission = [];
      this.permissionForm = {
        adminId: row.id
      };
      this.$nextTick(() => {
        let leafPermission = deepClone(row.permission);
        if(leafPermission && leafPermission.length){
          leafPermission = leafPermission.filter(mcode => mcode.length > 4);
        }
        this.$refs.tree.setCheckedKeys(leafPermission);
         console.log(leafPermission,leafPermission.length);
      });

      this.permissionFormTitle = "权限配置";

     
    },
    handleAddForm: function(row) {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认添加管理员吗？", "提示", {})
            .then(() => {
              this.addLoading = true;
              //NProgress.start();
              let para = {
                username: this.addForm.username,
                password: this.addForm.password,
                nickname: this.addForm.nickname
              };
              add(para)
                .then(res => {
                  this.addLoading = false;
                  this.$message({
                    message: "添加成功",
                    type: "success"
                  });
                  this.$refs["addForm"].resetFields();
                  this.addFormVisible = false;
                  this.findList();
                })
                .catch(() => {
                  this.addLoading = false;
                });
            })
            .catch(() => {});
        }
      });
    },
    handleEditForm: function(row) {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认更新管理员吗？", "提示", {})
            .then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = {
                adminId: this.editForm.id,
                nickname: this.editForm.nickname
              };
              update(para)
                .then(res => {
                  this.editLoading = false;
                  this.$message({
                    message: "更新成功",
                    type: "success"
                  });
                  this.$refs["editForm"].resetFields();
                  this.editFormVisible = false;
                  this.findList();
                })
                .catch(() => {
                  this.editLoading = false;
                });
            })
            .catch(() => {});
        }
      });
    },
    handleStatus: function(row, status) {
      let notice = status == 1 ? "确认解禁？" : "确认锁定？";
      this.$confirm(notice, "提示", {})
        .then(() => {
          let para = {
            adminId: row.id,
            status: status
          };
          changeStatus(para)
            .then(res => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.findList();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    handleResetForm: function(row) {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.$confirm("确认重置密码？", "提示", {})
            .then(() => {
              this.resetLoading = true;
              //NProgress.start();
              let para = {
                adminId: this.resetForm.id,
                password: this.resetForm.password
              };
              resetPassword(para)
                .then(res => {
                  this.resetLoading = false;
                  this.$message({
                    message: "重置成功",
                    type: "success"
                  });
                  this.$refs["resetForm"].resetFields();
                  this.resetFormVisible = false;
                  this.findList();
                })
                .catch(() => {
                  this.resetLoading = false;
                });
            })
            .catch(() => {});
        }
      });
    },
    handlePermissionForm: function() {
      let selectedPermissions = [];
      selectedPermissions = selectedPermissions.concat(
        this.$refs.tree.getCheckedKeys()
      );
      selectedPermissions = selectedPermissions.concat(
        this.$refs.tree.getHalfCheckedKeys()
      );

      selectedPermissions.sort();

      console.log(selectedPermissions);
      if (selectedPermissions && selectedPermissions.length) {
        this.$confirm("确认修改权限？", "提示", {})
          .then(() => {
            let para = {
              adminId: this.permissionForm.adminId,
              userPermission: JSON.stringify(selectedPermissions)
            };
            updatePermission(para)
              .then(res => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.permissionFormVisible = false;
                this.findList();
              })
              .catch(() => {});
          })
          .catch(() => {});
      } else {
        this.$message({
          message: "至少选择一个权限",
          type: "info"
        });
      }
    }
  }
};
</script>