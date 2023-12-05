<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select clearable class="filter-item" v-model="listQuery.uidtype" placeholder="邮件类型" @change="handleUitypeChange">
        <el-option v-for="item in objectOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      	<el-select v-if="listQuery.uidtype == 1" placeholder="输入玩家id或昵称" v-model="listQuery.playerId" filterable remote :remote-method="searchUser" :loading="searchUserLoading">
						<el-option v-for="item in users" :key="item.playerId" :label="item.playerName+'('+item.playerSuperId+')'" :value="item.playerId">
						</el-option>
				</el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleAdd" type="primary" icon="el-icon-edit">发送邮件</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column type="selection" width="55">
			</el-table-column>
   	  <el-table-column type="index" width="60">
			</el-table-column>
       <el-table-column width="50px" label="id" prop="id"> </el-table-column>
      <el-table-column width="200px" label="标题" prop="title">
      </el-table-column>
      <el-table-column width="200px" label="对象" prop="playerName">
          <template slot-scope="scope">
          <span>{{scope.row.playerName}}({{scope.row.playerSuperId}})</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
    
      <el-table-column min-width="300px" align="center" label="内容" prop="content">    
      </el-table-column>
     
      <el-table-column align="center" label="操作" width="150px" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" >
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题" prop="title">
					<el-input placeholder="输入标题" v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮件类型" prop="uidtype">
					<el-radio-group v-model="addForm.uidtype">
						<el-radio class="radio" :label="0">公共邮件</el-radio>
						<el-radio class="radio" :label="1">单人邮件</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="玩家" prop="playerId" v-if="addForm.uidtype == 1">
					<el-select placeholder="输入玩家id或昵称" v-model="addForm.playerId" filterable remote :remote-method="searchUser" :loading="searchUserLoading">
						<el-option v-for="item in users" :key="item.playerId" :label="item.playerName+'('+item.playerSuperId+')'" :value="item.playerId">
						</el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="赠送钻石" prop="isSend">
					<el-checkbox v-model="addForm.isSend">赠送钻石</el-checkbox>
				</el-form-item>
				<el-form-item label="钻石数量" prop="rmb" v-if="addForm.isSend">
					<el-input-number  v-model.number="addForm.rmb" :min="1"></el-input-number>
				</el-form-item> -->
				<!-- <el-form-item label="状态" prop="status">
					<el-radio-group v-model="addForm.status">
						<el-radio class="radio" :label="1">发布</el-radio>
						<el-radio class="radio" :label="0">未发布</el-radio>
					</el-radio-group>
				</el-form-item> -->
				<el-form-item label="内容" prop="content">
					<el-input type="textarea" v-model="addForm.content"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="handlePublish" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getMailList, addMail, deleteMail } from "@/api/mail";
import { playerSearch } from "@/api/remoteSearch";
import waves from "@/directive/waves"; // 水波纹指令
import { parseTime } from "@/utils";

export default {
  name: "complexTable",
  directives: {
    waves
  },
  data() {
    var checkRmbForAdd = (rule, value, callback) => {
      if (this.addForm.isSend) {
        if (!Number.isInteger(value) || value < 1) {
          callback(new Error("钻石必须是整数，并且大于0"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var checkPlayerIdForAdd = (rule, value, callback) => {
      if (this.addForm.uidtype == 1 && value) {
        callback();
      } else {
        callback(new Error("请选择玩家"));
      }
    };
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        uidtype: undefined,
        playerId: undefined
      },
      objectOptions: [
        {
          label: "全部邮件",
          value: ""
        },
        {
          label: "公共邮件",
          value: 0
        },
        {
          label: "个人邮件",
          value: 1
        }
      ],
      users: [],
      searchUserLoading: false,

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        uidtype: [
          {
            required: true,
            type: "integer",
            message: "请选择邮件类型",
            trigger: "blur"
          }
        ],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        // status: [
        // 	{ required: true, type: 'integer', message: '请选择状态', trigger: 'change' }
        // ],
        // gold: [{ validator: checkRmbForAdd, type: "integer", trigger: "blur" }],
        playerId: [
          { validator: checkPlayerIdForAdd, type: "integer", trigger: "change" }
        ]
      },
      //新增界面数据
      addForm: {
        playerId: null,
        gold: 0,
        title: "",
        isRead: 0,
        isRecGold: 0,
        content: "",
        uidtype: 0
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleUitypeChange() {
      this.listQuery.playerId = undefined;
    },
    getList() {
      this.listLoading = true;
      getMailList(this.listQuery)
        .then(res => {
          this.list = res.map.list;
          this.total = res.map.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        playerId: null,
        gold: 0,
        title: "",
        isRead: 0,
        isRecGold: 0,
        content: "",
        uidtype: 0
      };
    },
    handlePublish: function(index, row) {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = {
              title: this.addForm.title,
              content: this.addForm.content,
              playerId: this.addForm.playerId
              // rmb: this.addForm.rmb
            };
            if (this.addForm.uidtype == 0) {
              para.playerId = 0;
            }
            // if (this.addForm.isSend == false) {
            // 	para.rmb = 0;
            // }

            addMail(para)
              .then(res => {
                this.addLoading = false;
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getList();
              })
              .catch(() => {
                this.addLoading = false;
              });
          });
        }
      });
    },
    handleDelete(row) {
      this.$confirm("确认删除该邮件吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = [row.id];
          deleteMail(para).then(res => {
            this.listLoading = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getList();
          });
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    searchUser: function(query) {
      if (query !== "") {
        this.searchUserLoading = true;
        playerSearch(query)
          .then(res => {
            this.searchUserLoading = false;
            this.users = res.map.list;
          })
          .catch(() => {
            this.searchUserLoading = false;
            this.users = [];
          });
      } else {
        this.users = [];
      }
    }
  }
};
</script>
