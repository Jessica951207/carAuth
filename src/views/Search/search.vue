<template>
  <div>
    <van-popup v-model="show" position="top">
      <!--search start-->
      <div class="search_form">
        <van-field
          style="border-style: solid;border-color:#D5D5D5;border-width:1px "
          v-model="username"
          name="客户姓名"
          label="客户姓名:"
          placeholder="客户姓名"
        />
        <van-field
          style="border-style: solid;border-color:#D5D5D5;border-width:1px; margin-top:10px"
          v-model="carbrand"
          name="车辆品牌"
          label="车辆品牌:"
          placeholder="车辆品牌"
          v-show="brandShow"
        />
        <div class="searchBtn">
          <van-button style="width:40%" block type="info" @click="toSearch">查询</van-button>
          <van-button style="width:40%" block type="info" @click="toClear">清空</van-button>
        </div>
      </div>
      <!--search end-->
    </van-popup>
    <van-tabs :ellipsis="false" v-model="active" @click="tabOnClick">
      <span style="margin-left:10px;margin-right:10px; margin-top:10px" slot="nav-right">
        <van-icon name="search" size="25" @click="showSearch" color="#07c160" />
      </span>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了!" @load="onLoad">
          <van-tab title="扫码简易申请">
            <div class="searchContent" v-for="item in filterDetail" :key="item.id">
              <div class="box">
                <p>
                  申请编号:
                  <span>{{item.applyNum}}</span>
                </p>
                <p>
                  客户姓名:
                  <span>{{item.name}}</span>
                </p>
                <p>
                  车辆品牌:
                  <span>{{item.brandName}}</span>
                </p>
              </div>
              <div class="box">
                <p>额度评估:</p>
                <p>{{item.limitEva}}</p>
              </div>
              <div class="box">
                <p>
                  <span>{{item.feedModel}}</span>
                </p>
                <div style="display:flex">
                  <span class="item-icon">
                    <van-icon size="20px" name="checked" color="#07c160" />
                  </span>
                  <span>直接提交</span>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="额度初筛">
            <div class="searchContent" v-for="item in filterDetail" :key="item.id" @click="toWhichPath(item.applyStatus,item.clueId,item.type,item.userId,item.branchLoanId)">
              <div class="box">
                <p>
                  申请编号:
                  <span>{{item.applyNum}}</span>
                </p>
                <p>
                  客户姓名:
                  <span>{{item.name}}</span>
                </p>
                <p>
                  车辆品牌:
                  <span>{{item.brandName}}</span>
                </p>
              </div>
              <div class="box">
                <p>额度评估:</p>
                <p>{{item.rateAssess}}</p>
              </div>
              <div class="box">
                <p>
                  <span>{{item.feedModel}}</span>
                </p>
                <p style="display:flex">

                  <template v-if="item.applyStatus == '初筛通过'">
                    <van-icon style="margin-right:5px" name="checked" color="#07c160" size="20" />
                  </template>
                  <template v-else-if="item.applyStatus == '初筛拒绝'">
                    <van-icon style="margin-right:5px" name="close" size="20" color="#ff0033" />
                  </template>
                  <template v-else-if="item.applyStatus == '人工审批'">
                    <van-icon style="margin-right:5px" name="info-o" size="20" color="#B8860B" />
                  </template>
                  <template v-else-if="item.applyStatus == '待初筛'">
                    <img class="item-icon" src="../../assets/chushai.png" alt />
                  </template>
                  <template v-else-if="item.applyStatus == '待车辆认证'">
                    <img class="item-icon" src="../../assets/carPrice.png" alt />
                  </template>
                  <template v-else-if="item.applyStatus == '待实名认证'">
                    <img class="item-icon" src="../../assets/realname.png" alt />
                    <!-- <van-icon style="margin-right:5px" name="refund-o" size="20" color="#B8860B" /> -->
                  </template>
                  <template v-else-if="item.applyStatus == '进件完成'">
                    <van-icon style="margin-right:5px" name="checked" color="#07c160" size="20" />
                  </template>
                  {{item.applyStatus}}
                </p>
              </div>
            </div>
          </van-tab>
          <van-tab title="车辆认证">
            <div class="searchContent" v-for="item in filterDetail" :key="item.id" @click="toWhichPath(item.applyStatus,item.clueId,item.type,item.userId,item.branchLoanId)">
              <div class="box">
                <p>
                  申请编号:
                  <span>{{item.applyNum}}</span>
                </p>
                <p>
                  客户姓名:
                  <span>{{item.name}}</span>
                </p>
                <p>
                  车辆品牌:
                  <span>{{item.brandName}}</span>
                </p>
              </div>
              <div class="box">
                <p>额度评估:</p>
                <p>{{item.rateAssess}}</p>
              </div>
              <div class="box">
                <p>
                  <span>{{item.feedModel}}</span>
                </p>

                <p style="display:flex">
                  <img class="item-icon" src="../../assets/carPrice.png" alt />
                  <span>{{item.applyStatus}}</span>
                </p>
              </div>
            </div>
          </van-tab>
          <van-tab title="直销模式">
            <div class="searchContent" v-for="item in filterDetail" :key="item.id" @click="toWhichPath(item.applyStatus,item.clueId,item.type,item.userId,item.branchLoanId)">
              <div class="box">
                <p>
                  申请编号:
                  <span>{{item.applyNum}}</span>
                </p>
                <p>
                  客户姓名:
                  <span>{{item.name}}</span>
                </p>
                <p>
                  车辆品牌:
                  <span>{{item.brandName}}</span>
                </p>
              </div>
              <div class="box">
                <p>额度评估:</p>
                <p>{{item.rateAssess}}</p>
              </div>
              <div class="box">
                <p>
                  <span>{{item.feedModel}}</span>
                </p>
                <p style="display:flex">
                  <template v-if="item.applyStatus == '初筛通过'">
                    <van-icon style="margin-right:5px" name="checked" color="#07c160" size="20" />
                  </template>
                  <template v-else-if="item.applyStatus == '初筛拒绝'">
                    <van-icon style="margin-right:5px" name="close" size="20" color="#ff0033" />
                  </template>
                  <template v-else-if="item.applyStatus == '人工审批'">
                    <van-icon style="margin-right:5px" name="info-o" size="20" color="#B8860B" />
                  </template>
                  <template v-else-if="item.applyStatus == '待初筛'">
                    <img class="item-icon" src="../../assets/chushai.png" alt />
                  </template>
                  <template v-else-if="item.applyStatus == '待车辆认证'">
                    <img class="item-icon" src="../../assets/carPrice.png" alt />
                  </template>
                  <template v-else-if="item.applyStatus == '待实名认证'">
                    <img class="item-icon" src="../../assets/realname.png" alt />
                    <!-- <van-icon style="margin-right:5px" name="refund-o" size="20" color="#B8860B" /> -->
                  </template>
                  <template v-else-if="item.applyStatus == '进件完成'">
                    <van-icon style="margin-right:5px" name="checked" color="#07c160" size="20" />
                  </template>
                  {{item.applyStatus}}
                </p>
              </div>
            </div>
          </van-tab>
          <van-tab title="实名认证">
            <div class="authentication" v-for="item in filterDetail" :key="item.id">
              <div class="box">
                <p>
                  客户姓名：
                  <span>{{item.name}}</span>
                </p>
              </div>
              <div class="box">
                <p style="display:flex">
                  <template v-if="item.certification == '已实名认证'">
                    <van-icon style="margin-right:5px" name="checked" color="#07c160" size="20" />
                  </template>
                  <template v-else>
                    <van-icon style="margin-right:5px" name="close" size="20" color="#ff0033" />
                  </template>
                  {{item.certification}}
                </p>
              </div>
            </div>
          </van-tab>
        </van-list>
      </van-pull-refresh>
    </van-tabs>
  </div>
</template>

<script>
  import { getUrlParam } from "../../common/common.js";
import { QueryResult } from "../../request/api";
export default {
  name: "search",
  data() {
    return {
      show: false,
      loading: false,
      finished: false,
      refreshing: false,
      active: 0,
      brandShow: true,
      username: "",
      carbrand: "",
      pIdx: 0,
      filterDetail: [],
      managerId:'',
      state:''
    };
  },
  mounted() {
    this.$store.commit('updateParam',getUrlParam())

    this.managerId = this.$store.state.managerId
    this.state = this.$store.state.state

  },
  methods: {
    toWhichPath(applyStatus,clueId,type,userId,branchLoanId){
      console.log(11111111)
      console.log(applyStatus,clueId,type,userId,branchLoanId)

      this.$store.state.clueId = clueId;
      this.$store.state.id = userId;
      this.$store.state.type = type;
      this.$store.state.branchLoanId = branchLoanId;

      if(applyStatus == '初筛通过'){
        this.$router.push({
          path:'/chooseInvestor',
          query:{
            state:this.state,
            type:type,
            clueId:clueId,
            managerId:this.managerId,
            id:userId
          }
        })
      }
      else if(applyStatus == '初筛拒绝'){
        this.$router.push({
          path:'/screenResult',
          query:{
            state:this.state,
            type:type,
            clueId:clueId,
            managerId:this.managerId,
            id:userId
          }
        })
      }
      else if(applyStatus == '人工审批'){
        this.$router.push({
          path:'/screening',
          query:{
            state:this.state,
            type:type,
            clueId:clueId,
            managerId:this.managerId,
            id:userId
          }
        })
      }
      else if(applyStatus == '待初筛'){
        this.$router.push({
          path:'/screening',
          query:{
            state:this.state,
            type:type,
            clueId:clueId,
            managerId:this.managerId,
            id:userId
          }
        })
      }
      else if(applyStatus == '待车辆认证'){
        this.$router.push({
          path:'/carNeedAuth',
          query:{
            state:this.state,
            type:type,
            clueId:clueId,
            managerId:this.managerId,
            id:userId
          }
        })
      }
      else if(applyStatus == '待实名认证'){
        this.$router.push({
          path:'/user',
          query:{
            state:this.state,
            type:type,
            clueId:clueId,
            managerId:this.managerId,
            id:userId
          }
        })
      }

    },
    toSearch() {
      this.show = false;
      this.pIdx = 1;
      this.filterDetail = [];
      this.getData();

    },
    toClear() {
      this.show = false;
      this.username = "";
      this.carbrand = "";
      this.filterDetail = [];
      this.pIdx = 1;
      this.getData();
    },
    tabOnClick() {
      if (this.active === 4) {
        this.brandShow = false;
        this.carbrand = "";
      } else {
        this.brandShow = true;
      }
      this.refreshing = true;
      this.pIdx = 1;
      this.getData();
      this.filterDetail = [];
      console.log("zou1");
    },
    onRefresh() {
      // this.finished = false;
      this.pIdx = 1;
      this.getData();
    },
    onLoad() {
      this.pIdx += 1;
      this.getData();
    },
    showSearch() {
      this.show = true;
    },

    getData() {
      //1=扫码简易申请，2=额度初筛，3=车辆评估，4=直销模式，5=实名认证
      var param = Object.assign(
        { pIdx: this.pIdx },
        { pSize: "10" },
        { brand: this.carbrand},
        { moduleType: this.active + 1 },
        { managerId: "101" },
        { name: this.username },
        { model: this.modelId }
      );
      QueryResult(param).then(res => {
        console.log("res.data.data",res.data.data["loanInfo.list"]);
        let list = res.data.data["loanInfo.list"];
        let num = res.data.data["num.list"];
        console.log(list, num, this.pIdx, this.refreshing);
        this.loading = false;

        if (this.refreshing) {
          this.filterDetail = [];
          this.refreshing = false;
        }
        for (let i in list) {
          this.filterDetail.push(list[i]);
          console.log(list[i])
        }
        if (this.filterDetail.length >= num) {
          this.finished = true;
        }

        console.log("this.filterDetail",this.filterDetail)

        // console.log(this.filterDetail.length);
      });
    }
  }
};
</script>

<style scoped>
.search_form {
  margin: 7% 3%;
}
.item-icon {
  margin-top: -1px;
  margin-right: 5px;
  width: 20px;
  height: 20px;
}
.searchContent,
.authentication {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  background: #eeeeee;
  margin-top: 3%;
  padding: 1% 4%;
  height: calc(100% - 44px);
}
.searchBtn {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
}
.box {
  width: 33%;
}
.box:nth-child(2) {
  text-align: center;
}
.authentication {
}
</style>
<style>
</style>
