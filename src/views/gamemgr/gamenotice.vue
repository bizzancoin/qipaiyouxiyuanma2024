<template>
  <div class="app-container calendar-list-container">
        <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm" class="number-hide" style="width:50%">
            <el-form-item label="类型" prop="type">
                <el-checkbox-group v-model="addForm.type">
                    <el-checkbox label="1" name="type">跑马灯</el-checkbox>
                    <!-- <el-checkbox label="2" name="type">系统公告</el-checkbox> -->
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="字体颜色">
                <el-radio-group v-model="addForm.color">
                    <el-radio label="white">白色</el-radio>
                    <el-radio label="yellow">黄色</el-radio>
                    <el-radio label="red">红色</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <el-input type="textarea" v-model="addForm.content" :rows="5"></el-input>
            </el-form-item>
            <el-form-item label="次数" prop="count">
                <el-input type="number" placeholder="次数" v-model.number="addForm.count" auto-complete="off" min="0" max="100" style="width:100px"></el-input>&nbsp;次
            </el-form-item>

            <el-form-item label="时间间隔" prop="intervalTime">
                <el-input type="number" placeholder="时间间隔" v-model.number="addForm.intervalTime" auto-complete="off" min="0" max="100" style="width:100px"></el-input>&nbsp;秒
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSend" v-if="hasPermission('A0302')" >直接发送</el-button>
            </el-form-item>
             <el-form-item label="时间" prop="times">
                <el-date-picker v-model="addForm.times" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleSubmit" v-if="hasPermission('A0303')">保存</el-button>
                <el-button  @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>

    <el-table ref="noticeTable" :key='tableKey' :data="noticeList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="id" label="ID" width="80">
        </el-table-column>
        <el-table-column label="跑马灯" width="80">
            <template slot-scope="scope">
                <span v-show="scope.row.isMarquee == 1">√</span>
            </template>
        </el-table-column>
        <el-table-column label="系统公告" width="100">
            <template slot-scope="scope">
                <span v-show="scope.row.isNotice == 1">√</span>
            </template>
        </el-table-column>
         <el-table-column prop="times" label="次数"></el-table-column>
        <el-table-column label="开始时间" width="180">
            <template slot-scope="scope">
                <span>{{scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
            </template>
        </el-table-column>
        <el-table-column label="停止时间" width="180">
            <template slot-scope="scope">
                <span>{{scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
            </template>
        </el-table-column>
        <el-table-column label="时间间隔" width="100">
            <template slot-scope="scope">
                <span>{{scope.row.intervalTime}}秒</span>
            </template>
        </el-table-column>       
        <el-table-column prop="content" label="内容">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
            <el-button size="small" v-if="hasPermission('A0303')" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="error" size="small" v-if="hasPermission('A0304')" @click="handleDelete(scope.row)">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getNoticeList,sendNotice,addNotice,delNotice } from "@/api/notice";
import { parseTime } from "@/utils";
import { hasPermission } from '@/utils/auth' // 验权

export default {
  name: "noticeTable",
  data() {
    var checkCount = (rule, value, callback) => {
        if (!value&&value!=0) {
          return callback(new Error('次数不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入整数'));
          } else {
            if (value < 1 || value >10) {
              callback(new Error('只能1到10次'));
            } else {
              callback();
            }
          }
        }, 200);
      };
    return {
        tableKey: 0,
        noticeList: null,
        listLoading: false,
        addFormVisible:false,
        addLoading: false,
        addFormRules: {
            type: [{ required: true, type:"array", message: "请选择一个类型", trigger: "change" }],
            content: [{ required: true, message: "请输入内容", trigger: "blur" },{ min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }],
            times: [{ required: true, type:"array", message: "请选择时间区间", trigger: "change" }],
            count: [{ validator: checkCount, trigger: 'blur' }],
            intervalTime: [{ required: true, type:"number", min: 1, message: "请输入时间间隔,大于1", trigger: "change" }],
        },
        addForm: {
            id:null,
            isMarquee:true,
            isNotice:false,
            color:'white',
            content:'',
            count:1,
            type:['1'],
            times: [new Date(),new Date()],
            intervalTime:20
        }
    };
  },
  created() {
    this.getNoticeList();
  },
  methods: {
    hasPermission : hasPermission,
    getNoticeList() {
      this.listLoading = true;
      getNoticeList()
        .then(res => {
            this.noticeList = res.map.list;
            this.listLoading = false;
        })
        .catch(() => {
            this.listLoading = false;
        });
    },
    handleEdit(row){
        this.addFormVisible = true;
        this.addForm.id = row.id;
        this.addForm.type = [];
        if(row.isMarquee==1){
            this.addForm.type.push('1');
        }
        if(row.isNotice==1){
            this.addForm.type.push('2');
        }
        this.addForm.content = row.content;
        this.addForm.count = row.times;
        this.addForm.times = [new Date(row.startTime*1),new Date(row.endTime*1)];
        this.addForm.intervalTime = row.intervalTime;
    },
    handleSend(){
        if (this.addForm.type.length == 0) {
            this.$message({ message: "请选择通知类型",type: "error"});
            return;
        }
        if (this.addForm.content.length<2 || this.addForm.content.length > 100) {
            this.$message({ message: "请输入内容[2-100]",type: "error"});
            return;
        }
        if (!Number.isInteger(this.addForm.count)) {
            this.$message({ message: "请输入整数的次数",type: "error"});
            return;
        } 
        if (this.addForm.count<1 || this.addForm.count>10 ) {
            this.$message({ message: "次数只能1到10次",type: "error"});
            return;
        }
        if (this.addForm.intervalTime<1) {
            this.$message({ message: "间隔时间不能小于1秒",type: "error"});
            return;
        }
        this.$confirm("是否马上发送消息，消息将不会保存？", "提示", {})
        .then(() => {
            this.addLoading = true;
            let para = {
                isMarquee:this.addForm.type.indexOf('1')>-1?true:false,
                isNotice:this.addForm.type.indexOf('2')>-1?true:false,
                content:this.addForm.content,
                times:this.addForm.count,
                color:this.addForm.color,
                intervalTime : this.addForm.intervalTime
            };
            sendNotice(para).then(res=>{
                this.addLoading = false;
                this.$message({message: "发送成功",type: "success"});
                this.addForm.id = null;
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
            }).catch(() => {
                this.$message({message: "发送失败",type: "error"});
                this.addLoading = false;
              });
        })
        .catch(() => {});;
    },
    handleSubmit(){
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            let para = {
                id:this.addForm.id,
                isMarquee:this.addForm.type.indexOf('1')>-1?true:false,
                isNotice:this.addForm.type.indexOf('2')>-1?true:false,
                content:this.addForm.content,
                startTime:this.addForm.times[0].getTime(),
                endTime: this.addForm.times[1].getTime(),
                intervalTime:this.addForm.intervalTime,
                times:this.addForm.count,
                color:this.addForm.color
            };

            addNotice(para)
              .then(res => {
                this.addLoading = false;
                this.$message({message: "保存成功",type: "success"});
                this.addForm.id = null;
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getNoticeList();
              })
              .catch(() => {
                this.$message({message: "保存失败",type: "error"});
                this.addLoading = false;
              });
          });
        }
      });
    },
    handleReset(){
        this.addForm.id = null;
        this.$refs["addForm"].resetFields();
    },
    handleDelete(row){
      this.$confirm("确认删除该通告吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = {id:row.id};
          delNotice(para).then(res => {
            this.listLoading = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.handleReset();
            this.getNoticeList();
          });
        })
        .catch(() => {
          this.listLoading = false;
        });
        }
  }
};
</script>