<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        游戏：<el-select style="width:120px" placeholder="请选择" v-model="pageQuery.gameId" @change="handleGameChange">
            <el-option v-for="item in gameOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        
    </div>
    <el-table ref="roomTable" :key='tableKey' :data="roomRobotList" v-loading="listLoading" border fit highlight-current-row style="width: 100%" 
    @selection-change="handleSelectionChange">
        <el-table-column prop="id" label="id" width="100">
        </el-table-column>
        <el-table-column prop="gameName" label="游戏名" width="80">
        </el-table-column>
        <el-table-column prop="roomName" label="房间名" width="150">
        </el-table-column>

        <el-table-column label="初始携带金币" width="150">
            <template slot-scope="scope">
                <span>{{scope.row.goldlower}}~{{scope.row.goldupper}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="maxgold" label="最大携带金币" width="150">
        </el-table-column>
        
        <el-table-column label="占桌" width="50">
            <template slot-scope="scope">
                <span v-if="scope.row.occupytable ==0" style="color:red;">否</span>
                <span v-else style="color:green;">是</span>
            </template>
        </el-table-column>
        <el-table-column label="对局" width="50">
            <template slot-scope="scope">
                <span v-if="scope.row.gamewithplayer ==0" style="color:red;">否</span>
                <span v-else style="color:green;">是</span>
            </template>
        </el-table-column>
        <el-table-column label="游戏换桌局数" width="120">
            <template slot-scope="scope">
                <span>{{scope.row.tablegamelower}}~{{scope.row.tablegameupper}}</span>
            </template>
        </el-table-column>
        <el-table-column label="游戏换人局数" width="120">
            <template slot-scope="scope">
                <span>{{scope.row.totalgamelower}}~{{scope.row.totalgameupper}}</span>
            </template>
        </el-table-column>
        
        <el-table-column prop="time1players" label="0-2" width="60">
        </el-table-column>
        <el-table-column prop="time2players" label="2-4" width="60">
        </el-table-column>
        <el-table-column prop="time3players" label="4-6" width="60">
        </el-table-column>
        <el-table-column prop="time4players" label="6-8" width="60">
        </el-table-column>
        <el-table-column prop="time5players" label="8-10" width="60">
        </el-table-column>
        <el-table-column prop="time6players" label="10-12" width="60">
        </el-table-column>
        <el-table-column prop="time7players" label="12-14" width="60">
        </el-table-column>
        <el-table-column prop="time8players" label="14-16" width="60">
        </el-table-column>
        <el-table-column prop="time9players" label="16-18" width="60">
        </el-table-column>
        <el-table-column prop="time10players" label="18-20" width="60">
        </el-table-column>
        <el-table-column prop="time11players" label="20-22" width="60">
        </el-table-column>
        <el-table-column prop="time12players" label="22-24" width="60">
        </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="pageQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="roomTotal">
      </el-pagination>
    </div>
    
    <!--新增界面-->
    <el-dialog :title="editFormTitle" :visible.sync="addFormVisible" >
        <el-form :model="addForm" label-width="220px" :rules="addFormRules" ref="addForm" class="number-hide">

            <el-form-item label="游戏房间" v-if="addForm.id == null" required>
                <el-select class="filter-item" v-model="addForm.room" placeholder="请选择">
                    <el-option v-for="item in roomOptions" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="游戏房间" prop="roomName" v-else>
                {{addForm.roomName}}
            </el-form-item>

            <el-form-item label="初始携带金币" required>
                <el-col :span="11">
                    <el-form-item prop="goldlower">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.goldlower" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-form-item prop="goldupper">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.goldupper" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>

            <el-form-item label="最大携带金币" prop="maxgold" required>
                <el-input type="number" placeholder="输入整数" v-model.number="addForm.maxgold" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="游戏换桌局数" required>
                <el-col :span="11">
                    <el-form-item prop="tablegamelower">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.tablegamelower" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-form-item prop="tablegameupper">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.tablegameupper" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>

            <el-form-item label="游戏换人局数" required>
                <el-col :span="11">
                    <el-form-item prop="totalgamelower">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.totalgamelower" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-form-item prop="totalgameupper">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.totalgameupper" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>

            <el-form-item label="配置" required>
                <el-col :span="8">
                0:00~2:00(可配人数:{{restRobot.time1}})
                <el-form-item prop="time1players">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.time1players" auto-complete="off"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                2:00~4:00(可配人数:{{restRobot.time2}})
                <el-form-item prop="time2players">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.time2players" auto-complete="off"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                4:00~6:00(可配人数:{{restRobot.time3}})
                <el-form-item prop="time3players">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.time3players" auto-complete="off"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                6:00~8:00(可配人数:{{restRobot.time4}})
                <el-form-item prop="time4players">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.time4players" auto-complete="off"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                8:00~10:00(可配人数:{{restRobot.time5}})
                <el-form-item prop="time5players">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.time5players" auto-complete="off"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                10:00~12:00(可配人数:{{restRobot.time6}})
                <el-form-item prop="time6players">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.time6players" auto-complete="off"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                12:00~14:00(可配人数:{{restRobot.time7}})
                <el-form-item prop="time7players">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.time7players" auto-complete="off"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                14:00~16:00(可配人数:{{restRobot.time8}})
                <el-form-item prop="time8players">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.time8players" auto-complete="off"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                16:00~18:00(可配人数:{{restRobot.time9}})
                <el-form-item prop="time9players">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.time9players" auto-complete="off"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                18:00~20:00(可配人数:{{restRobot.time10}})
                <el-form-item prop="time10players">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.time10players" auto-complete="off"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                20:00~22:00(可配人数:{{restRobot.time11}})
                <el-form-item prop="time11players">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.time11players" auto-complete="off"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                22:00~24:00(可配人数:{{restRobot.time12}})
                <el-form-item prop="time12players">
                    <el-input type="number" placeholder="输入整数" v-model.number="addForm.time12players" auto-complete="off"></el-input>
                </el-form-item>
                </el-col>
            </el-form-item>

            <el-form-item label="是否允许占桌" required prop="">
                <el-radio-group v-model="addForm.occupytable">
                    <el-radio class="radio" :label="0">否</el-radio>
                    <el-radio class="radio" :label="1">是</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="是否允许和玩家对局" required>
                <el-radio-group v-model="addForm.gamewithplayer">
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
<style scope>
    .line{
            text-align: center;
    }
</style>

<script>

import { getGameList } from "@/api/games";

import { getRoomRobotList,getNoRobotRoomList,getRestRobotList,addRoomRobotCfg,modRoomRobotCfg,delRoomRobotCfg } from "@/api/robot";
import { parseTime } from "@/utils";

export default {
  name: "gameTable",
  data() {
    return {
        pageQuery: {
            gameId:0,
            roomId:null,
            page: 1,
            pageSize: 10
        },
        gameOptions:{},
        roomOptions:{},
        restRobot:{time1:0,time2:0,time3:0,time4:0,time5:0,time6:0,time7:0,time8:0,time9:0,time10:0,time11:0,time12:0},
        roomTotal:0,
        activeGame:'0',
        tableKey: 0,
        gameList: null,
        roomRobotList: null,
        listLoading: false,
        roomMulSel:[],
        //新增界面数据
        roomTypeOpts: [
        ],
        addFormVisible:false,
        addLoading: false,
        addFormRules: {
            goldlower: [{ type:'number',required: true, message: "请输入初始下限", trigger: "blur" }],
            goldupper: [{ type:'number',required: true, message: "请输入初始上限", trigger: "blur" }],
            maxgold: [{ type:'number',required: true, message: "请输入最大携带筹码", trigger: "blur" }],
            tablegamelower: [{ type:'number',required: true, message: "请输入单桌游戏局数下限", trigger: "blur" }],
            tablegameupper: [{ type:'number',required: true, message: "请输入单桌游戏局数上限", trigger: "blur" }],
            totalgamelower: [{ type:'number',required: true, message: "请输入游戏总局数下限", trigger: "blur" }],
            totalgameupper: [{ type:'number',required: true, message: "请输入游戏总局数上限", trigger: "blur" }],

            time1players: [{ type:'number',required: true, message: "请输入机器人数", trigger: "blur" }],
            time2players: [{ type:'number',required: true, message: "请输入机器人数", trigger: "blur" }],
            time3players: [{ type:'number',required: true, message: "请输入机器人数", trigger: "blur" }],
            time4players: [{ type:'number',required: true, message: "请输入机器人数", trigger: "blur" }],
            time5players: [{ type:'number',required: true, message: "请输入机器人数", trigger: "blur" }],
            time6players: [{ type:'number',required: true, message: "请输入机器人数", trigger: "blur" }],
            time7players: [{ type:'number',required: true, message: "请输入机器人数", trigger: "blur" }],
            time8players: [{ type:'number',required: true, message: "请输入机器人数", trigger: "blur" }],
            time9players: [{ type:'number',required: true, message: "请输入机器人数", trigger: "blur" }],
            time10players: [{ type:'number',required: true, message: "请输入机器人数", trigger: "blur" }],
            time11players: [{ type:'number',required: true, message: "请输入机器人数", trigger: "blur" }],
            time12players: [{ type:'number',required: true, message: "请输入机器人数", trigger: "blur" }],
            },
        editFormTitle:"机器人配置",
        addForm: {
            id:null,
            game: "",
            room: "",
            occupytable:1, // 是否允许占桌
            gamewithplayer:1, // 是否允许和玩家对局
            goldlower:0, // 携带金币的下限
            goldupper:0, // 携带金币的上限
            maxgold:0, // 最大携带金币数
            tablegamelower:0, // 单桌游戏局数下限
            tablegameupper:0, // 单桌游戏局数上限
            totalgamelower:0, // 游戏总局数下限
            totalgameupper:0, // 游戏总局数上限
            time1players:0, // 0:00-2:00人数
            time2players:0, // 2:00-4:00人数
            time3players:0, // 4:00-6:00人数
            time4players:0, // 6:00-8:00人数
            time5players:0, // 8:00-10:00人数
            time6players:0, // 10:00-12:00人数
            time7players:0, // 12:00-14:00人数
            time8players:0, // 14:00-16:00人数
            time9players:0, // 16:00-18:00人数
            time10players:0, // 18:00-20:00人数
            time11players:0, // 20:00-22:00人数
            time12players:0 // 22:00-24:00人数
        }
    };
  },
  created() {
    this.getGameType();
  },
  methods: {
    getGameType(){
        this.listLoading = true;
        getGameList().then(res=>{
            this.listLoading = false;
            this.gameOptions = res.map.list;
            this.pageQuery.gameId = this.gameOptions[0].id;
            this.getRoomRobotList();
        }).catch(()=>{
            this.$message({message: "获取数据失败，请重试",type: "error"});
          this.listLoading = false;
        });
    },
    handleGameChange(){
        this.getRoomRobotList();
    },
    getRoomRobotList() {
      this.listLoading = true;
      getRoomRobotList(this.pageQuery)
        .then(res => {
            this.roomMulSel=[];
            this.roomRobotList = res.map.list;
            this.roomTotal = res.map.total;
            this.listLoading = false;
        })
        .catch(() => {
            this.$message({message: "获取数据失败，请重试",type: "error"});
            this.listLoading = false;
        });
    },
    getNoRobotRoomLisr(){
    },
    handleFilter() {
      this.pageQuery.page = 1;
      this.getRoomRobotList();
    },
    handleSizeChange(val) {
      this.pageQuery.pageSize = val;
      this.getRoomRobotList();
    },
    handleCurrentChange(val) {
      this.pageQuery.page = val;
      this.getRoomRobotList();
    },
    handleSelectionChange(val){
       this.roomMulSel = val; 
    },
    handleDelete(row){
        this.$confirm("确认删除所选房间吗?", "提示", {
            type: "warning"
        })
        .then(() => {
            this.listLoading = true;
            let param = {
                id : row.id
            }
            delRoomRobotCfg(param)
            .then(res => {
                this.listLoading = false;
                this.$message({
                    message: "删除成功",
                    type: "success"
                });
                this.getRoomRobotList();
            })
            .catch(() => {
                this.listLoading = false;
            });
        })
    },
    handleAdd(){
        let param = {};
        param.gameId = this.pageQuery.gameId;
        getNoRobotRoomList(param)
        .then(res => {
            this.roomOptions = res.map.list;
            param.roomId = this.roomOptions[0].id;
            getRestRobotList(param).then(res=>{
                this.restRobot = res.map.result;
                this.addFormVisible = true;
                this.addForm = {
                    id:null,
                    game: this.pageQuery.gameId,
                    room: this.roomOptions[0].id,
                    occupytable:1, // 是否允许占桌
                    gamewithplayer:1, // 是否允许和玩家对局
                    goldlower:0, // 携带金币的下限
                    goldupper:0, // 携带金币的上限
                    maxgold:0, // 最大携带金币数
                    tablegamelower:0, // 单桌游戏局数下限
                    tablegameupper:0, // 单桌游戏局数上限
                    totalgamelower:0, // 游戏总局数下限
                    totalgameupper:0, // 游戏总局数上限
                    time1players:0, // 0:00-2:00人数
                    time2players:0, // 2:00-4:00人数
                    time3players:0, // 4:00-6:00人数
                    time4players:0, // 6:00-8:00人数
                    time5players:0, // 8:00-10:00人数
                    time6players:0, // 10:00-12:00人数
                    time7players:0, // 12:00-14:00人数
                    time8players:0, // 14:00-16:00人数
                    time9players:0, // 16:00-18:00人数
                    time10players:0, // 18:00-20:00人数
                    time11players:0, // 20:00-22:00人数
                    time12players:0 // 22:00-24:00人数
                };
            })
            .catch(() => {
                this.$message({message: "获取数据失败，请重试",type: "error"});
                this.listLoading = false;
            });
        })
        .catch(() => {
            this.$message({message: "获取数据失败，请重试",type: "error"});
            this.listLoading = false;
        });

    },
    handleEdit(row){
        let param = {};
        param.gameId = this.pageQuery.gameId;
        param.roomId = row.room;
        getRestRobotList(param).then(res=>{
            this.restRobot = res.map.result;
            this.addFormVisible = true;
            this.addForm = row;
        })
        .catch(() => {
            this.$message({message: "获取数据失败，请重试",type: "error"});
            this.listLoading = false;
        });
    },
    handleSubmit(){
      this.$refs.addForm.validate(valid => {
        if (valid) {
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
                this.addLoading = true;
                let para = this.addForm;
                if(para.id == null){
                    addRoomRobotCfg(para)
                    .then(res => {
                        this.addLoading = false;
                        this.$message({message: "添加成功",type: "success"});
                        this.$refs["addForm"].resetFields();
                        this.addFormVisible = false;
                        this.getRoomRobotList();
                    })
                    .catch(() => {
                        this.$message({message: "添加失败",type: "error"});
                        this.addLoading = false;
                    });
                }
                else{
                    modRoomRobotCfg(para)
                    .then(res => {
                        this.addLoading = false;
                        this.$message({message: "修改成功",type: "success"});
                        this.$refs["addForm"].resetFields();
                        this.addFormVisible = false;
                        this.getRoomRobotList();
                    })
                    .catch(() => {
                        this.$message({message: "修改失败",type: "error"});
                        this.addLoading = false;
                    });
                }
            }).catch(() => {
                this.addLoading = false;
            });
        }
      });
    }
  }
};
</script>