<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
       渠道：<el-select style="width:120px" placeholder="请选择渠道" v-model="pageQuery.channelId" clearable >
        <el-option v-for="item in channels"
          :key="item.channelId"
          :label="item.channelRemark"
          :value="item.channelId"/>
          </el-select>
        用户ID：  <el-input style="width:180px" :maxlength="10" v-model="pageQuery.playerId" placeholder="用户ID" clearable/>
        <!-- 用户靓号：<el-input style="width:180px" :maxlength="10" v-model="pageQuery.superId" placeholder="用户靓号" clearable/> -->
        时间：    <el-date-picker v-model="time" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions1" :clearable="false">
    </el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%" :span-method="arraySpanMethod">
      <el-table-column align="center" prop="id" label="编号" width="80" />

      <el-table-column align="center" prop="channelId" label="渠道ID" width="80" fixed>
        <template slot-scope="scope">
          <span >{{ getChannelName(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="playerId" label="用户ID" width="100" />
      <!-- <el-table-column align="center" prop="superId" label="用户靓号" width="100" /> -->
      <el-table-column align="center" prop="playerName" label="用户昵称" width="200" />
      <!-- <el-table-column align="center" prop="level" label="用户等级" width="100" /> -->

      <el-table-column align="center" prop="betting" label="下注金币" width="200" >
        <template slot-scope="scope">
          <span >{{scope.row.betting | goldToMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="bonus" label="中奖金币" width="200" >
        <template slot-scope="scope">
          <span >{{scope.row.bonus | goldToMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="profit" label="平台盈亏" width="200" >
        <template slot-scope="scope">
          <span >{{scope.row.profit | goldToMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="playerType" label="角色" width="160" >
          <template slot-scope="scope">
             <span v-if="scope.row.playerType == 1">闲家</span>
             <span v-if="scope.row.playerType == 2">庄家</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="reason" label="原因" width="200" />
      
      
      <el-table-column align="center" label="时间">
        <template slot-scope="scope">
            <span>{{scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="pageQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>


<script>
import { findUserGameGoldLog } from "@/api/trans";
import { getChannel } from "@/api/common";
import { parseTime } from "@/utils";

export default {
  name: "safegoldLogTable",
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      totalSize: 0,
      channelMap: {},
      channels: [],
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      time: new Date(),
      pageQuery: {
        page: 1,
        pageSize: 10,
        playerId: undefined,
        superId: undefined,
        time: undefined,
        channelId: undefined
      }
    };
  },
  created() {
    this.findChannelList();
  },
  methods: {
    getChannelName(row){
       if (row.isTotal) {
        return "";
       }
       let channelId = row.channelId;
       let remark = '未知渠道';
       if(channelId){
        let channel = this.channelMap[channelId];
        if(channel && channel.channelRemark){
            remark = channel.channelRemark;
        }
       }
       return remark;
    },
    findChannelList(){
       getChannel()
         .then(res =>{
             this.channels = res.map.list;
            //  this.channelMap = {};
             if(this.channels && this.channels.length){
                this.channels.forEach(element => {
                  this.channelMap[element.channelId] = element;
                });
             }
             this.findList();
         })
         .catch(()=>{
             this.findList();
         })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.isTotal && columnIndex === 3) {
        return [1, 4];
      } else if (row.isTotal && (columnIndex === 4 || columnIndex === 5 || columnIndex === 6)) {
        return [1, 1];
      } else if(row.isTotal){
        return [0, 0];
      }
    },
    findList() {
      this.listLoading = true;
      this.pageQuery.time = this.time.getTime();
      findUserGameGoldLog(this.pageQuery)
        .then(res => {
          this.list = res.map.list;
          if (!this.list) {
            this.list = [];
          }
          let curPageStatistics = {
             betting: 0,
             bonus: 0,
             profit: 0
          }
          this.list.forEach(element =>{
               curPageStatistics.betting += element.betting;  
               curPageStatistics.bonus += element.bonus;
               curPageStatistics.profit += element.profit;
          })
          // 本页合计
          this.list.push(Object.assign({
            isTotal: true,
            playerName: "本页合计",
            betting: 0,
            bonus: 0,
            profit: 0
          },curPageStatistics));
          // 范围合计
          this.list.push(Object.assign({
            isTotal: true,
            playerName: "范围合计",
            betting: 0,
            bonus: 0,
            profit: 0
          },res.map.statistics));

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
    }
  }
};
</script>