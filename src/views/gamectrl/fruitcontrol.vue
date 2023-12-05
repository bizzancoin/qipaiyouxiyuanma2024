<template>
  <div class="app-container calendar-list-container" v-loading="loading">
    <div class="filter-container">
      房间：<el-select size="small" style="width:180px" @change="handleRoomChange" placeholder="请选择" v-model="roomId">
        <el-option v-for="item in roomOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id"/>
      </el-select>
    </div>
    <!-- 奖池 奖池金额  携带金币  策略  操作 -->
    <div class="filter-container" style="margin-top:20px">
        <span v-if="roomId">
          <el-button v-if="!hasDefPool && hasPermission('D0102')" size="small" type="primary" 
            @click="handleAddPrizePool(true)">新增默认奖池</el-button>
          <el-button v-if="hasPermission('D0102')" size="small" type="primary" 
            @click="handleAddPrizePool(false)">新增金币奖池</el-button>
          <el-button size="small" type="primary" @click="handleRefreshPrizePool" icon="el-icon-refresh"></el-button>
        </span>
    </div>
    <el-table :key="prizePoolKey" size="mini" :data="poolList" border highlight-current-row fit style="width: 100%">
      <el-table-column align="center" label="奖池编号" width="100" fixed>
        <template slot-scope="scope">
          <span v-if="scope.row.def === 1">
            <a @click="handleRowClick(true, scope.row.id)" style="color:#409eff">默认奖池</a>
          </span>
          <span v-else>
            <a @click="handleRowClick(false, scope.row.id)" style="color:#409eff">{{scope.row.id}}</a>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="def" label="默认奖池" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.def === 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="prize" label="奖池金额" width="160">
        <template slot-scope="scope">
          {{scope.row.prize | goldToMoney}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="携带金币" width="400" >
        <template slot-scope="scope">
          <span v-if="scope.row.def === 0">{{scope.row.lower | goldToMoney}} ~ {{scope.row.upper | goldToMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="strategy" label="策略" width="160"/>
      <el-table-column label="操作">
        <template slot-scope="scope" v-if="hasPermission('D0102')">
          <el-button size="small" @click="handleModPrizePoolGold(scope.row.def, scope.row.prize, scope.row.id)">修改奖池</el-button>
          <el-button size="small" @click="handleAppendPrizePoolGold(scope.row.def, scope.row.id)">追加奖池</el-button>
          <el-button v-if="scope.row.def === 0" size="small" @click="handleModGoldRange(scope.row)">修改携带金币</el-button>
          <el-button size="small" type="danger" @click="handleDelPrizePool(scope.row.def, scope.row.id)">删除</el-button>
          <el-button size="small" type="primary" @click="handleOpenAddStrategy(scope.row.def, scope.row.id)">添加策略</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 策略  奖池范围  获胜难度  提取金币  提取比例  提取时间  操作 -->
    <el-table :key="strategyKey" size="mini" :data="curPrizePool.strategys" border fit style="width:100%;margin-top:30px;">
      <el-table-column align="center" label="策略编号"    width="120" fixed>
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="range" label="奖池范围" width="400" >
        <template slot-scope="scope">
          {{scope.row.lower | goldToMoney}} ~ {{scope.row.upper | goldToMoney}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="control.difficulty" :formatter="difficultyName" label="获胜难度" width="100">
      </el-table-column>
      <el-table-column align="center" prop="gold" label="提取金币" width="120">
        <template slot-scope="scope">
          {{scope.row.gold | goldToMoney}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="ratio"  label="提取比例" width="100">
         <template slot-scope="scope">
          {{scope.row.ratio}}%
        </template>
      </el-table-column>
      <el-table-column align="center" prop="time"  label="提取时间" width="100"/>
      <el-table-column align="center" prop="withdrawType"  label="提取方式" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.withdrawType === 0">金币</span>
          <span v-if="scope.row.withdrawType === 1">比例</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" v-if="hasPermission('D0102')">
          <el-button size="small" type="danger" @click="handleDelStrategy(scope.row.id)">删除</el-button>
          <el-button size="small" type="primary" @click="handleOpenEditStrategy(scope.row)" >修改</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加金币奖池 -->
    <el-dialog :title="addPool.title" :visible.sync="addPool.visible">
      <el-form :model="addPool.pool" :rules="addPoolRules" ref="addPoolForm" label-width="250px" class="number-hide">
        <el-form-item label="奖池金额" prop="prizePools">
          <el-input size="small" style="width:160px" v-model.number="addPool.pool.prizePools" type="number" clearable/>
        </el-form-item>
        <el-form-item label="携带金币">
          <el-col :span="7">
            <el-form-item prop="lower">
              <el-input size="small" style="width:160px" v-model.number="addPool.pool.lower" type="number" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="1">~</el-col> 
          <el-col :span="8">
            <el-form-item prop="upper">
              <el-input size="small" style="width:160px" v-model.number="addPool.pool.upper" type="number" clearable/>
            </el-form-item>
          </el-col>
        </el-form-item>
        
        <el-form-item style="margin-top:40px">
          <el-button size="small" @click.native="addPool.visible = false">取消</el-button>
          <el-button size="small" type="primary" @click.native="handleAddGoldPrizePool">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

     <!-- 修改携带金币 -->
     <el-dialog :title="changeRange.title" :visible.sync="changeRange.visible">
      <el-form :model="changeRange.pool" :rules="changeRangeRules" ref="changeRangeForm" label-width="250px" class="number-hide">
        <el-form-item label="携带金币">
          <el-col :span="7">
            <el-form-item prop="lower">
              <el-input size="small" style="width:160px" v-model.number="changeRange.pool.lower" type="number" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="1">~</el-col> 
          <el-col :span="8">
            <el-form-item prop="upper">
              <el-input size="small" style="width:160px" v-model.number="changeRange.pool.upper" type="number" clearable/>
            </el-form-item>
          </el-col>
        </el-form-item>
        
        <el-form-item style="margin-top:40px">
          <el-button size="small" @click.native="changeRange.visible = false">取消</el-button>
          <el-button size="small" type="primary" @click.native="handleChangePrizePoolRange">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    

    <!-- 添加策略 -->
    <el-dialog :title="addStrategy.title" :visible.sync="addStrategy.visible">
      <el-form :model="addStrategy.strategy" :rules="addStrategyRules" ref="addStrategyForm" label-width="280px" class="number-hide">
        <el-form-item label="奖池范围">
          <el-col :span="7">
            <el-form-item prop="lower">
              <el-input size="small" style="width:160px" v-model.number="addStrategy.strategy.lower" type="number" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="1">~</el-col>
          <el-col :span="8">
            <el-form-item prop="upper">
              <el-input size="small" style="width:160px" v-model.number="addStrategy.strategy.upper" type="number" 
              :min="addStrategy.strategy.lower" clearable/>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="提取金币" prop="gold">
          <el-input size="small" style="width:160px" v-model.number="addStrategy.strategy.gold" type="number" clearable/>
          <el-radio style="margin-left:35px" v-model="addStrategy.strategy.withdrawType" :label="0">启用</el-radio>
        </el-form-item>
        <el-form-item label="提取比例" prop="ratio">
          <el-input size="small" style="width:160px" v-model.number="addStrategy.strategy.ratio" type="number" min="0" max="100" clearable/>
          <span style="margin-left:5px">%</span>
          <el-radio style="margin-left:15px" v-model="addStrategy.strategy.withdrawType" :label="1">启用</el-radio>
        </el-form-item>
        <el-form-item label="提取时间" prop="time">
          <el-input size="small" style="width:160px" v-model.number="addStrategy.strategy.time" type="number" :max="100" clearable/>
          <span style="margin-left:5px">分钟</span>
        </el-form-item>
        <el-form-item label="获胜难度">
          <el-select size="small" style="width:180px" placeholder="请选择" v-model="addStrategy.strategy.control.difficulty">
            <el-option v-for="item in difficultOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-top:40px">
          <el-button size="small" @click.native="addStrategy.visible = false">取消</el-button>
          <el-button size="small" type="primary" @click.native="handleAddStrategy">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { getGameList, getRoomList } from "@/api/games";
import { goldToMoneyNotFixed, moneyToGold, goldToMoney, isGoldLegal, isExtractGoldLegal } from "@/filters"
import {
  findStallList
} from "@/api/common";
import { hasPermission } from "@/utils/auth"
import {
  findPrizePoolList,
  findDefPrizePool,
  findGoldPrizePool
} from "@/api/control/gamectrl";
// 默认奖池
import {
  addDefPrizePool,
  appendDefPrizePoolGold,
  modDefPrizePoolGold,
  delDefPrizePool,
  addDefPrizePoolStrategy,
  modDefPrizePoolStrategy,
  delDefPrizePoolStrategy
} from "@/api/control/gamectrl";
// 金币奖池
import {
  addGoldPrizePool,
  appendGoldPrizePoolGold,
  modGoldPrizePoolGold,
  modGoldPrizePoolRange,
  delGoldPrizePool,
  addGoldPrizePoolStrategy,
  modGoldPrizePoolStrategy,
  delGoldPrizePoolStrategy
} from "@/api/control/gamectrl";

export default {
  name: "fruitsoltControl",
  data() {
    var validateStrategyUpper = (rule, value, callback) => {
      let ret = isGoldLegal(value);
      if(typeof ret === 'boolean') {
        if (this.addStrategy.strategy.upper < this.addStrategy.strategy.lower) {
          callback(new Error("最高奖池数必须大于最低奖池数"));
        }
        callback();
      }
      callback(new Error(ret));
    };
    // 携带金币
    var validatePrizeUpper = (rule, value, callback) => {
      let ret = isExtractGoldLegal(value);
      if(typeof ret === 'boolean') {
        if (this.addPool.pool.upper < this.addPool.pool.lower) {
          callback(new Error("最高携带数必须大于最低携带数数"));
        }
        callback();
      }
      callback(new Error(ret));
    };
    // 修改携带金币
    var validateChangeRangeUpper = (rule, value, callback) => {
      let ret = isExtractGoldLegal(value);
      if(typeof ret === 'boolean') {
        if (this.changeRange.pool.upper < this.changeRange.pool.lower) {
          callback(new Error("最高携带数必须大于最低携带数数"));
        }
        callback();
      }
      callback(new Error(ret));
    };
    var validateGold = (rule, value, callback) => {
      let ret = isGoldLegal(value);
      if(typeof ret === 'boolean') {
        callback();
      }
      callback(new Error(ret));
    };
    var validateExtractGold = (rule, value, callback) => {
      let ret = isExtractGoldLegal(value);
      if(typeof ret === 'boolean') {
        callback();
      }
      callback(new Error(ret));
    };
    return {
      prizePoolKey: 1,
      poolList: null, // 奖池列表
      strategyKey: 2,
      curPrizePool: {
        // 当前奖池
        id: undefined,
        def: 0,
        strategys: null
      },
      hasDefPool: false,
      loading: false,
      totalSize: 0,
      gameId: 23,
      roomId: undefined,
      roomOptions: null,
      difficultOptions: null,
      // 添加奖池
      addPool: {
        title: "新增金币奖池",
        visible: false,
        pool: null,
        init: function() {
          this.isAdd = true;
          this.pool = {
            prizePools: 0,
            lower: 0,
            upper: 0
          };
        }
      },
      addPoolRules: {
        lower: [
          { type: "number", trigger: "blur", validator: validateExtractGold }
        ],
        upper: [{ validator: validatePrizeUpper, trigger: "blur" }],
        prizePools: [
          { type: "number", trigger: "blur", validator: validateGold }
        ]
      },
      changeRange: {
        title: "修改携带金币",
        visible: false,
        pool: null,
        init: function(id, lower, upper) {
          this.pool = {
            prizePoolId: id,
            lower: goldToMoneyNotFixed(lower),
            upper: goldToMoneyNotFixed(upper)
          };
        }
      },
      changeRangeRules: {
        lower: [
          { type: "number", trigger: "blur", validator: validateExtractGold }
        ],
        upper: [{ validator: validateChangeRangeUpper, trigger: "blur" }]
      },
      addStrategy: {
        title: "添加策略",
        visible: false,
        isEdit: false,
        def: 0,
        prizePoolId: "",
        strategy: null,
        init: function() {
          this.prizePoolId = "";
          this.def = 0;
          this.strategy = {
            gold: 0,
            lower: -999,
            ratio: 10,
            time: 60,
            control: {
              difficulty: 1
            },
            upper: 1000,
            withdrawType: 0
          };
        },
        init_1: function(strategy) {
          this.prizePoolId = "";
          this.def = 0;
          this.strategy = {
            id: strategy.id,
            gold: goldToMoneyNotFixed(strategy.gold),
            lower: goldToMoneyNotFixed(strategy.lower),
            ratio: strategy.ratio,
            time: strategy.time,
            control: strategy.control,
            upper: goldToMoneyNotFixed(strategy.upper),
            withdrawType: strategy.withdrawType
          };
        }
      },
      addStrategyRules: {
        lower: [
          { type: "number", trigger: "blur", validator: validateGold }
        ],
        upper: [{ validator: validateStrategyUpper, trigger: "blur" }],
        gold: [
          { type: "number", trigger: "blur", validator: validateExtractGold }
        ],
        ratio: [
          {
            type: "number",
            min: 0,
            max: 100,
            message: "请输入0-100之间的提取比例",
            trigger: "blur"
          }
        ],
        time: [
          {
            type: "number",
            min: 0,
            message: "请输入正提取时间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.addPool.init();
    this.addStrategy.init();
    this.changeRange.init(0, 0, 0);
    this.findConfig();
  },
  methods: {
    hasPermission:hasPermission,
    // 获取配置
    findConfig() {
      this.loading = true;

      this.findRoomList();
      findStallList(this.gameId)
        .then(res => {
          this.difficultOptions = res.map.difficultList;
        })
        .catch(() => {});
    },
    findRoomList() {
      this.loading = true;
      getRoomList({ gameId: this.gameId, active: 1 })
        .then(res => {
          this.roomOptions = res.map.list;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    difficultyName(row) {
      if (this.difficultOptions) {
        for (let i = 0; i < this.difficultOptions.length; i++) {
          if (this.difficultOptions[i].id == row.control.difficulty) {
            return this.difficultOptions[i].name;
          }
        }
      }
      return undefined;
    },
    // 获取奖池
    findPoolList(func) {
      this.loading = true;
      this.curPrizePool.strategys = [];
      findPrizePoolList(this.gameId, this.roomId)
        .then(res => {
          if (res.map.result) {
            let def = res.map.result.defaultPrizePool;
            let golds = res.map.result.goldPrizePoolGroups;
            this.poolList = [];
            if (def) {
              this.hasDefPool = true;
              def.def = 1;
              def.strategy = 0;
              if (def.strategys) {
                def.strategy = def.strategys.length;
              }
              this.poolList.push(def);
            } else {
              this.hasDefPool = false;
            }
            if (golds) {
              for (let i = 0; i < golds.length; i++) {
                let pool = golds[i];
                pool.def = 0;
                pool.strategy = 0;
                if (pool.strategys) {
                  pool.strategy = pool.strategys.length;
                }
                this.poolList.push(pool);
              }
            }
            if(func) {
              func();
            }
          } else {
            this.hasDefPool = false;
            this.poolList = [];
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    findDefPrizePoolInfo() {
      this.loading = true;
      findDefPrizePool(this.gameId, this.roomId)
        .then(res => {
          this.loading = false;
          this.convertPrizePoolStrategys(res.map.result);
          this.curPrizePool.def = 1;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    findGoldPrizePoolInfo(prizePoolId) {
      this.loading = true;
      findGoldPrizePool(this.gameId, this.roomId, prizePoolId)
        .then(res => {
          this.loading = false;
          this.convertPrizePoolStrategys(res.map.result);
          this.curPrizePool.def = 0;
          this.curPrizePool.id = prizePoolId;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    convertPrizePoolStrategys(prizePool) {
      if (!prizePool) {
        return;
      }
      for (let i = 0; i < prizePool.strategys.length; i++) {
        prizePool.strategys[i].control = JSON.parse(
          prizePool.strategys[i].control
        );
      }
      this.curPrizePool = prizePool;
    },
    resetCurPrizePool() {
      this.curPrizePool = {
        // 当前奖池
        id: undefined,
        def: 0,
        strategys: null
      };
    },
    // 房间选择
    handleRoomChange(val) {
      this.findPoolList(()=>{
          if(this.curPrizePool && (this.curPrizePool.id || this.curPrizePool.def == 1)) {
            if(this.curPrizePool.def == 1) {
              this.findDefPrizePoolInfo();
            } else if(this.curPrizePool.id) {
              this.findGoldPrizePoolInfo(this.curPrizePool.id);
            }
          } else {
            if(this.poolList && this.poolList.length > 0) {
              let p = this.poolList[0];
              if(p) {
                if(p.def == 1) {
                  this.findDefPrizePoolInfo();
                } else if(p.id) {
                  this.findGoldPrizePoolInfo(p.id);
                }
              }
            }
        }
      });
    },
    // 添加奖池
    handleAddPrizePool(isDef) {
      this.addPool.init();
      if (isDef) {
        this.addPool.pool.def = 1;
        this.$prompt("请输入奖池金额", "添加默认奖池", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^-?[0-9]+.?[0-9]*$/,
          inputValidator: isGoldLegal,
          inputErrorMessage: "请输入整数"
        })
          .then(({ value }) => {
            this.handleAddDefPrizePool(moneyToGold(value));
          })
          .catch(() => {});
      } else {
        this.addPool.visible = true;
        this.addPool.isAdd = true;
      }
    },
    handleAddDefPrizePool(prize) {
      this.loading = true;
      addDefPrizePool(this.gameId, this.roomId, prize)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.findPoolList();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 添加金币奖池
    handleAddGoldPrizePool() {
      this.$refs.addPoolForm.validate(valid => {
        if (valid) {
          this.addPool.pool.gameId = this.gameId;
          this.addPool.pool.roomId = this.roomId;
          this.loading = true;
          let pool = {
              gameId: this.gameId,
              roomId: this.roomId,
              prizePools: moneyToGold(this.addPool.pool.prizePools),
              lower: moneyToGold(this.addPool.pool.lower),
              upper: moneyToGold(this.addPool.pool.upper)
          }
          addGoldPrizePool(pool)
            .then(res => {
              this.loading = false;
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.addPool.visible = false;
              this.findPoolList();
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    _appendDefPrizePoolGold(gold) {
      this.loading = true;
      appendDefPrizePoolGold(this.gameId, this.roomId, gold)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "追加成功",
            type: "success"
          });
          this.findPoolList();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    _modDefPrizePoolGold(gold) {
      this.loading = true;
      modDefPrizePoolGold(this.gameId, this.roomId, gold)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.findPoolList();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    _appendGoldPrizePoolGold(gold, id) {
      this.loading = true;
      appendGoldPrizePoolGold(this.gameId, this.roomId, id, gold)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "追加成功",
            type: "success"
          });
          this.findPoolList();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    _modGoldPrizePoolGold(gold, id) {
      this.loading = true;
      modGoldPrizePoolGold(this.gameId, this.roomId, id, gold)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.findPoolList();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 修改奖池
    handleModPrizePoolGold(isDef, gold, id) {
      this.$prompt("请输入奖池金额", "修改奖池", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: goldToMoneyNotFixed(gold),
        inputPattern: /^-?[0-9]+.?[0-9]*$/,
        inputValidator: isGoldLegal,
        inputErrorMessage: "请输入整数"
      })
        .then(({ value }) => {
          if (isDef == 1) {
            this._modDefPrizePoolGold(moneyToGold(value));
          } else {
            if (id) {
              this._modGoldPrizePoolGold(moneyToGold(value), id);
            }
          }
        })
        .catch(() => {});
    },
    // 追加奖池
    handleAppendPrizePoolGold(isDef, id) {
      this.$prompt("请输入奖池金额", "追加奖池", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^-?[0-9]+.?[0-9]*$/,
        inputValidator: isGoldLegal,
        inputErrorMessage: "请输入整数"
      })
        .then(({ value }) => {
          if (isDef == 1) {
            this._appendDefPrizePoolGold(moneyToGold(value));
          } else {
            if (id) {
              this._appendGoldPrizePoolGold(moneyToGold(value), id);
            }
          }
        })
        .catch(() => {});
    },
    // 修改携带金币
    handleModGoldRange(prizePool) {
      this.changeRange.init(prizePool.id, prizePool.lower, prizePool.upper);
      this.changeRange.visible = true;
    },
    handleChangePrizePoolRange() {
      this.$refs.changeRangeForm.validate(valid => {
        if (valid) {
          this.changeRange.pool.gameId = this.gameId;
          this.changeRange.pool.roomId = this.roomId;
          this.loading = true;
          let pool = {
              gameId: this.gameId,
              roomId: this.roomId,
              prizePoolId: this.changeRange.pool.prizePoolId,
              lower: moneyToGold(this.changeRange.pool.lower),
              upper: moneyToGold(this.changeRange.pool.upper)
          }
          modGoldPrizePoolRange(pool)
            .then(res => {
              this.loading = false;
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.changeRange.visible = false;
              this.findPoolList();
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    // 删除奖池
    handleDelPrizePool(def, id) {
      if (def == 1) {
        this.$confirm("是否删除【默认奖池】?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.loading = true;
            delDefPrizePool(this.gameId, this.roomId)
              .then(res => {
                this.loading = false;
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.findPoolList();
                if (this.curPrizePool.def == 1) {
                  this.resetCurPrizePool();
                }
              })
              .catch(() => {
                this.loading = false;
              });
          })
          .catch(() => {});
      } else {
        this.$confirm("是否删除【金币奖池" + id + "】?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.loading = true;
            delGoldPrizePool(this.gameId, this.roomId, id)
              .then(res => {
                this.loading = false;
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.findPoolList();
                if (this.curPrizePool.id == id) {
                  this.resetCurPrizePool();
                }
              })
              .catch(() => {
                this.loading = false;
              });
          })
          .catch(() => {});
      }
    },
    // 获取奖池策略
    handleRowClick(isDef, id) {
      if (isDef) {
        this.findDefPrizePoolInfo();
      } else {
        if (id) {
          this.findGoldPrizePoolInfo(id);
        }
      }
    },
    // 删除策略
    handleDelStrategy(id) {
      if (!this.curPrizePool) {
        return;
      }
      // 删除默认奖池策略
      if (this.curPrizePool.def == 1) {
        this.$confirm("是否删除【默认奖池】【策略" + id + "】?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.loading = true;
            delDefPrizePoolStrategy(this.gameId, this.roomId, id)
              .then(res => {
                this.loading = false;
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.findPoolList();
                this.findDefPrizePoolInfo();
              })
              .catch(() => {
                this.loading = false;
              });
          })
          .catch(() => {});
      } else {
        this.$confirm(
          "是否删除【金币奖池" + this.curPrizePool.id + "】【策略" + id + "】?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.loading = true;
            delGoldPrizePoolStrategy(
              this.gameId,
              this.roomId,
              this.curPrizePool.id,
              id
            )
              .then(res => {
                this.loading = false;
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.findPoolList();
                this.findGoldPrizePoolInfo(this.curPrizePool.id);
              })
              .catch(() => {
                this.loading = false;
              });
          })
          .catch(() => {});
      }
    },
    //
    handleOpenAddStrategy(def, prizePoolId) {
      this.addStrategy.visible = true;
      this.addStrategy.init();
      this.addStrategy.def = def;
      this.addStrategy.prizePoolId = prizePoolId;
      this.curPrizePool.def = def;
      this.curPrizePool.id = prizePoolId;
      this.addStrategy.title = "添加策略";
      this.addStrategy.isEdit = false;
    },
    handleOpenEditStrategy(strategy) {
      this.addStrategy.visible = true;
      this.addStrategy.prizePoolId = this.curPrizePool.id;
      this.addStrategy.init_1(strategy);
      this.addStrategy.def = this.curPrizePool.def;
      this.addStrategy.prizePoolId = this.curPrizePool.id;
      this.addStrategy.title = "修改策略";
      this.addStrategy.isEdit = true;
    },
    _handleDefPrizePoolStrategy(isEdit, func) {
      if (isEdit) {
        modDefPrizePoolStrategy(
          this.gameId,
          this.roomId,
          this.addStrategy.strategy
        )
          .then(res => {
            this.loading = false;
            func();
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.findPoolList();
            if (this.curPrizePool && this.curPrizePool.def == 1) {
              this.findDefPrizePoolInfo();
            }
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.loading = true;
        addDefPrizePoolStrategy(
          this.gameId,
          this.roomId,
          this.addStrategy.strategy
        )
          .then(res => {
            this.loading = false;
            func();
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.findPoolList();
            if (this.curPrizePool && this.curPrizePool.def == 1) {
              this.findDefPrizePoolInfo();
            }
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    _handleGoldPrizePoolStrategy(isEdit, func) {
      if (isEdit) {
        modGoldPrizePoolStrategy(
          this.gameId,
          this.roomId,
          this.addStrategy.prizePoolId,
          this.addStrategy.strategy
        )
          .then(res => {
            this.loading = false;
            func();
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.findPoolList();
            if (this.curPrizePool.id == this.addStrategy.prizePoolId) {
              this.findGoldPrizePoolInfo(this.curPrizePool.id);
            }
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.loading = true;
        addGoldPrizePoolStrategy(
          this.gameId,
          this.roomId,
          this.addStrategy.prizePoolId,
          this.addStrategy.strategy
        )
          .then(res => {
            this.loading = false;
            func();
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.findPoolList();
            if (this.curPrizePool.id == this.addStrategy.prizePoolId) {
              this.findGoldPrizePoolInfo(this.curPrizePool.id);
            }
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    // 添加策略
    handleAddStrategy() {
      this.$refs.addStrategyForm.validate(valid => {
        if (valid) {
          // 默认奖池策略
          if (this.addStrategy.def == 1) {
            this._handleDefPrizePoolStrategy(this.addStrategy.isEdit, () => {
              this.addStrategy.visible = false;
            });
          } else {
            // 金币奖池策略
            this._handleGoldPrizePoolStrategy(this.addStrategy.isEdit, () => {
              this.addStrategy.visible = false;
            });
          }
        }
      });
    },
    handleRefreshPrizePool() {
      this.handleRoomChange();
    }
  }
};
</script>