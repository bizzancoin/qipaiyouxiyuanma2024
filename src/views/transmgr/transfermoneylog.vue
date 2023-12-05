<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      渠道：<el-select style="width:120px" placeholder="请选择渠道" v-model="pageQuery.channelId" clearable >
        <el-option v-for="item in channels"
          :key="item.channelId"
          :label="item.channelRemark"
          :value="item.channelId"/>
          </el-select>
      订单号：  <el-input style="width:240px"  v-model="pageQuery.orderNo" placeholder="订单号" clearable/>
      转账类型：<el-select style="width:120px" placeholder="请选择" v-model="pageQuery.flag" clearable >
        <el-option v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
        用户ID：  <el-input style="width:180px" :maxlength="10" v-model="pageQuery.playerId" placeholder="用户ID" clearable/>
        <!-- 用户靓号：<el-input style="width:180px" :maxlength="10" v-model="pageQuery.superId" placeholder="用户靓号" clearable/> -->
        时间：    <el-date-picker v-model="time" align="right" type="month" placeholder="选择日期" :picker-options="pickerOptions1" :clearable="false">
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
      <el-table-column align="center" prop="orderNo" label="订单号" width="200" />
      <el-table-column align="center" prop="playerId" label="用户ID" width="100" />
      <!-- <el-table-column align="center" prop="superId" label="用户靓号" width="100" /> -->
      <el-table-column align="center" prop="playerName" label="用户昵称" width="200" />
      <!-- <el-table-column align="center" prop="level" label="用户等级" width="100" /> -->
      <el-table-column align="center" prop="price" label="转账金币" width="120" >
        <template slot-scope="scope">
          <span >{{scope.row.price | goldToMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="beforeSafeGold" label="转账前游戏金币" width="200" >
        <template slot-scope="scope" v-if="!scope.row.isTotal">
          <span >{{scope.row.beforeSafeGold | goldToMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="afterSafeGold" label="转账后游戏金币" width="200" >
        <template slot-scope="scope" v-if="!scope.row.isTotal">
          <span >{{scope.row.afterSafeGold | goldToMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="flag" label="类型" width="200" >
        <template slot-scope="scope">
          <span v-if="scope.row.flag == 0">转出</span>
          <span v-if="scope.row.flag == 1">转入</span>
        </template>
      </el-table-column>
      
      <!-- <el-table-column align="center" prop="actionId" label="动作id" width="160" /> -->
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
import { findUserTransferMoneyLog} from "@/api/trans";
import { getChannel } from "@/api/common";
import { parseTime } from "@/utils";

export default {
  name: "tranferMoneyLogTable",
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      totalSize: 0,
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }]
        },
        time: new Date(),
      channelMap: {},
      channels: [],
      pageQuery: {
        page: 1,
        pageSize: 10,
        flag: undefined,
        playerId: undefined,
        superId: undefined,
        time: undefined,
        orderNo: undefined
      },
      typeOptions: [

        {
          value: "0",
          label: "转出"
        },
        {
          value: "1",
          label: "转入"
        }
      ],
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
             this.channelMap = {};
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
      if (row.isTotal && columnIndex === 4) {
        return [1, 5];
      } else if (row.isTotal && columnIndex === 5 ) {
        return [1, 1];
      } else if(row.isTotal){
        return [0, 0];
      }
    },
    findList() {
      this.listLoading = true;
      this.pageQuery.time = this.time.getTime();
      findUserTransferMoneyLog(this.pageQuery)
        .then(res => {
          this.list = res.map.list;

          if (!this.list) {
            this.list = [];
          }
          let curPageStatistics = {
             price: 0,
          }
          this.list.forEach(element =>{
               curPageStatistics.price += element.price;  
          })
          // 本页合计
          this.list.push(Object.assign({
            isTotal: true,
            playerName: "本页合计",
            price: 0
          },curPageStatistics));
          // 范围合计
          this.list.push(Object.assign({
            isTotal: true,
            playerName: "范围合计",
            price: 0
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
    },
  }
};
</script>