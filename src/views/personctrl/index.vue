<template>
  <div class="app-container calendar-list-container" v-loading="loading">
    <div class="filter-container">
     游戏：<el-select size="small" @change="handleGameChange" style="width:180px" placeholder="请选择" v-model="pageQuery.gameId" clearable>
        <el-option v-for="item in gameOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id"/>
      </el-select>
      房间：<el-select size="small" style="width:180px" placeholder="请选择" v-model="pageQuery.roomId" clearable>
        <el-option v-for="item in roomOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id"/>
      </el-select>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearechPlayers">查询</el-button>
    </div>
    <!-- 玩家ID  昵称  位置  金币  保险箱 今天输赢  昨天输赢  控制状态  控制剩余 -->
    <el-table size="mini" :key="playerKey" :data="playerList" border fit style="width: 100%">
      <el-table-column align="center" prop="playerId" label="玩家ID" width="120" fixed>
        <template slot-scope="scope">
          <a style="color:#409eff" @click="handleSelectPlayer(scope.row.playerId)">{{scope.row.playerId}}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="nickName" label="昵称" width="120"/>
      <el-table-column align="center" prop="gold" label="金币" width="160">
        <template slot-scope="scope">
          {{scope.row.gold | goldToMoney}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="safeGold" label="保险箱金币" width="160">
        <template slot-scope="scope">
          {{scope.row.safeGold | goldToMoney}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="todayBetResult"     label="今天输赢" width="160">
        <template slot-scope="scope">
          {{scope.row.todayBetResult | goldToMoney}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="yesTodayBetResult" label="昨天输赢" width="160">
        <template slot-scope="scope">
          {{scope.row.yesTodayBetResult | goldToMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="prizeTotal"   label="奖池总额">
        <template slot-scope="scope">
          {{scope.row.prizeTotal | goldToMoney}}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" align="right">
      <el-pagination size="mini" background @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" :current-page.sync="pageQuery.page"
        :page-size="pageQuery.pageSize" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>

    <div class="filter-container">
      玩家ID：<el-input type="number" :maxlength="10" v-model="query.playerId" class="number-hide" size="small" style="width:180px;" placeholder="玩家ID" clearable/>
      玩家昵称：<el-input :maxlength="15" size="small" v-model="query.nickName" style="width:180px;" placeholder="玩家昵称" clearable/>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchPlayerCtrls">查询</el-button>
    </div>
    <div class="filter-container" v-show="playerInfo.isShow">
      <div class="info-class">
        <div class="title">用户信息</div>
        <el-row class="el-row">
         <el-col :span="4" style="color:#555555">
           用户ID：{{playerInfo.playerId}}
         </el-col>
          <el-col :span="4" style="color:#555555">
            昵称：{{playerInfo.nickName}}
          </el-col>
          <el-col :span="4" style="color:#555555">
            金币：{{playerInfo.gold | goldToMoney}}
          </el-col>
          <el-col :span="4" style="color:#555555">
            保险箱金币：{{playerInfo.safeGold | goldToMoney}}
          </el-col>
        </el-row>
        <el-row class="el-row">
          <el-col :span="4" style="color:#555555">
            今天输赢：{{playerInfo.todayBetResult | goldToMoney}}
          </el-col>
          <el-col :span="4" style="color:#555555">
            昨天输赢：{{playerInfo.yesTodayBetResult | goldToMoney}}
          </el-col>
          <el-col :span="4" style="color:#555555">
            奖池总额：{{playerInfo.prizeTotal | goldToMoney}}
          </el-col>
        </el-row>
      </div>
      <!-- 控制信息 -->
      <div style="height:30px;"></div>
      <div style="margin-top:10px" class="filter-container">
        <div class="controlbox" v-if="hasShz">
          <div class="gameName">水浒传</div>
          <div class="gameControl">
            <table>
              <tbody>
                <tr>
                  <td width="340px">
                    奖池金额：
                    <el-input type="number" class="number-hide" size="small" style="width:140px;" 
                      v-model="gameCtrl.shuihu.control.prizePools"/> 
                    <el-button v-show="gameCtrl.shuihu.def === 0 && hasPermission('C0102')" size="small" type="primary" 
                      @click="handleModShuihuPrize">修改</el-button>
                  </td>
                  <td width="340px">
                    难易程度: 
                    <el-select size="small" style="width:120px;" v-model="gameCtrl.shuihu.control.difficulty">
                      <el-option v-for="item in gameCtrl.shuihu.difficultList"
                        :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select>
                    <el-button v-if="gameCtrl.shuihu.def === 0 && hasPermission('C0102')" size="small" type="primary"
                      @click="handleModShuihuDifficulty">修改</el-button> 
                    <el-button v-if="gameCtrl.shuihu.def === 1 && hasPermission('C0102')" size="small" type="primary" 
                      @click="handleAddShuihuCtrl">新增</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="controlbox" v-if="hasFruitslot">
            <div class="gameName">水果拉霸</div>
            <div class="gameControl">
              <table>
                <tbody>
                  <tr>
                    <td width="340px">
                      奖池金额：
                      <el-input class="number-hide" type="number" size="small" style="width:140px;" 
                        v-model="gameCtrl.laba.control.prizePools"/> 
                      <el-button v-show="gameCtrl.laba.def === 0 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleModLabaPrize">修改</el-button>
                    </td>
                    <td width="340px">
                      难易程度: 
                      <el-select size="small" style="width:120px;" 
                        v-model="gameCtrl.laba.control.difficulty">
                          <el-option v-for="item in gameCtrl.laba.difficultList"
                            :key="item.id" :label="item.name" :value="item.id"/>
                      </el-select>
                      <el-button v-if="gameCtrl.laba.def === 0 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleModLabaDifficulty">修改</el-button> 
                      <el-button v-if="gameCtrl.laba.def === 1 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleAddLabaCtrl">新增</el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
        <div class="controlbox" v-if="hasSiren">
            <div class="gameName">四人牛牛</div>
            <div class="gameControl">
              <table>
                <tbody>
                  <tr>
                    <td width="340px">
                      奖池金额：
                      <el-input class="number-hide" type="number" size="small" style="width:140px;" 
                        v-model="gameCtrl.srnn.control.prizePools"/> 
                      <el-button v-show="gameCtrl.srnn.def === 0 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleModSrnnPrize">修改</el-button>
                    </td>
                    <td width="340px">
                      赢的概率: 
                      <el-input class="number-hide" type="number" size="small" style="width:140px;" 
                        v-model="gameCtrl.srnn.control.winRatio"/> 
                      <el-button v-if="gameCtrl.srnn.def === 0 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleModSrnnRate">修改</el-button> 
                      <el-button v-if="gameCtrl.srnn.def === 1 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleAddSrnnCtrl">新增</el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
        <div class="controlbox" v-if="hasErren">
            <div class="gameName">二人牛牛</div>
            <div class="gameControl">
              <table>
                <tbody>
                  <tr>
                    <td width="340px">
                      奖池金额：
                      <el-input class="number-hide" type="number" size="small" style="width:140px;" 
                        v-model="gameCtrl.ernn.control.prizePools"/> 
                      <el-button v-show="gameCtrl.ernn.def === 0 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleModErnnPrize">修改</el-button>
                    </td>
                    <td width="340px">
                      赢的概率: 
                      <el-input class="number-hide" type="number" size="small" style="width:140px;" 
                        v-model="gameCtrl.ernn.control.winRatio"/> 
                      <el-button v-if="gameCtrl.ernn.def === 0 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleModErnnRate">修改</el-button> 
                      <el-button v-if="gameCtrl.ernn.def === 1 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleAddErnnCtrl">新增</el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
        <div class="controlbox" v-if="hasLkpy">
          <div class="gameName">
            李逵劈鱼
          </div>
          <div class="gameControl">
            <table>
              <tbody>
                <tr>
                  <td>
                    奖池金额:
                  </td>
                  <td width="140">
                    <el-input v-model="gameCtrl.lkby.control.prizePools" class="number-hide" type="number" 
                    size="small" style="width:140px;"/> 
                  </td>
                  <td v-if="hasPermission('C0102')">
                    <el-button v-if="gameCtrl.lkby.def === 1" size="small" type="primary" @click="handleAddLkbyCtrl">新增</el-button>
                    <el-button v-if="gameCtrl.lkby.def === 0" size="small" type="primary" @click="handleModLkbyPrize">修改金额</el-button>
                    <el-button v-if="gameCtrl.lkby.def === 0" size="small" type="primary" 
                      @click="handleSaveLkbyDifficulty">保存范围</el-button>
                    <el-button v-if="gameCtrl.lkby.def === 0" size="small" type="primary" 
                      @click="handleAddLkbyDifficulty">新增范围</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <table v-if="gameCtrl.lkby.def === 0">
              <tbody>
                <tr v-for="(item,index) in gameCtrl.lkby.control.difficultys" :key="index">
                  <td>鱼的倍数：</td>
                  <td width="190">
                    <el-input v-model="item.multipleLower" class="number-hide" type="number" size="small" style="width:80px;"/> 
                     --
                    <el-input v-model="item.multipleUpper" class="number-hide" type="number" size="small" style="width:80px;"/> 
                  </td>
                  <td>难易程度: </td>
                  <td width="190">
                    <el-select size="small" style="width:120px;" v-model="item.difficulty">
                      <el-option v-for="item in gameCtrl.lkby.difficultList"
                        :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select> 
                  </td>
                  <td><el-button v-if="hasPermission('C0102')" size="small" @click="handleDelLkbyDifficulty(index)" 
                      type="danger">删除</el-button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="controlbox" v-if="hasJcby">
          <div class="gameName">
            金蟾捕鱼
          </div>
          <div class="gameControl">
            <table>
              <tbody>
                <tr>
                  <td>
                    奖池金额:
                  </td>
                  <td width="140">
                    <el-input v-model="gameCtrl.jcby.control.prizePools" class="number-hide" type="number" 
                    size="small" style="width:140px;"/> 
                  </td>
                  <td v-if="hasPermission('C0102')">
                    <el-button v-if="gameCtrl.jcby.def === 1" size="small" type="primary" @click="handleAddJcbyCtrl">新增</el-button>
                    <el-button v-if="gameCtrl.jcby.def === 0" size="small" type="primary" @click="handleModJcbyPrize">修改金额</el-button>
                    <el-button v-if="gameCtrl.jcby.def === 0" size="small" type="primary" 
                      @click="handleSaveJcbyDifficulty">保存范围</el-button>
                    <el-button v-if="gameCtrl.jcby.def === 0" size="small" type="primary" 
                      @click="handleAddJcbyDifficulty">新增范围</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <table v-if="gameCtrl.jcby.def === 0">
              <tbody>
                <tr v-for="(item,index) in gameCtrl.jcby.control.difficultys" :key="index">
                  <td>鱼的倍数：</td>
                  <td width="190">
                    <el-input v-model="item.multipleLower" class="number-hide" type="number" size="small" style="width:80px;"/> 
                     --
                    <el-input v-model="item.multipleUpper" class="number-hide" type="number" size="small" style="width:80px;"/> 
                  </td>
                  <td>难易程度：</td>
                  <td width="190">
                    <el-select size="small" style="width:120px;" v-model="item.difficulty">
                      <el-option v-for="item in gameCtrl.jcby.difficultList"
                        :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select> 
                  </td>
                  <td><el-button v-if="hasPermission('C0102')" size="small" @click="handleDelJcbyDifficulty(index)" 
                    type="danger">删除</el-button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="controlbox" v-if="hasZjh">
            <div class="gameName">炸金花</div>
            <div class="gameControl">
              <table>
                <tbody>
                  <tr>
                    <td width="340px">
                      奖池金额：
                      <el-input class="number-hide" type="number" size="small" style="width:140px;" 
                        v-model="gameCtrl.zjh.control.prizePools"/> 
                      <el-button v-show="gameCtrl.zjh.def === 0 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleModZjhPrize">修改</el-button>
                    </td>
                    <td width="340px">
                      赢的概率: 
                      <el-input class="number-hide" type="number" size="small" style="width:140px;" 
                        v-model="gameCtrl.zjh.control.winRatio"/> 
                      <el-button v-if="gameCtrl.zjh.def === 0 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleModZjhRate">修改</el-button> 
                      <el-button v-if="gameCtrl.zjh.def === 1 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleAddZjhCtrl">新增</el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
        <div class="controlbox" v-if="hasBrnn">
            <div class="gameName">百人牛牛</div>
            <div class="gameControl">
              <table>
                <tbody>
                  <tr>
                    <td width="340px">
                      奖池金额：
                      <el-input class="number-hide" type="number" size="small" style="width:140px;" 
                        v-model="gameCtrl.brnn.control.prizePools"/> 
                      <el-button v-show="gameCtrl.brnn.def === 0 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleModBrnnPrize">修改</el-button>
                    </td>
                    <td width="340px">
                      赢的概率: 
                      <el-input class="number-hide" type="number" size="small" style="width:140px;" 
                        v-model="gameCtrl.brnn.control.winRatio"/> 
                      <el-button v-if="gameCtrl.brnn.def === 0 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleModBrnnRate">修改</el-button> 
                      <el-button v-if="gameCtrl.brnn.def === 1 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleAddBrnnCtrl">新增</el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
        <div class="controlbox" v-if="hasBjl">
            <div class="gameName">百家乐</div>
            <div class="gameControl">
              <table>
                <tbody>
                  <tr>
                    <td width="340px">
                      奖池金额：
                      <el-input class="number-hide" type="number" size="small" style="width:140px;" 
                        v-model="gameCtrl.bjl.control.prizePools"/> 
                      <el-button v-show="gameCtrl.bjl.def === 0 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleModBjlPrize">修改</el-button>
                    </td>
                    <td width="340px">
                      赢的概率: 
                      <el-input class="number-hide" type="number" size="small" style="width:140px;" 
                        v-model="gameCtrl.bjl.control.winRatio"/> 
                      <el-button v-if="gameCtrl.bjl.def === 0 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleModBjlRate">修改</el-button> 
                      <el-button v-if="gameCtrl.bjl.def === 1 && hasPermission('C0102')" size="small" type="primary" 
                        @click="handleAddBjlCtrl">新增</el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>

    
  </div>
</template>

<style>
  .controlbox {
    height: auto;
    min-height: 32px;
    font-size: 12px;
    padding-top: 5px;
  }
  .gameName {
    width: 120px;
    float: left;
    margin-top: 10px;
    font-weight: bold;
    font-size: 14px;
  }
  .gameControl {
    margin-left: 120px;
    min-width: 300px;
  }
  .info-class {
    margin-top: 10px;
    width: 100%;
    height:100px;
    background: #f9fafc;
    size:small;
  }
  .title{
    padding-top: 10px;
    margin-left: 10px;
    margin-bottom: 5px;
  }
  .el-row {
    margin-left:10px;
    margin-top:15px;
  }
</style>

<script>

import { findPlayerList, getPlayerCtrlInfo, addCtrl, updatePrize, updateCtrl } from "@/api/control/personctrl"
import { getGameList, getRoomList } from "@/api/games";
import { goldToMoneyNotFixed, moneyToGold, goldToMoney, isGoldLegal } from "@/filters"
import { hasPermission } from "@/utils/auth"

  export default {
    name: 'personControl',
    computed:{
       hasShz:function(){
          return this.hasGame(3);
       },
       hasFruitslot: function(){
          return this.hasGame(23);
       },
       hasSiren: function(){
         return this.hasGame(13);
       },
       hasLkpy: function(){
         return this.hasGame(12);
       },
       hasJcby: function(){
         return this.hasGame(9);
       },
       hasZjh: function(){
         return this.hasGame(17);
       },
       hasBrnn: function(){
         return this.hasGame(7);
       },
       hasBjl: function(){
         return this.hasGame(18);
       },
       hasErren: function(){
         return this.hasGame(2);
       },

    },
    data() {
      return {
        playerKey: 0,
        playerList: null,   // 玩家列表
        totalSize: 0,
        pageQuery: {
          roomId: undefined,
          gameId: undefined,
          page: 1,
          pageSize: 10,
        },
        query: {
          playerId: undefined,
          nickName: undefined,
        },
        ctrlsKey: 1,
        loading: false,
        roomOptions:null,
        gameOptions:null,
        playerInfo: {      // 单个玩家信息
          playerId: '',
          superId: '',
          nickName: '',
          gameId: '',
          roomId: '',
          gold: 0,
          safeGold: 0,
          todayBetResult: 0,
          yesTodayBetResult: 0,
          prizeTotal: 0,
          isShow: false,
        },
        gameCtrl: {       // 玩家游戏控制
          shuihu:{
            gameId:'',
            control: {
              prizePools:0,  // long-系统可输奖金池奖金数量
              difficulty:undefined // int-难度编号
            },
            difficultList:null
          },
          laba:{
            gameId:'',
            control: {
              prizePools:0,  // long-系统可输奖金池奖金数量
              difficulty:undefined  // int-难度编号
            },
            difficultList:null
          },
          fqzs:{
            gameId:'',
            control: {
              prizePools:0,  // long-系统可输奖金池奖金数量
              winRatio:0,     // int[0-100]-系统赢的概率
              loseRatio:0
            }
          },
          lkby:{
            gameId:'',
            control: {
              prizePools:0,  // long-系统可输奖金池奖金数量
              difficultys:[],
            },
            difficultList: null
          },
          jcby:{
            gameId:'',
            control: {
              prizePools:0,  // long-系统可输奖金池奖金数量
              difficultys:[],
            },
            difficultList: null
          },
          srnn:{
            gameId:'',
            control: {
              prizePools:0,  // long-系统可输奖金池奖金数量
              winRatio:0,     // int[0-100]-系统赢的概率
              loseRatio:0,
            }
          },
          ernn:{
            gameId:'',
            control: {
              prizePools:0,  // long-系统可输奖金池奖金数量
              winRatio:0,     // int[0-100]-系统赢的概率
              loseRatio:0,
            }
          },
          zjh:{
            gameId:'',
            control: {
              prizePools:0,  // long-系统可输奖金池奖金数量
              winRatio:0,     // int[0-100]-系统赢的概率
              loseRatio:0,
            }
          },
          bjl:{
            gameId:'',
            control: {
              prizePools:0,  // long-系统可输奖金池奖金数量
              winRatio:0,     // int[0-100]-系统赢的概率
              loseRatio:0,
            }
          },
          brnn:{
            gameId:'',
            control: {
              prizePools:0,  // long-系统可输奖金池奖金数量
              winRatio:0,     // int[0-100]-系统赢的概率
              loseRatio:0,
            }
          }
        },
      }
    },
    created() {
      this.findGameList();
    },
    methods: {
      hasPermission: hasPermission,
      hasGame(gameId){
        var has = false;
        if(this.gameOptions && this.gameOptions.length){
           has= this.gameOptions.some(element => {
              if(element.id ==gameId && element.personControl){
                return true;
              }  else {
                return false;
              }
            });
        }
        return has;
      },
      findGameList() {
        this.loading = true;
        getGameList({active:true}).then(res=>{
          this.loading = false;
          this.gameOptions = res.map.list;
          if(this.gameOptions && this.gameOptions.length){
              this.pageQuery.gameId = this.gameOptions[0].id;
              this.handleSearechPlayers();
          }
        }).catch(()=>{
          this.loading = false;
        });
      },
      findRoomList() {
        getRoomList({gameId:this.pageQuery.gameId,active:1})
        .then(res=>{
          this.roomOptions = res.map.list;
        }).catch(()=>{
        });
      },
      findPlayerList() {
        this.loading = true;
        findPlayerList(this.pageQuery)
        .then(res=>{
          this.loading = false;
          this.playerList = res.map.list;
          this.totalSize = res.map.total;
        }).catch(()=>{
          this.loading = false;
        });
      },
      getPlayerInfo() {
        this.loading = true;
        getPlayerCtrlInfo(this.query.playerId, this.query.nickName)
        .then(res=>{
          this.loading = false;
          if(res.map.result) {
            this.playerInfo = res.map.result.playerInfo;
            this.handleGameCtrls(res.map.result.games);
            this.playerInfo.isShow = true;
          } else {
            this.playerInfo.isShow = false;
          }
        }).catch(()=>{
          this.loading = false;
          this.playerInfo.isShow = false;
        });
      },
      // 设置控制默认值
      handleGameCtrls(gameCtrl) {
        if(this.hasGame(3)) {
          if(gameCtrl.shuihu && gameCtrl.shuihu.control) {
            gameCtrl.shuihu.def = 0;
            gameCtrl.shuihu.control.prizePools = goldToMoneyNotFixed(gameCtrl.shuihu.control.prizePools);
          } else {
            gameCtrl.shuihu.def = 1;
            gameCtrl.shuihu.control = {
              prizePools:0,  // long-系统可输奖金池奖金数量
              difficulty:gameCtrl.shuihu.difficultList[0].id  // int-难度编号
            }
          }
        }
        if(this.hasGame(23)) {
          if(gameCtrl.laba && gameCtrl.laba.control) {
            gameCtrl.laba.def = 0;
            gameCtrl.laba.control.prizePools = goldToMoneyNotFixed(gameCtrl.laba.control.prizePools);
          } else {
            gameCtrl.laba.def = 1;
            gameCtrl.laba.control = {
              prizePools:0,  // long-系统可输奖金池奖金数量
              difficulty: gameCtrl.laba.difficultList[0].id  // int-难度编号
            }
          }
        }
        if(this.hasGame(12)) {
          if(gameCtrl.lkby && gameCtrl.lkby.control) {
            gameCtrl.lkby.def = 0;
            gameCtrl.lkby.control.prizePools = goldToMoneyNotFixed(gameCtrl.lkby.control.prizePools);
          } else {
            gameCtrl.lkby.def = 1;
            gameCtrl.lkby.control = {
              prizePools:0,  // long-系统可输奖金池奖金数量
              difficultys:[],  // int-难度编号
            }
          }
        }
        if(this.hasGame(9)) {
          if(gameCtrl.jcby && gameCtrl.jcby.control) {
            gameCtrl.jcby.def = 0;
            gameCtrl.jcby.control.prizePools = goldToMoneyNotFixed(gameCtrl.jcby.control.prizePools);
          } else {
            gameCtrl.jcby.def = 1;
            gameCtrl.jcby.control = {
              prizePools:0,  // long-系统可输奖金池奖金数量
              difficultys:[],  // int-难度编号
            }
          }
        }
        if(this.hasGame(13)) {
          if(gameCtrl.srnn && gameCtrl.srnn.control) {
            gameCtrl.srnn.def = 0;
            gameCtrl.srnn.control.prizePools = goldToMoneyNotFixed(gameCtrl.srnn.control.prizePools);
          } else {
            gameCtrl.srnn.def = 1;
            gameCtrl.srnn.control = {
              prizePools:0,  // long-系统可输奖金池奖金数量
              winRatio: 0,  // 
              loseRatio: 100
            }
          }
        } 
        if(this.hasGame(2)) {
          if(gameCtrl.ernn && gameCtrl.ernn.control) {
            gameCtrl.ernn.def = 0;
            gameCtrl.ernn.control.prizePools = goldToMoneyNotFixed(gameCtrl.ernn.control.prizePools);
          } else {
            gameCtrl.ernn.def = 1;
            gameCtrl.ernn.control = {
              prizePools:0,  // long-系统可输奖金池奖金数量
              winRatio: 0,  // 
              loseRatio: 100
            }
          }
        }
        if(this.hasGame(17)) {
          if(gameCtrl.zjh && gameCtrl.zjh.control) {
            gameCtrl.zjh.def = 0;
            gameCtrl.zjh.control.prizePools = goldToMoneyNotFixed(gameCtrl.zjh.control.prizePools);
          } else {
            gameCtrl.zjh.def = 1;
            gameCtrl.zjh.control = {
              prizePools:0,  // long-系统可输奖金池奖金数量
              winRatio: 0,  // 
              loseRatio: 100
            }
          }
        }
        if(this.hasGame(7)) {
          if(gameCtrl.brnn && gameCtrl.brnn.control) {
            gameCtrl.brnn.def = 0;
            gameCtrl.brnn.control.prizePools = goldToMoneyNotFixed(gameCtrl.brnn.control.prizePools);
          } else {
            gameCtrl.brnn = {};
            gameCtrl.brnn.def = 1;
            gameCtrl.brnn.control = {
              prizePools:0,  // long-系统可输奖金池奖金数量
              winRatio: 0,  // 
              loseRatio: 100
            }
          }
        }
        if(this.hasGame(18)) {
          if(gameCtrl.bjl && gameCtrl.bjl.control) {
            gameCtrl.bjl.def = 0;
            gameCtrl.bjl.control.prizePools = goldToMoneyNotFixed(gameCtrl.bjl.control.prizePools);
          } else {
            gameCtrl.bjl = {};
            gameCtrl.bjl.def = 1;
            gameCtrl.bjl.control = {
              prizePools:0,  // long-系统可输奖金池奖金数量
              winRatio: 0,  // 
              loseRatio: 100
            }
          }
        }
        this.gameCtrl = gameCtrl;
      },
      handleSearechPlayers() {
        if(!this.pageQuery.gameId) {
          this.$message({
            message: '请选择游戏',
          });
          return;
        }
        this.findPlayerList();
      },
      handleSizeChange(val) {
        this.pageQuery.pageSize = val;
        this.findPlayerList();
      },
      handleCurrentChange(val) {
        this.pageQuery.page = val;
        this.findPlayerList();
      },
      handleGameChange(val) {
        this.roomOptions = [];
        this.pageQuery.roomId = undefined;
        if(val) {
          this.findRoomList();
        }
      },
      handleSelectPlayer(playerId) {
        this.query.playerId = playerId;
        this.getPlayerInfo();
      },
      handleSearchPlayerCtrls() {
        if(!this.query.playerId && !this.query.nickName) {
          this.$message({
            message: '玩家ID、玩家昵称必须要填一个',
          });
          return;
        }
        this.getPlayerInfo();
      },
      // 添加控制
      _addCtrl(data, func) {
        this.loading = true;
        data.prizePools = moneyToGold(data.prizePools);
        addCtrl(data).then(res=>{
          this.loading = false;
          func();
        }).catch(()=>{
          this.loading = false;
        });
      },
      // 修改奖池金额
      _updatePrize(data, func) {
        if(!data.prizePools) {
          this.$message({
            message: '请输入的奖池金额,',
            type: 'warning'
          });
          return;
        }
        if(!this.validateGold(data.prizePools)) {
          return;
        }
        data.prizePools = moneyToGold(data.prizePools);
        this.loading = true;
        updatePrize(data).then(res=>{
          this.loading = false;
          func();
        }).catch(()=>{
          this.loading = false;
        });
      },
      // 修改控制
      _updateCtrl(data, func) {
        this.loading = true;
        updateCtrl(data).then(res=>{
          this.loading = false;
          func();
        }).catch(()=>{
          this.loading = false;
        });
      },
      // 水浒相关
      handleAddShuihuCtrl() {   // 添加水浒
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.shuihu.gameId;
        data.prizePools = this.gameCtrl.shuihu.control.prizePools;
        data.control = {
          difficulty: this.gameCtrl.shuihu.control.difficulty
        }
        this._addCtrl(data, ()=>{
          this.gameCtrl.shuihu.def = 0;
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        });
      },
      handleModShuihuPrize() {  // 修改水浒金额
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.shuihu.gameId;
        data.prizePools = this.gameCtrl.shuihu.control.prizePools;
        this._updatePrize(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      handleModShuihuDifficulty() {  // 修改水浒难度
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.shuihu.gameId;
        data.control = {
          difficulty: this.gameCtrl.shuihu.control.difficulty
        }
        this._updateCtrl(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      // 水果拉霸相关
      handleAddLabaCtrl() { // 添加
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.laba.gameId;
        data.prizePools = this.gameCtrl.laba.control.prizePools;
        data.control = {
          difficulty: this.gameCtrl.laba.control.difficulty
        }
        this._addCtrl(data, ()=>{
          this.gameCtrl.laba.def = 0;
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        });
      },
      handleModLabaPrize() { // 修改奖池
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.laba.gameId;
        data.prizePools = this.gameCtrl.laba.control.prizePools;
        this._updatePrize(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      handleModLabaDifficulty() { // 修改难度
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.laba.gameId;
        data.control = {
          difficulty: this.gameCtrl.laba.control.difficulty
        }
        this._updateCtrl(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      // 飞禽走兽相关
      handleAddFqzsCtrl() {  // 添加
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.fqzs.gameId;
        data.prizePools = this.gameCtrl.fqzs.control.prizePools;
        data.control = {
          winRatio: this.gameCtrl.fqzs.control.winRatio,
          loseRatio: 100 - this.gameCtrl.fqzs.control.winRatio
        }
        this._addCtrl(data, ()=>{
          this.gameCtrl.fqzs.def = 0;
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        });
      },
      handleModFqzsPrize() { // 修改奖池
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.fqzs.gameId;
        data.prizePools = this.gameCtrl.fqzs.control.prizePools;
        this._updatePrize(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      handleModFqzsRate() { // 修改概率
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.fqzs.gameId;
        data.control = {
          winRatio: this.gameCtrl.fqzs.control.winRatio,
          loseRatio: 100 - this.gameCtrl.fqzs.control.winRatio
        }

        if(!data.control.winRatio || data.control.winRatio < 0 || data.control.winRatio > 100) {
          this.$message({
            message: '请输入0-100概率',
            type: 'warning'
          });
          return;
        }

        this._updateCtrl(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      // 李逵劈鱼相关
      handleAddLkbyCtrl() {
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.lkby.gameId;
        data.prizePools = this.gameCtrl.lkby.control.prizePools;
        data.control = {
          difficultys:[]
        }
        this._addCtrl(data, ()=>{
          this.gameCtrl.lkby.def = 0;
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        });
      },
      handleModLkbyPrize() {
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.lkby.gameId;
        data.prizePools = this.gameCtrl.lkby.control.prizePools;
        this._updatePrize(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      handleSaveLkbyDifficulty() {
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.lkby.gameId;
        data.control = {
          difficultys: this.gameCtrl.lkby.control.difficultys
        }

        // check
        if (this.gameCtrl.lkby.control.difficultys && this.gameCtrl.lkby.control.difficultys.length > 0) {
          for(let i=0; i<this.gameCtrl.lkby.control.difficultys.length;i++) {
            let temp = this.gameCtrl.lkby.control.difficultys[i];

            if (parseInt(temp.multipleLower) < 1 || parseInt(temp.multipleUpper) < 1 ){
              this.$message({
                message: '鱼的倍数和加成必须 >= 1',
                type: 'warning'
              });
              return;
            }
            if (parseInt(temp.multipleLower) > parseInt(temp.multipleUpper)){
              this.$message({
                message: '鱼的最小倍数必须小于最大倍数',
                type: 'warning'
              });
              return;
            }
            if(temp.difficulty == null || temp.difficulty == 'undefined'){
              this.$message({
                message: '请选择难易程度',
                type: 'warning'
              });
              return;
            }
          }
        }

        this._updateCtrl(data, ()=>{
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        });
      },
      handleAddLkbyDifficulty(){
        let ctrl = { 
                multipleLower:0,  // 鱼的总倍数下限
                multipleUpper:0,  // 鱼的总倍数上限
                difficulty:this.gameCtrl.lkby.difficultList[0].id,
        }
        if (this.gameCtrl.lkby.control.difficultys &&  this.gameCtrl.lkby.control.difficultys.length > 0){
          this.gameCtrl.lkby.control.difficultys.push(ctrl);
        } else {
          this.gameCtrl.lkby.control.difficultys = [];
          this.gameCtrl.lkby.control.difficultys.push(ctrl);
        }
      },
      handleDelLkbyDifficulty(index) {
        this.gameCtrl.lkby.control.difficultys.splice(index, 1);
      },
      // 四人牛牛
      handleAddSrnnCtrl() {  // 添加
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.srnn.gameId;
        data.prizePools = this.gameCtrl.srnn.control.prizePools;
        data.control = {
          winRatio: this.gameCtrl.srnn.control.winRatio,
          loseRatio: 100 - this.gameCtrl.srnn.control.winRatio
        }
        this._addCtrl(data, ()=>{
          this.gameCtrl.srnn.def = 0;
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        });
      },
      handleModSrnnPrize() { // 修改奖池
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.srnn.gameId;
        data.prizePools = this.gameCtrl.srnn.control.prizePools;
        this._updatePrize(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      handleModSrnnRate() { // 修改概率
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.srnn.gameId;
        data.control = {
          winRatio: this.gameCtrl.srnn.control.winRatio,
          loseRatio: 100 - this.gameCtrl.srnn.control.winRatio
        }

        if(!data.control.winRatio || data.control.winRatio < 0 || data.control.winRatio > 100) {
          this.$message({
            message: '请输入0-100概率',
            type: 'warning'
          });
          return;
        }

        this._updateCtrl(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      // 二人牛牛
      handleAddErnnCtrl() {  // 添加
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.ernn.gameId;
        data.prizePools = this.gameCtrl.ernn.control.prizePools;
        data.control = {
          winRatio: this.gameCtrl.ernn.control.winRatio,
          loseRatio: 100 - this.gameCtrl.ernn.control.winRatio
        }
        this._addCtrl(data, ()=>{
          this.gameCtrl.ernn.def = 0;
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        });
      },
      handleModErnnPrize() { // 修改奖池
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.ernn.gameId;
        data.prizePools = this.gameCtrl.ernn.control.prizePools;
        this._updatePrize(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      handleModErnnRate() { // 修改概率
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.ernn.gameId;
        data.control = {
          winRatio: this.gameCtrl.ernn.control.winRatio,
          loseRatio: 100 - this.gameCtrl.ernn.control.winRatio
        }

        if(!data.control.winRatio || data.control.winRatio < 0 || data.control.winRatio > 100) {
          this.$message({
            message: '请输入0-100概率',
            type: 'warning'
          });
          return;
        }

        this._updateCtrl(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      // 金蟾捕鱼相关
      handleAddJcbyCtrl() {
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.jcby.gameId;
        data.prizePools = this.gameCtrl.jcby.control.prizePools;
        data.control = {
          difficultys:[]
        }
        this._addCtrl(data, ()=>{
          this.gameCtrl.jcby.def = 0;
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        });
      },
      handleModJcbyPrize() {
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.jcby.gameId;
        data.prizePools = this.gameCtrl.jcby.control.prizePools;
        this._updatePrize(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      handleSaveJcbyDifficulty() {
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.jcby.gameId;
        data.control = {
          difficultys: this.gameCtrl.jcby.control.difficultys
        }
        // check
        if (this.gameCtrl.jcby.control.difficultys && this.gameCtrl.jcby.control.difficultys.length > 0) {
          for(let i=0; i<this.gameCtrl.jcby.control.difficultys.length;i++) {
            let temp = this.gameCtrl.jcby.control.difficultys[i];

            if (parseInt(temp.multipleLower) < 1 || parseInt(temp.multipleUpper) < 1 ){
              this.$message({
                message: '鱼的倍数和加成必须 >= 1',
                type: 'warning'
              });
              return;
            }
            if (parseInt(temp.multipleLower) > parseInt(temp.multipleUpper)){
              this.$message({
                message: '鱼的最小倍数必须小于最大倍数',
                type: 'warning'
              });
              return;
            }
            if(temp.difficulty == null || temp.difficulty == 'undefined'){
              this.$message({
                message: '请选择难易程度',
                type: 'warning'
              });
              return;
            }
          }
        }

        this._updateCtrl(data, ()=>{
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        });
      },
      handleAddJcbyDifficulty(){
        let ctrl = { 
                multipleLower:0,  // 鱼的总倍数下限
                multipleUpper:0,  // 鱼的总倍数上限
                difficulty:this.gameCtrl.jcby.difficultList[0].id,
        }
        if (this.gameCtrl.jcby.control.difficultys &&  this.gameCtrl.jcby.control.difficultys.length > 0){
          this.gameCtrl.jcby.control.difficultys.push(ctrl);
        } else {
          this.gameCtrl.jcby.control.difficultys = [];
          this.gameCtrl.jcby.control.difficultys.push(ctrl);
        }
      },
      handleDelJcbyDifficulty(index) {
        this.gameCtrl.jcby.control.difficultys.splice(index, 1);
      },
      // 炸金花
      handleAddZjhCtrl() {  // 添加
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.zjh.gameId;
        data.prizePools = this.gameCtrl.zjh.control.prizePools;
        data.control = {
          winRatio: this.gameCtrl.zjh.control.winRatio,
          loseRatio: 100 - this.gameCtrl.zjh.control.winRatio
        }
        this._addCtrl(data, ()=>{
          this.gameCtrl.zjh.def = 0;
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        });
      },
      handleModZjhPrize() { // 修改奖池
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.zjh.gameId;
        data.prizePools = this.gameCtrl.zjh.control.prizePools;
        this._updatePrize(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      handleModZjhRate() { // 修改概率
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.zjh.gameId;
        data.control = {
          winRatio: this.gameCtrl.zjh.control.winRatio,
          loseRatio: 100 - this.gameCtrl.zjh.control.winRatio
        }

        if(!data.control.winRatio || data.control.winRatio < 0 || data.control.winRatio > 100) {
          this.$message({
            message: '请输入0-100概率',
            type: 'warning'
          });
          return;
        }

        this._updateCtrl(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      // 百人牛牛
      handleAddBrnnCtrl() {  // 添加
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.brnn.gameId;
        data.prizePools = this.gameCtrl.brnn.control.prizePools;
        data.control = {
          winRatio: this.gameCtrl.brnn.control.winRatio,
          loseRatio: 100 - this.gameCtrl.brnn.control.winRatio
        }
        this._addCtrl(data, ()=>{
          this.gameCtrl.brnn.def = 0;
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        });
      },
      handleModBrnnPrize() { // 修改奖池
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.brnn.gameId;
        data.prizePools = this.gameCtrl.brnn.control.prizePools;
        this._updatePrize(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      handleModBrnnRate() { // 修改概率
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.brnn.gameId;
        data.control = {
          winRatio: this.gameCtrl.brnn.control.winRatio,
          loseRatio: 100 - this.gameCtrl.brnn.control.winRatio
        }

        if(!data.control.winRatio || data.control.winRatio < 0 || data.control.winRatio > 100) {
          this.$message({
            message: '请输入0-100概率',
            type: 'warning'
          });
          return;
        }

        this._updateCtrl(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      // 百家乐
      handleAddBjlCtrl() {  // 添加
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.bjl.gameId;
        data.prizePools = this.gameCtrl.bjl.control.prizePools;
        data.control = {
          winRatio: this.gameCtrl.zjh.control.winRatio,
          loseRatio: 100 - this.gameCtrl.bjl.control.winRatio
        }
        this._addCtrl(data, ()=>{
          this.gameCtrl.bjl.def = 0;
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        });
      },
      handleModBjlPrize() { // 修改奖池
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.bjl.gameId;
        data.prizePools = this.gameCtrl.bjl.control.prizePools;
        this._updatePrize(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },
      handleModBjlRate() { // 修改概率
        let data = {};
        data.playerId = this.playerInfo.playerId;
        data.gameId = this.gameCtrl.bjl.gameId;
        data.control = {
          winRatio: this.gameCtrl.bjl.control.winRatio,
          loseRatio: 100 - this.gameCtrl.bjl.control.winRatio
        }

        if(!data.control.winRatio || data.control.winRatio < 0 || data.control.winRatio > 100) {
          this.$message({
            message: '请输入0-100概率',
            type: 'warning'
          });
          return;
        }

        this._updateCtrl(data, ()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        });
      },

      validateGold: function(gold) {
        var ret = isGoldLegal(gold);
        if(typeof ret === 'boolean') {
          return true
        }
        this.$message({
          message: ret,
          type: 'warning'
        });
        return false;
      },
    }
  }
</script>