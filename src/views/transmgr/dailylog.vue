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
        时间：    <el-date-picker v-model="timeRange" type="daterange" range-separator="至" 
        start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" :clearable="false"></el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%"  >
      <el-table-column align="center" prop="time" label="统计日期" width="100" fixed/>
      <el-table-column align="center" prop="allBetting" label="总投注" width="200">
         <template slot-scope="scope">
          <span >{{scope.row.allBetting | goldToMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="allBonus" label="总中奖" width="200">
         <template slot-scope="scope">
          <span >{{scope.row.allBonus | goldToMoney}}</span>
        </template>
      </el-table-column>
       <el-table-column align="center" prop="allSendGold" label="总赠送金币" width="200">
      <template slot-scope="scope">
          <span >{{scope.row.allSendGold | goldToMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="allTransferInGold" label="总转入" width="200">
         <template slot-scope="scope">
          <span >{{scope.row.allTransferInGold | goldToMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="allTransferOutGold" label="总转出" width="200">
         <template slot-scope="scope">
          <span >{{scope.row.allTransferOutGold | goldToMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="allProfit" label="平台盈亏" width="200">
         <template slot-scope="scope">
          <span >{{scope.row.allProfit | goldToMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="allInoutProfit" label="收支盈亏" width="200">
         <template slot-scope="scope">
          <span >{{scope.row.allInoutProfit | goldToMoney}}</span>
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
import axios from "axios";
import qs from "qs";
import { findDailyList } from "@/api/trans";
import { parseTime } from "@/utils";
import { getChannel } from "@/api/common";

export default {
  name: "giftTable",
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      totalSize: 0,
      timeRange: [new Date(), new Date()],
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      channelMap: {},
      channels: [],
      pageQuery: {
        page: 1,
        pageSize: 10,
        playerId: undefined,
        superId: undefined,
        startTime: undefined,
        endTime: undefined
      }
    };
  },
  created() {
    let start = new Date();
    let end = new Date();
    end.setHours(0);
    end.setMinutes(0);
    end.setSeconds(0);
    end.setMilliseconds(0);
    start.setDate(end.getDate()-6);
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    start.setMilliseconds(0);
    this.timeRange[0] = start;
    this.timeRange[1] = end;
    this.findChannelList();
  },
  methods: {
    getChannelName(row) {
      if (row.isTotal) {
        return "";
      }
      let remark = "未知渠道";
      let channelId = row.channelId;
      if (channelId) {
        let channel = this.channelMap[channelId];
        if (channel && channel.channelRemark) {
          remark = channel.channelRemark;
        }
      }
      return remark;
    },
    findChannelList() {
      getChannel()
        .then(res => {
          this.channels = res.map.list;
          console.log(this.channels);
          this.channelMap = {};
          if (this.channels && this.channels.length) {
            this.channels.forEach(element => {
              this.channelMap[element.channelId] = element;
            });
          }
          this.findList();
        })
        .catch(() => {
          this.findList();
        });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.isTotal && columnIndex === 4) {
        return [1, 5];
      } else if (row.isTotal && columnIndex === 5) {
        return [1, 1];
      } else if (row.isTotal) {
        return [0, 0];
      }
    },
    findList() {
      this.listLoading = true;
      this.pageQuery.startTime = this.timeRange[0].getTime();
      this.pageQuery.endTime = this.timeRange[1].getTime();
      findDailyList(this.pageQuery)
        .then(res => {
          this.list = res.map.list;
          if (!this.list) {
            this.list = [];
          }
          let curPageStatistics = {
            allBetting: 0,
            allBonus: 0,
            allProfit: 0,
            allSendGold: 0,
            allTransferInGold: 0,
            allTransferOutGold: 0,
            allInoutProfit: 0
          };
          this.list.forEach(element => {
            curPageStatistics.allBetting += element.allBetting;
            curPageStatistics.allBonus += element.allBonus;
            curPageStatistics.allProfit += element.allProfit;
            curPageStatistics.allSendGold += element.allSendGold;
            curPageStatistics.allTransferInGold += element.allTransferInGold;
            curPageStatistics.allTransferOutGold += element.allTransferOutGold;
            curPageStatistics.allInoutProfit += element.allInoutProfit;
          });
          // 本页合计
          this.list.push(
            Object.assign(
              {
                isTotal: true,
                time: "本页合计",
                allBetting: 0,
                allBonus: 0,
                allProfit: 0,
                allSendGold: 0,
                allTransferInGold: 0,
                allTransferOutGold: 0,
                allInoutProfit: 0
              },
              curPageStatistics
            )
          );
          // 范围合计
          this.list.push(
            Object.assign(
              {
                isTotal: true,
                time: "范围合计",
                allBetting: 0,
                allBonus: 0,
                allProfit: 0,
                allSendGold: 0,
                allTransferInGold: 0,
                allTransferOutGold: 0,
                allInoutProfit: 0
              },
              res.map.statistics
            )
          );

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