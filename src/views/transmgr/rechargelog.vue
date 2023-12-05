<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
        <el-input style="width:180px" :maxlength="10" v-model="pageQuery.playerId" placeholder="用户ID" clearable/>
        <el-input style="width:250px" :maxlength="30" v-model="pageQuery.trandeNo" placeholder="订单号" clearable/>

        <el-select style="width:120px" placeholder="状态" v-model="pageQuery.state">
        <el-option key="" label="状态" value=""/>
        <el-option :key="0" label="待支付" :value="0"/>
        <el-option :key="1" label="支付成功" :value="1"/>
      </el-select>
        <el-date-picker v-model="timeRange" type="datetimerange" range-separator="至" 
        start-placeholder="创建订单开始日期" end-placeholder="创建订单结束日期" :picker-options="pickerOptions2"></el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" prop="id" label="编号" width="80" fixed/>
      <el-table-column align="center" prop="tradeNo" label="订单号" width="200" fixed/>
      <el-table-column align="center" prop="outsideNo" label="外部订单号" width="200" fixed/>

      <el-table-column align="center" prop="playerId" label="用户ID" width="100" fixed/>
      <el-table-column align="center" prop="gold" label="钻石" width="100" fixed/>
      <el-table-column align="center" prop="price" label="价格（元）" width="200" fixed>
         <template slot-scope="scope">
          ¥{{(scope.row.price/100) .toFixed(2)}}
        </template>
       </el-table-column>  
      <el-table-column align="center" prop="payType" label="支付方式" width="80" >
        <template slot-scope="scope">
          <span v-if="scope.row.payType === 1">支付宝</span>
          <span v-else>微信</span>
        </template>
      </el-table-column>     
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
        <el-table-column align="center" label="支付时间" width="200">
        <template slot-scope="scope">
            <span>{{scope.row.payTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
       <el-table-column align="center" prop="state" label="状态"  >
        <template slot-scope="scope">
          <span v-if="scope.row.state === 0">未支付</span>
          <span v-else>支付成功</span>
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
import axios from 'axios'
import qs from 'qs';
import { findRechargeLog} from "@/api/trans";
import { parseTime } from "@/utils";

export default {
  name: "transTable",
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      totalSize: 0,
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
        trandeNo: undefined,
        payType: 2,
        playerId: undefined,
        state: undefined,
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
      if(this.timeRange && this.timeRange.length > 0){
        this.pageQuery.startTime = this.timeRange[0].getTime();
        this.pageQuery.endTime = this.timeRange[1].getTime();
      }else {
        this.pageQuery.startTime = null;
        this.pageQuery.endTime = null;
      }
      findRechargeLog(this.pageQuery)
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
  }
};
</script>