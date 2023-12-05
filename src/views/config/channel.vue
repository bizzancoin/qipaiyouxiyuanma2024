<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
       渠道ID：  <el-input style="width:180px" :maxlength="10" v-model="pageQuery.channelId" placeholder="渠道ID" clearable/>
       渠道名称：  <el-input style="width:180px" :maxlength="20" v-model="pageQuery.channelName" placeholder="渠道名" clearable/>
      <el-button  type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-if="hasPermission('G0102')"  style="margin-left: 10px;" @click="handleAdd" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column type="selection" width="55">
	 </el-table-column>
   	  <el-table-column type="index" width="60">
	  </el-table-column>
       <el-table-column width="200px" label="渠道ID" prop="channelId"> </el-table-column>
      <el-table-column width="200px" label="渠道名称" prop="channelName">
      </el-table-column>
      <el-table-column width="" label="渠道备注" prop="channelRemark">
      </el-table-column>
      <el-table-column width="200px" prop="channelDesKey" label="3DesKey">        
      </el-table-column>
    
      <el-table-column width="200px" prop="channelMd5Key" label="Md5Key">    
      </el-table-column>

       <el-table-column fixed="right" label="操作"  width="300" >
            <template slot-scope="scope" v-if="scope.row.channelId != '111111'">
                <el-button v-if="hasPermission('G0102')" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
                <el-button v-if="hasPermission('G0103')" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
     
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="pageQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--新增界面-->
		<el-dialog :title="addFormTitle" :visible.sync="addFormVisible" @close="handleClose">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" >
				<el-form-item label="渠道ID" prop="channelId">
					<el-input placeholder="渠道ID" :maxlength="10" v-model="addForm.channelId" auto-complete="off" :disabled="edit"></el-input>
				</el-form-item>
        <el-form-item label="渠道名称" prop="channelName">
					<el-input placeholder="渠道名称" :maxlength="20" v-model="addForm.channelName" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="渠道备注" prop="channelRemark">
						<el-input placeholder="渠道备注" :maxlength="45" v-model="addForm.channelRemark" auto-complete="off"></el-input>
				</el-form-item>

      	<el-form-item label="3DesKey" prop="channelDesKey">
						<el-input placeholder="3DesKey" :maxlength="24" v-model="addForm.channelDesKey" auto-complete="off"></el-input>
				</el-form-item>

        <el-form-item label="Md5Key" prop="channelMd5Key">
						<el-input placeholder="Md5Key" :maxlength="8" v-model="addForm.channelMd5Key" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handleClose">取消</el-button>
				<el-button type="primary" @click.native="handlePublish" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getList, saveChannel, deleteChannel } from "@/api/channel";
import waves from "@/directive/waves"; // 水波纹指令
import { parseTime, deepClone } from "@/utils";
import { hasPermission } from '@/utils/auth' // 验权

export default {
  name: "complexTable",
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      pageQuery: {
        page: 1,
        pageSize: 10,
        channelId: undefined,
        channelName: undefined
      },
      channels: [],

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormTitle: '',
      edit: false,
      addFormRules: {
        channelId: [{ required: true, message: "请输入渠道ID[2,10]", min:2,max:10, trigger: "blur" }],
        channelName: [
          {
            required: true,
            message: "请输入渠道名称[2,20]",
             min:2,max:20,
            trigger: "blur"
          }
        ],
        channelRemark: [{ required: true, message: "请输入渠道备注[1-45]", min:1,max:45,trigger: "blur" }],
        channelMd5Key: [{ required: true, message: "请输入渠道Md5 Key[6-8]", min:6,max:8,trigger: "blur" }],
        channelDesKey: [
          { required: true, message: "请输入渠道3Des Key[长度必须等于24]", len: 24,trigger: "blur" }
        ]
      },
      //新增界面数据
      addForm: {
        channelId: null,
        channelName: "",
        channelRemark: "",
        channelDesKey: "",
        channelMd5Key: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    hasPermission : hasPermission,
    getList() {
      this.listLoading = true;
      getList(this.pageQuery)
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
      this.pageQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.pageQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageQuery.page = val;
      this.getList();
    },
    //显示新增界面
    handleAdd: function() {
      this.edit = false;
      this.addFormVisible = true;
      this.addFormTitle = "添加";
      this.addForm = {
        channelId: null,
        channelName: "",
        channelRemark: "",
        channelDesKey: "",
        channelMd5Key: ""
      };
    },
    handleEdit(row){
      this.edit = true;
      this.addFormVisible = true;
      this.addFormTitle = "编辑";
      this.addForm = deepClone(row);
    },
    handleClose(){
      this.addFormVisible = false;
      this.$refs["addForm"].resetFields();
    },
    handlePublish: function(index, row) {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = deepClone(this.addForm);
            saveChannel(para)
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
      this.$confirm("确认删除该渠道吗?删除不能恢复！", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = row.channelId;
          deleteChannel(para).then(res => {
            this.listLoading = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getList();
          }).catch(() => {
          this.listLoading = false;
          });;
        })
        .catch(() => {
          this.listLoading = false;
        });
    }
  }
};
</script>
