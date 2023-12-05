<template>
  <div class="app-container calendar-list-container">
    <div style="margin: 20px 0">
        <el-button type="primary" plain @click="handleAdd" v-show="hasPermission('A0202')">新增房间</el-button>
    </div>
    <el-table ref="roomTable" :key='tableKey' :data="roomList" v-loading="listLoading" stripe border fit highlight-current-row style="width: 100%" 
    @selection-change="handleSelectionChange">
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="id" label="房间id" width="80">
        </el-table-column>
        <el-table-column prop="name" label="房间名" width="200">
        </el-table-column>
        <el-table-column prop="type" label="类型" :formatter="formatterRoomType" width="100">
        </el-table-column>
        <el-table-column prop="tableNum" label="桌子数" width="80">
        </el-table-column>
        <el-table-column label="金币限制" width="200">
            <template slot-scope="scope">
                <span>{{scope.row.lower}}~{{scope.row.upper}}</span>
            </template>
        </el-table-column>
        <el-table-column label="金币:筹码" width="150">
            <template slot-scope="scope">
                <span>{{scope.row.proportionGold}}:{{scope.row.proportionChips}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="exchangePer" label="每次兑换鱼币的金币数量" width="180">
        </el-table-column>
        <el-table-column prop="powerBatteryMultiple" label="能量炮出现倍率" width="160">
        </el-table-column>
        <el-table-column prop="powerBatteryPro" label="能量炮出现概率(万分比)" width="180">
        </el-table-column>
        <el-table-column prop="powerBatteryTime" label="能量炮时间(秒)" width="120">
        </el-table-column>
        <el-table-column prop="scences" label="场景" width="120">
            <template slot-scope="scope">
                <el-tag v-for="tag in scope.row.scences" :key="tag">
                {{tag}}
                </el-tag>
            </template>
        </el-table-column>

        <el-table-column label="创建时间" width="180">
            <template slot-scope="scope">
                <span>{{scope.row.timeCreate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
            </template>
        </el-table-column>
        <el-table-column label="开启时间" width="180">
            <template slot-scope="scope">
                <span>{{scope.row.timeOpen | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="isActive" label="状态" width="120">
            <template slot-scope="scope">
                <span v-if="scope.row.isActive ==0" style="color:red;">已关闭</span>
                <span v-else style="color:green;">已开启</span>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
            <template slot-scope="scope">
                <el-button v-show="scope.row.isActive ==0 && hasPermission('A0204')" type="success" plain @click="handleOpen(scope.row)">开启</el-button>
                <el-button v-show="scope.row.isActive ==1 && hasPermission('A0204')" type="info" plain @click="handleClose(scope.row)">关闭</el-button>
                <el-button v-show="hasPermission('A0202')" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
                <el-button v-show="scope.row.isActive ==0 && hasPermission('A0203')" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="roomQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="roomQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="roomTotal">
      </el-pagination>
    </div>
    
    <!--新增界面-->
    <el-dialog :title="addFormTitle" :visible.sync="addFormVisible" >
        <el-form :model="addForm" label-width="220px" :rules="addFormRules" ref="addForm" class="number-hide">
            <el-form-item label="房间名称" prop="name">
                <el-input placeholder="输入房间名称" v-model="addForm.name" auto-complete="off" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="房间类型" prop="type">
                <el-select class="filter-item" v-model="addForm.type" placeholder="房间类型">
                    <el-option v-for="item in roomTypeOpts" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="金币:筹码">
             <el-col :span="8">
                <el-form-item prop="proportionGold">
                   <el-input-number type="number" placeholder="输入整数" style="width: 100%;" :min="1" v-model.number="addForm.proportionGold" auto-complete="off"></el-input-number>
                </el-form-item>
                </el-col>
                <el-col class="line" :span="2" style="text-align: center;">&lt;=&gt;</el-col>
                <el-col :span="8">
                <el-form-item prop="proportionChips">
                   <el-input-number type="number" placeholder="输入整数" style="width: 100%;" :min="1" v-model.number="addForm.proportionChips" auto-complete="off"></el-input-number>
                </el-form-item>              
                </el-col>
            </el-form-item>
            <el-form-item label="最大人数" prop="maxNum">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.maxNum" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="空闲人数百分比" prop="free">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.free" auto-complete="off" min="1" max="100"></el-input>
            </el-form-item>
            <el-form-item label="普通人数百分比" prop="general">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.general" auto-complete="off" min="1" max="100"></el-input>
            </el-form-item>
            <el-form-item label="拥挤人数百分比" prop="crowded">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.crowded" auto-complete="off" min="1" max="100"></el-input>
            </el-form-item>
            <el-form-item label="进入下限" prop="lower">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.lower" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="进入上限" prop="upper">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.upper" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="普通玩家进入人数百分比" prop="ordinarPeople">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.ordinarPeople" auto-complete="off" min="1" max="100"></el-input>
            </el-form-item>
            <el-form-item label="桌子数" prop="tableNum">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.tableNum" auto-complete="off" min="1" ></el-input>
            </el-form-item>
            <el-form-item label="每桌人数" prop="chair">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.chair" auto-complete="off" min="1"></el-input>
            </el-form-item>
            <el-form-item label="每次兑换鱼币的金币数量" prop="exchangePer">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.exchangePer" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="能量炮出现倍率" prop="powerBatteryMultiple">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.powerBatteryMultiple" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="能量炮出现概率(万分比)" prop="powerBatteryPro">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.powerBatteryPro" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="能量炮时间(秒)" prop="powerBatteryTime">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.powerBatteryTime" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="台费(进桌扣一次)" prop="afee">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.afee" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="场景地图" prop="scences">
                <el-select v-model="addForm.scences" multiple placeholder="请选择">
                    <el-option
                    v-for="item in sceneList"
                    :key="item.id"
                    :label="item.id"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="进入类型" prop="inType">
                <el-radio-group v-model="addForm.inType">
                    <el-radio class="radio" :label="0">点击入座</el-radio>
                    <el-radio class="radio" :label="1">自动分配</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否开启" prop="isActive" v-show="addForm.id">
                <el-radio-group v-model="addForm.isActive">
                    <el-radio class="radio" :label="0">否</el-radio>
                    <el-radio class="radio" :label="1">是</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="handleSubmit" :loading="addLoading">提交</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  getRoomType,
  getRoomList,
  saveGameRoom,
  changeRoomStatus,
  delGameRoom,
  getScenes
} from "@/api/games/lkpyroom";
import { parseTime } from "@/utils";
import { hasPermission } from '@/utils/auth' // 验权

export default {
  name: "gameTable",
  data() {
    return {
      roomQuery: {
        page: 1,
        pageSize: 10
      },
      roomTotal: 0,
      activeGame: "0",
      tableKey: 0,
      gameList: null,
      roomList: null,
      listLoading: false,
      roomMulSel: [],
      //新增界面数据
      roomTypeOpts: [],
      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        name: [
          { required: true, message: "请输入房间名", trigger: "change" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "change"
          }
        ],
        maxNum: [
          {
            type: "number",
            required: true,
            message: "请输入最大人数",
            trigger: "change"
          },
          { type: "number", min: 1, message: "至少1", trigger: "change" }
        ],
        tableNum: [
          {
            type: "number",
            required: true,
            message: "请输入桌子数",
            trigger: "change"
          },
          { type: "number", min: 1, message: "至少1", trigger: "change" }
        ],
        chair: [
          {
            type: "number",
            required: true,
            message: "请输入每桌人数",
            trigger: "change",
            min: 1,
            max: 4
          },
          { type: "number", min: 1, message: "至少1", trigger: "change" }
        ],
        lower: [
          {
            type: "number",
            required: true,
            message: "请输入进入下限",
            trigger: "change"
          }
        ],
        upper: [
          {
            type: "number",
            required: true,
            message: "请输入进入上限",
            trigger: "change"
          }
        ],
        free: [
          {
            type: "number",
            required: true,
            message: "请输入空闲人数百分比",
            trigger: "change"
          },
          {
            type: "number",
            min: 1,
            max: 100,
            message: "请输入1-100之间的整数",
            trigger: "change"
          }
        ],
        general: [
          {
            type: "number",
            required: true,
            message: "请输入普通人数百分比",
            trigger: "change"
          },
          {
            type: "number",
            min: 1,
            max: 100,
            message: "请输入1-100之间的整数",
            trigger: "change"
          }
        ],
        crowded: [
          {
            type: "number",
            required: true,
            message: "请输入拥挤人数百分比",
            trigger: "change"
          },
          {
            type: "number",
            min: 1,
            max: 100,
            message: "请输入1-100之间的整数",
            trigger: "change"
          }
        ],
        ordinarPeople: [
          {
            type: "number",
            required: true,
            message: "请输入普通会员进入人数百分比",
            trigger: "change"
          },
          {
            type: "number",
            min: 1,
            max: 100,
            message: "请输入1-100之间的整数",
            trigger: "change"
          }
        ],
        afee: [
          {
            type: "number",
            required: true,
            message: "请输入台费",
            trigger: "change"
          }
        ],
        exchangePer: [
          {
            type: "number",
            required: true,
            message: "请输入每次兑换鱼币的金币数量",
            trigger: "change"
          }
        ],
        powerBatteryMultiple: [
          {
            type: "number",
            required: true,
            message: "请输入能量炮出现倍率",
            trigger: "change"
          }
        ],
        powerBatteryPro: [
          {
            type: "number",
            required: true,
            message: "请输入能量炮出现概率(万分比)",
            trigger: "change"
          }
        ],
        powerBatteryTime: [
          {
            type: "number",
            required: true,
            message: "请输入能量炮时间",
            trigger: "change"
          }
        ],
        proportionGold: [
          {
            type: "number",
            required: true,
            message: "请输入金币兑比例",
            min: 1,
            trigger: "change"
          }
        ],
        proportionChips: [
          {
            type: "number",
            required: true,
            message: "请输入筹码兑换比例",
            min: 1,
            trigger: "change"
          }
        ]
      },
      addFormTitle: "新建房间",
      addForm: {
        id: null,
        name: "",
        type: "", //类型 等级
        maxNum: 0, //最大人数
        tableNum: 0, //桌子数
        chair: 0, //每桌人数
        lower: 0, //进入下限
        upper: 0, //进入上限
        free: 0, //空闲人数百分比
        general: 0, //普通人数百分比
        crowded: 0, //拥挤人数百分比
        ordinarPeople: 0, //爆满人数百分比
        proportionGold: 1, //金币筹码比率-金币
        proportionChips: 1, //金币筹码比率-筹码
        afee: 0, //台费
        inType: 1, //进入类型（0点击入座，1自动分配
        isActive: 0, //是否开启
        exchangePer: 0,
        powerBatteryMultiple: 0,
        powerBatteryPro: 0,
        powerBatteryTime: 0,
        scences: []
      },
      sceneList: []
    };
  },
  created() {
    this.getRoomType();
    this.getSceneList();
  },
  methods: {
    hasPermission : hasPermission,
    formatterRoomType(row, column) {
      let type = "未知";
      for (let i = 0; i < this.roomTypeOpts.length; i++) {
        if (this.roomTypeOpts[i].id == row.type) {
          type = this.roomTypeOpts[i].name;
          break;
        }
      }
      return type;
    },
    getRoomType() {
      getRoomType().then(res => {
        this.roomTypeOpts = res.map.list;
        this.getRoomList();
      });
    },
    getSceneList() {
      getScenes().then(res => {
        this.sceneList = res.map.list;
      });
    },
    getRoomList() {
      this.listLoading = true;
      getRoomList(this.roomQuery)
        .then(res => {
          this.roomMulSel = [];
          this.roomList = res.map.list;
          this.roomTotal = res.map.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.roomQuery.page = 1;
      this.getRoomList();
    },
    handleSizeChange(val) {
      this.roomQuery.pageSize = val;
      this.getRoomList();
    },
    handleCurrentChange(val) {
      this.roomQuery.page = val;
      this.getRoomList();
    },
    handleSelectionChange(val) {
      this.roomMulSel = val;
    },
    handleOpen(row) {
      this.$confirm("确认开启所选房间吗?", "提示", {
        type: "warning"
      }).then(() => {
        console.log(row.id);
        this.handleChangeStatus(row.id, 1);
      });
    },
    handleClose(row) {
      this.$confirm("确认关闭所选房间吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.handleChangeStatus(row.id, 0);
      });
    },
    handleChangeStatus(id, status) {
      this.listLoading = true;
      let param = {
        id: id,
        isActive: status
      };
      changeRoomStatus(param)
        .then(res => {
          this.listLoading = false;
          this.$message({
            message: "修改状态成功",
            type: "success"
          });
          this.getRoomList();
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    handleDelete(row) {
      this.$confirm("确认删除所选房间吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
        let param = {
          id: row.id
        };
        delGameRoom(param)
          .then(res => {
            this.listLoading = false;
            this.$message({
              message: "修改状态成功",
              type: "success"
            });
            this.getRoomList();
          })
          .catch(() => {
            this.listLoading = false;
          });
      });
    },
    handleAdd() {
      this.addFormVisible = true;
      this.addFormTitle = "新建房间";
      this.addForm = {
        id: null,
        name: "",
        type: "", //类型 等级
        maxNum: 0, //最大人数
        tableNum: 0, //桌子数
        chair: 0, //每桌人数
        lower: 0, //进入下限
        upper: 0, //进入上限
        free: 0, //空闲人数百分比
        general: 0, //普通人数百分比
        crowded: 0, //拥挤人数百分比
        ordinarPeople: 0, //爆满人数百分比
        proportionGold: 1, //金币筹码比率-金币
        proportionChips: 1, //金币筹码比率-筹码
        afee: 0, //台费
        top: 0, //单局上限（筹码）
        inType: 1, //进入类型（0点击入座，1自动分配
        beBankerChips: 0, //上庄金币
        offBankerChips: 0, //下庄金币
        bankerApplyNums: 0, //最大上庄人数
        isActive: 0, //是否开启
        exchangePer: 0,
        powerBatteryMultiple: 0,
        powerBatteryPro: 0,
        powerBatteryTime: 0,
        scences: []
      };
    },
    handleEdit(row) {
      this.addFormVisible = true;
      this.addFormTitle = "房间编辑";
      this.addForm = row;
    },
    handleSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            let para = this.addForm;
            saveGameRoom(para)
              .then(res => {
                this.addLoading = false;
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getRoomList();
              })
              .catch(() => {
                this.addLoading = false;
              });
          });
        }
      });
    }
  }
};
</script>