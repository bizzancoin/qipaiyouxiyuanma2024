<template>
  <div class="app-container calendar-list-container">
    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
        <el-table-column fixed prop="id" label="游戏id" width="150">
        </el-table-column>
        <el-table-column prop="name" label="类型" width="120">
        </el-table-column>
        <el-table-column prop="active" label="游戏" width="120">
            <template slot-scope="scope">
                <span v-if="scope.row.active ==0" style="color:red;">已关闭</span>
                <span v-else style="color:green;">已开启</span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button v-if="!scope.row.active && hasPermission('A0102')" type="success" plain @click="handleOpen(scope.row)">开启</el-button>
            <el-button v-else-if="hasPermission('A0102')" type="info" plain @click="handleClose(scope.row)">关闭</el-button>
            <el-button v-if="hasPermission('A0201')" size="small" @click="goRoomMgr(scope.row)">房间管理</el-button>
        </template>
        </el-table-column>
    </el-table>
  </div>
</template>


<script>
import { getGameList, changeState } from "@/api/games";
import { parseTime } from "@/utils";
import { hasPermission } from '@/utils/auth' // 验权

export default {
  name: "gameTable",
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    hasPermission : hasPermission,
    getList() {
      this.listLoading = true;
      getGameList()
        .then(res => {
          this.list = res.map.list;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    handleOpen(row) {
      this.$confirm("确认开启所选游戏吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.handleChangeStatus(row.id, true);
      });
    },
    handleClose(row) {
      this.$confirm("确认关闭所选游戏吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.handleChangeStatus(row.id, false);
      });
    },
    handleChangeStatus(id, active) {
      this.listLoading = true;
      let param = {
        id: id,
        active: active
      };
      changeState(param)
        .then(res => {
          this.listLoading = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getList();
        })
        .catch(() => {
          this.listLoading = false;
        });
    },

    goRoomMgr(row) {
      if (row.id == 3) {
        this.$router.push({ path: "shuihuroommgr" });
      }
      if (row.id == 10) {
        this.$router.push({ path: "animalsroommgr" });
      }
      if (row.id == 23) {
        this.$router.push({ path: "fruitsroommgr" });
      }
      if (row.id == 12) {
        this.$router.push({ path: "lkpyroommgr" });
      }
      if (row.id == 9) {
        this.$router.push({ path: "jcbyroommgr" });
      }
      if (row.id == 13) {
        this.$router.push({ path: "niuniuroommgr" });
      }
      if (row.id == 24) {
        this.$router.push({ path: "bjroommgr" });
      }
      if (row.id == 25) {
        this.$router.push({ path: "ddzroommgr" });
      }
      if (row.id == 17) {
        this.$router.push({ path: "zjhroommgr" });
      }
      if (row.id == 18) {
        this.$router.push({ path: "baccaratroommgr" });
      }
      if (row.id == 7) {
        this.$router.push({ path: "brnnroommgr" });
      }
    }
  }
};
</script>