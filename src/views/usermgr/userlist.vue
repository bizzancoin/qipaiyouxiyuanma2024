<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      渠道：<el-select style="width:120px" placeholder="请选择渠道" v-model="pageQuery.channelId" clearable >
        <el-option v-for="item in channels"
          :key="item.channelId"
          :label="item.channelRemark"
          :value="item.channelId"/>
      </el-select>
      用户类型：<el-select style="width:120px" placeholder="请选择用户类型" v-model="pageQuery.playerType" clearable >
        <el-option v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      状态：<el-select style="width:120px" placeholder="请选择用户状态" v-model="pageQuery.locked" clearable >
        <el-option v-for="item in lockedOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      ID：    <el-input style="width:180px" :maxlength="10" v-model="pageQuery.playerId" placeholder="玩家ID" clearable/>
      <!-- 靓号：    <el-input style="width:180px" :maxlength="10" v-model="pageQuery.superId" placeholder="玩家靓号" clearable/> -->
      帐号：  <el-input style="width:180px" placeholder="帐号" v-model="pageQuery.userName" clearable/>
      昵称：  <el-input style="width:180px" :maxlength="20" placeholder="玩家昵称" v-model="pageQuery.nickName" clearable/>
      <!-- 手机号：<el-input style="width:180px" type="phone" :maxlength="11" placeholder="手机号" v-model="pageQuery.phone" clearable/> -->
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>
    <div class="filter-container">
      <!-- <el-button type="primary" size="small" @click="handleSendGold">赠送身上金币</el-button> -->
      <el-button  v-if="hasPermission('B0102')" type="primary" size="small" @click="handleSendSafeGold">赠送安全金币</el-button>
      <!-- <el-button type="primary" size="small" @click="handleSetPhone">修改手机号</el-button> -->
      <!-- <el-button type="primary" size="small" @click="handleSetSuperId">设置靓号</el-button>
      <el-button type="primary" size="small" @click="handleUndoSuperId">取消靓号</el-button> -->
      <el-button  v-if="hasPermission('B0103')" type="primary" size="small" @click="handleBatchLock">批量冻结</el-button>
      <el-button  v-if="hasPermission('B0103')" type="primary" size="small" @click="handleActive">批量解禁</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" 
      @selection-change="handleSelectChange" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" prop="playerId" type="selection" width="55" />
      <el-table-column align="center" prop="playerId" label="玩家ID" width="80" fixed/>
      <el-table-column align="center" prop="channelId" label="渠道ID" width="80" fixed>
        <template slot-scope="scope">
          <span >{{ getChannelName(scope.row.channelId)}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="superId" label="靓号ID" width="80"/> -->
      <el-table-column align="center" prop="userName" label="账号" width="160"/>
      <el-table-column align="center" prop="nickName" label="昵称" width="160"/>
      <!-- <el-table-column align="center" prop="phone" label="手机" width="120"/> -->
      <el-table-column align="center" prop="playerType" :formatter="formatterType" label="类型" width="120"/>
      <el-table-column align="center" prop="totalGold" label="总金币" width="140">         
        <template slot-scope="scope">
          <span >{{scope.row.totalGold | goldToMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="gold" label="游戏中金币" width="140"> 
        <template slot-scope="scope">
          <span >{{scope.row.gold | goldToMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="safeGold" label="安全金币" width="140">
        <template slot-scope="scope">
          <span >{{scope.row.safeGold | goldToMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="onlineState" label="游戏状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.onlineState === 0">离线</span>
          <span v-else>在线</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="state" label="玩家状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.state === 0">冻结</span>
          <span v-else>解禁</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录时间" width="160">
        <template slot-scope="scope">
            <span>{{scope.row.loginTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="loginIp" :formatter="formatIP" label="登录地区"/> -->
       <el-table-column align="center" prop="loginIp" label="登录IP">
        <template slot-scope="scope">
          <div>{{scope.row.loginIp}}</div>
          <div>
          <el-button v-if="scope.row.loginIp" size="mini"  type="info" @click="handleIpToLocation(scope.row)">查看地址
          </el-button>
          </div>
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
import {
  findUserList,
  sendGold,
  sendSafeGold,
  setPhone,
  setSuperId,
  undoSuperId,
  batchLock,
  batchActive,
  locationDetail
} from "@/api/user";

import { getChannel } from "@/api/common";
import { hasPermission } from "@/utils/auth"; // 验权
import { parseTime } from "@/utils";

export default {
  name: "userTable",
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      totalSize: 0,
      multipleSelection: [],
      channelMap: {},
      channels: [],
      typeOptions: [
        {
          value: "1",
          label: "玩家"
        },
        {
          value: "3",
          label: "机器人"
        }
      ],
      lockedOptions: [
        {
          value: "false",
          label: "解禁"
        },
        {
          value: "true",
          label: "冻结"
        }
      ],
      pageQuery: {
        page: 1,
        pageSize: 10,
        playerType: "1",
        playerId: undefined,
        superId: undefined,
        nickName: "",
        userName: "",
        phone: "",
        channelId: undefined,
        locked: undefined
      }
    };
  },
  created() {
    this.findChannelList();
  },
  methods: {
    hasPermission: hasPermission,
    formatterType(row, column) {
      let addrTxt = "玩家";
      return row.playerType == 3
        ? "机器人"
        : row.playerType == 2 ? "代理" : "玩家";
    },
    formatIP(row, column) {
      let addrTxt = "未知";
      axios
        .get(
          "http://ip.taobao.com/service/getIpInfo.php",
          qs.stringify({ ip: row.loginIp })
        )
        .then(res => {
          if (res.code == 0) {
            addrTxt =
              res.data.country +
              res.data.area +
              res.data.region +
              res.data.city +
              res.data.county +
              res.data.isp;
            return addrTxt;
          }
        })
        .catch(() => {});
      return addrTxt;
    },
    getChannelName(channelId) {
      let remark = "未知渠道";
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
    findList() {
      this.listLoading = true;
      findUserList(this.pageQuery)
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
          this.multipleSelection.push(val[i]);
        }
      } else {
        this.multipleSelection = [];
      }
    },
    // 赠送身上金币
    handleSendGold() {
      if (this._limitSelections(1, true)) {
        this.$prompt("请输入赠送金币", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^-?[0-9]*.?[0-9]*$/,
          inputErrorMessage: "请输入整数"
        })
          .then(({ value }) => {
            this.listLoading = true;
            sendGold(this.multipleSelection[0].playerId, value)
              .then(res => {
                this.$message({
                  message: "赠送成功",
                  type: "success"
                });
                this.findList();
              })
              .catch(() => {
                this.listLoading = false;
              });
          })
          .catch(() => {});
      }
    },
    // 赠送保险箱金币
    handleSendSafeGold() {
      if (this._limitSelections(1, true)) {
        this.$prompt("请输入赠送金币", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^-?[0-9]*.?[0-9]*$/,
          inputErrorMessage: "请输入整数"
        })
          .then(({ value }) => {
            this.listLoading = true;
            sendSafeGold(this.multipleSelection[0].playerId, value * 1000)
              .then(res => {
                this.$message({
                  message: "赠送成功",
                  type: "success"
                });
                this.findList();
              })
              .catch(() => {
                this.listLoading = false;
              });
          })
          .catch(() => {});
      }
    },
    handleSetPhone() {
      if (this._limitSelections(1, true)) {
        this.$prompt("请输入手机号", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^(1[3-9][0-9])\d{8}$/,
          inputErrorMessage: "请输入正确手机号"
        })
          .then(({ value }) => {
            setPhone(this.multipleSelection[0].playerId, value)
              .then(res => {
                this.$message({
                  message: "设置成功",
                  type: "success"
                });
                this.findList();
              })
              .catch(() => {
                this.listLoading = false;
              });
          })
          .catch(() => {});
      }
    },
    // 设置靓号
    handleSetSuperId() {
      if (this._limitSelections(1, true)) {
        this.$prompt("请输入靓号", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^[1-9]\d{5}$/,
          inputErrorMessage: "请输入6位正整数",
          maxlength: 6
        })
          .then(({ value }) => {
            setSuperId(this.multipleSelection[0].playerId, value)
              .then(res => {
                this.$message({
                  message: "设置成功",
                  type: "success"
                });
                this.findList();
              })
              .catch(() => {
                this.listLoading = false;
              });
          })
          .catch(() => {});
      }
    },
    // 取消靓号
    handleUndoSuperId() {
      if (this._limitSelections(1, true)) {
        this.$confirm("确定要取消该代理靓号吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(({ value }) => {
            undoSuperId(this.multipleSelection[0].playerId)
              .then(res => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.findList();
              })
              .catch(() => {
                this.listLoading = false;
              });
          })
          .catch(() => {});
      }
    },
    // 批量锁定
    handleBatchLock() {
      if (this._limitSelections(1, false)) {
        for (let index = 0; index < this.multipleSelection.length; index++) {
          let element = this.multipleSelection[index];
          if (element.state != 1) {
            this.$message({
              message: "选择中的玩家包含已解禁玩家，请重新选择",
              type: "error"
            });
            return false;
          }
        }
        this.$confirm(
          "你确定要冻结 " + this.multipleSelection.length + " 个玩家吗？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            let ids = [];
            this.multipleSelection.forEach(element => {
              ids.push(element.playerId);
            });
            batchLock(ids)
              .then(res => {
                this.$message({
                  message: "冻结成功",
                  type: "success"
                });
                this.findList();
              })
              .catch(() => {
                this.listLoading = false;
              });
          })
          .catch(() => {});
      }
    },
    handleIpToLocation(row) {
      this.listLoading = true;
      if (row.loginIp) {
        locationDetail({ ip: row.loginIp })
          .then(res => {
            let location = "未知";
            if (res.code == 200) {
              location = res.map.location;
            }
            this.listLoading = false;
            this.$alert(location, "地址", {
              confirmButtonText: "确定"
            });
          })
          .catch(() => {
            this.listLoading = false;
            this.$alert("未知", "地址", {
              confirmButtonText: "确定"
            });
          });
      }
    },
    // 解禁单个玩家
    handleActive() {
      if (this._limitSelections(1, false)) {
        for (let index = 0; index < this.multipleSelection.length; index++) {
          let element = this.multipleSelection[index];
          if (element.state != 0) {
            this.$message({
              message: "选择中的玩家包含已解禁玩家，请重新选择",
              type: "error"
            });
            return false;
          }
        }

        this.$confirm(
          "你确定要解禁 " + this.multipleSelection.length + " 个玩家吗？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            let ids = [];
            this.multipleSelection.forEach(element => {
              ids.push(element.playerId);
            });
            batchActive(ids)
              .then(res => {
                this.$message({
                  message: "解禁成功",
                  type: "success"
                });
                this.findList();
              })
              .catch(() => {
                this.listLoading = false;
              });
          })
          .catch(() => {});
      }
    },
    // 提示框
    _limitSelections(limit, isLimit) {
      let length = this.multipleSelection.length;
      if (!isLimit) {
        if (length < limit) {
          this.$message({
            message: "请至少选择" + limit + "位玩家"
          });
          return false;
        }
        return true;
      }

      if (length > limit) {
        this.$message({
          message: "只能选择" + limit + "位玩家"
        });
        return false;
      }
      if (length < limit) {
        this.$message({
          message: "请选择" + limit + "位玩家"
        });
        return false;
      }
      return true;
    }
  }
};
</script>