<template>
  <div class="app-container calendar-list-container">
    <div style="margin: 20px 0">
        <el-button type="primary" plain @click="handleAdd" v-show="hasPermission('A0202')">新增房间</el-button>
    </div>
    <el-table ref="roomTable" :key='tableKey' :data="roomList" v-loading="listLoading" border fit highlight-current-row style="width: 100%" 
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
        <el-table-column fixed="right" label="操作"  width="300">
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
            <el-form-item label="机器人比例" prop="robotRatio" v-if="needRobot">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.robotRatio" auto-complete="off"></el-input>
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
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.chair" auto-complete="off" min="1" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="底分" prop="base">
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.base" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="台费(进桌扣一次)" prop="afee">
                <el-input type="number" placeholder="输入数字（最多两位小数）" v-model.number="addForm.afee" auto-complete="off"></el-input>
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
  delGameRoom
} from "@/api/games/ddzroom";
import { getGameList } from "@/api/games";
import { parseTime, deepClone } from "@/utils";
import { goldToMoneyNotFixed, moneyToGold, goldToMoney } from "@/filters";
import { hasPermission } from '@/utils/auth' // 验权
export default {
  name: "gameTable",
  data() {
    return {
      needRobot: false,
      roundGame: false,
      roomQuery: {
        page: 1,
        pageSize: 10
      },
      roomTotal: 0,
      activeGame: "0",
      tableKey: 122121,
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
            trigger: "change"
          },
          { type: "number", min: 1, message: "至少1", trigger: "change" }
        ],
        lower: [
          {
            type: "number",
            required: true,
            message: "请输入进入下限（大于0）",
            trigger: "change",
            min: 1
          }
        ],
        upper: [
          {
            type: "number",
            required: true,
            message: "请输入进入上限（0不限制）",
            trigger: "change",
            min: 0
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
        robotRatio: [
          {
            type: "number",
            required: true,
            message: "请输入机器人比例百分比",
            trigger: "change"
          },
          {
            type: "number",
            min: 0,
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
        base: [
          {
            type: "number",
            required: true,
            message: "请输入底分",
            trigger: "change",
            min: 1
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
      betInputVisible: false,
      inputBetValue: "",
      addForm: {
        id: null,
        name: "",
        type: "", //类型 等级
        tableNum: 0, //桌子数
        chair: 3, //每桌人数
        lower: 1, //进入下限
        upper: 0, //进入上限
        ordinarPeople: 0, //爆满人数百分比
        proportionGold: 1, //金币筹码比率-金币
        proportionChips: 1, //金币筹码比率-筹码
        afee: 0, //台费
        robotRatio: 0,
        inType: 1, //进入类型（0点击入座，1自动分配
        base: 0, //底分
        isActive: 0, //是否开启
      }
    };
  },
  created() {
    this.getRoomType();
  },
  methods: {
    hasPermission : hasPermission,
    showInput() {
      this.betInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
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
        this.listLoading = true;
        getGameList({})
        .then(res => {
          this.listLoading = false;
           let gamelist = res.map.list;
          if (gamelist && gamelist.length) {
           for (let i = 0; i<gamelist.length; i++){
               let item = gamelist[i];
               if(item.id == 25){
                   this.needRobot = item.needRobot;
                   this.roundGame = item.roundGame;
                   this.getRoomList();
                   break;
               }
            }
          }
        })
        .catch(() => {
          this.$message({ message: "获取数据失败，请重试", type: "error" });
          this.listLoading = false;
        });
        
      });
    },
    getRoomList() {
      this.listLoading = true;
      getRoomList(this.roomQuery)
        .then(res => {
          this.roomMulSel = [];
          let roomlist = res.map.list;
          if (roomlist && roomlist.length) {
            for (let index = 0; index < roomlist.length; index++) {
              let element = roomlist[index];
              element.lower = goldToMoneyNotFixed(element.lower);
              element.upper = goldToMoneyNotFixed(element.upper);
              element.afee = goldToMoney(element.afee);
            }
          }
          this.roomList = roomlist;
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
        tableNum: 0, //桌子数
        chair: 3, //每桌人数
        lower: 1, //进入下限
        upper: 0, //进入上限
        ordinarPeople: 0, //爆满人数百分比
        proportionGold: 1, //金币筹码比率-金币
        proportionChips: 1, //金币筹码比率-筹码
        afee: 0, //台费
        robotRatio: 0,
        inType: 1, //进入类型（0点击入座，1自动分配
        base: 0, //底分
        isActive: 0, //是否开启
      };
    },
    handleEdit(row) {
      this.addFormVisible = true;
      this.addFormTitle = "房间编辑";
      this.addForm = deepClone(row);
    },
    handleSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            let para = deepClone(this.addForm);
            para.lower = moneyToGold(para.lower);
            para.upper = moneyToGold(para.upper);
            para.afee = moneyToGold(para.afee);

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