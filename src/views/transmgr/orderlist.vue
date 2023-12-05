<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
        用户ID：  <el-input style="width:180px" :maxlength="10" v-model="pageQuery.playerId" placeholder="用户ID" clearable/>
        用户靓号：<el-input style="width:180px" :maxlength="10" v-model="pageQuery.superId" placeholder="用户靓号" clearable/>
        用户类型：<el-select style="width:120px" placeholder="请选择" v-model="pageQuery.playerType">
          <el-option key="" label="全部" value=""/>
          <el-option :key="0" label="玩家" :value="0"/>
          <el-option :key="1" label="代理" :value="1"/>
        </el-select>
        对方类型：<el-select style="width:120px" placeholder="请选择" v-model="pageQuery.oppositeType">
          <el-option key="" label="全部" value=""/>
          <el-option :key="0" label="玩家" :value="0"/>
          <el-option :key="1" label="代理" :value="1"/>
        </el-select>

        类型：<el-select style="width:120px" placeholder="请选择" v-model="pageQuery.type">
        <el-option :key="1" label="转出" :value="1"/>
        <el-option :key="2" label="转入" :value="2"/>
      </el-select>
        时间：    <el-date-picker v-model="timeRange" type="datetimerange" range-separator="至" 
        start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2"></el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" prop="id" label="转账编号" width="80" fixed/>
      <el-table-column align="center" prop="type" label="类型" width="80" fixed>
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">转出</span>
          <span v-else>转入</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="playerId" label="用户ID" width="100" fixed/>
      <el-table-column align="center" prop="playerSuperId" label="用户靓号" width="100" fixed/>
      <el-table-column align="center" prop="playerName" label="用户昵称" width="200" fixed/>
      <el-table-column align="center" prop="playerType" label="用户类型" width="80" >
        <template slot-scope="scope">
          <span v-if="scope.row.playerType === 1">代理</span>
          <span v-else>玩家</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" prop="oppositePlayerId" label="对方用户ID" width="100" />
      <el-table-column align="center" prop="oppositeSuperId" label="对方用户靓号" width="120" />
      <el-table-column align="center" prop="oppositePlayerName" label="对方用户昵称" width="200" />
      <el-table-column align="center" prop="oppositeType" label="对方用户类型" width="80" >
        <template slot-scope="scope">
          <span v-if="scope.row.oppositeType === 1">代理</span>
          <span v-else>玩家</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="beforeSafeGold" label="转账前银行金币" width="200" />
      <el-table-column align="center" prop="afterSafeGold" label="转账后银行金币" width="200" />
      <el-table-column align="center" prop="changeSafeGold" label="转账金币" width="120" />

      <el-table-column align="center" prop="fee" label="手续费" width="80"/>
      
      <el-table-column align="center" label="手续费率" width="60">
        <template slot-scope="scope">
            <span>{{scope.row.feeRate}}‰</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="时间" width="200">
        <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <p style="color:#409EFF">总计：{{totalGold}}</p>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="pageQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>


<script>
import axios from 'axios'
import qs from 'qs';
import { findUserTransList} from "@/api/trans";
import { parseTime } from "@/utils";

export default {
  name: "transTable",
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      totalSize: 0,
      totalGold:0,
      timeRange:[new Date(),new Date()],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }],
          disabledDate: new Date()
        },
      pageQuery: {
        page: 1,
        pageSize: 10,
        playerId: undefined,
        superId: undefined,
        type: 1,
        playerType: undefined,
        oppositeType: undefined,
        startTime: undefined,
        endTime: undefined
      }
    };
  },
  created() {
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    this.timeRange[0] = start;
    this.findList();
  },
  methods: {
    findList() {
      this.listLoading = true;
      this.pageQuery.startTime = this.timeRange[0].getTime();
      this.pageQuery.endTime = this.timeRange[1].getTime();
      findUserTransList(this.pageQuery)
        .then(res => {
          this.list = res.map.list;
          this.totalGold = res.map.totalGold;
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