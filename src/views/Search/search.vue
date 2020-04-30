<template>
  <div>
    <!--search start-->
    <van-popup v-model="show" position="top">
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
    </van-popup>

    <div class="navBar">
      <van-tabs :ellipsis="false" v-model="active" @click="tabOnClick" style="width:90%;">
        <van-tab v-for="(item,index) in titleList" :title="item.name" :key="index"></van-tab>
      </van-tabs>
      <div class="nav_icon">
        <van-icon name="search" size="25" @click="showSearch" color="#07c160" />
      </div>
    </div>

    <div class="contentBox">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了!" @load="onLoad">
          <div v-if="moduleType == 1">
            <div class="searchContent" v-for="item in filterDetail" :key="item.id">
              <div class="searchBox">
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
                <p>
                  额度评估:
                  <span>{{item.limitEva}}</span>
                </p>
              </div>
              <div class="searchBox2">
                <p>
                  时间:
                  <span>{{item.submitTime}}</span>
                </p>
                <p>
                  <span>{{item.feedModel}}</span>
                </p>
                <div style="display:flex">
                    <span class="item-icon">
                      <van-icon size="20px" name="checked" color="#07c160" />
                    </span>
                  <span>直接提交</span>
                </div>
                <van-button style="margin-top:10px;width: 70%" round block type="primary" size="small" @click="listAgain(item.branchLoanId)">重新进件</van-button>
              </div>
              <!--popup-->
              <van-popup v-model="isPushList" :style="{width:'80%'}">
                <div class="CertificateResult">
                  <span class="CertificateResult-title">是否需要再次使用该条线索申请进件？</span>
                  <van-button style="width: 80%;margin: 0 auto;margin-top:25px;" round block type="info" @click="sure()">确  定</van-button>
                </div>
              </van-popup>
            </div>
          </div>

          <div v-if="moduleType == 2">
            <div class="searchContent" v-for="item in filterDetail" :key="item.id" @click="toWhichPath(item.applyStatus,item.clueId,item.type,item.userId,item.branchLoanId)">
              <div class="searchBox">
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
                <p>
                  额度评估:
                  <span>{{item.rateAssess}}</span>
                </p>
              </div>
              <div class="searchBox2">
                <p>
                  时间:
                  <span>{{item.submitTime}}</span>
                </p>
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
                  <template v-else-if="item.applyStatus == '待人工审批'">
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
                  <template v-else-if="item.applyStatus == '待业务申请'">
                    <img class="item-icon" src="../../assets/realname.png" alt />
                  </template>
                  <template v-else-if="item.applyStatus == '已进件'">
                    <van-icon style="margin-right:5px" name="checked" color="#07c160" size="20" />
                  </template>
                  {{item.applyStatus}}
                </p>
              </div>
            </div>
          </div>

          <div v-if="moduleType == 3">
            <div class="searchContent" v-for="item in filterDetail" :key="item.id" @click="toWhichPath(item.applyStatus,item.clueId,item.type,item.userId,item.branchLoanId)">
              <div class="searchBox">
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
                <p>
                  额度评估:
                  <span>{{item.rateAssess}}</span>
                </p>
              </div>
              <div class="searchBox2">
                <p>
                  时间:
                  <span>{{item.submitTime}}</span>
                </p>
                <p>
                  <span>{{item.feedModel}}</span>
                </p>

                <p style="display:flex">
                  <img class="item-icon" src="../../assets/carPrice.png" alt />
                  <span>{{item.applyStatus}}</span>
                </p>
              </div>
            </div>
          </div>

          <div v-if="moduleType == 4">
            <div class="searchContent" v-for="item in filterDetail" :key="item.id" @click="toWhichPath(item.applyStatus,item.clueId,item.type,item.userId,item.branchLoanId)">
              <div class="searchBox">
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
                <p>
                  额度评估:
                  <span>{{item.rateAssess}}</span>
                </p>
              </div>
              <div class="searchBox2">
                <p>
                  时间:
                  <span>{{item.submitTime}}</span>
                </p>
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
                  <template v-else-if="item.applyStatus == '待人工审批'">
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
                  <template v-else-if="item.applyStatus == '待业务申请'">
                    <img class="item-icon" src="../../assets/realname.png" alt />
                  </template>
                  <template v-else-if="item.applyStatus == '已进件'">
                    <van-icon style="margin-right:5px" name="checked" color="#07c160" size="20" />
                  </template>
                  {{item.applyStatus}}
                </p>
              </div>
            </div>
          </div>

          <div v-if="moduleType == 5">
            <div class="authentication" v-for="item in filterDetail" :key="item.id">
              <div class="box">
                <p>
                  客户姓名：
                  <span>{{item.name}}</span>
                </p>
              </div>
              <div class="box">
                <p class="pFlex">
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
          </div>
        </van-list>
      </van-pull-refresh>
    </div>


  </div>
</template>
<script>
  import { getUrlParam,getUrlParamFirst ,dateFormat} from "../../common/common.js";
import { QueryResult ,listAgain ,wechat, getMenu} from "../../request/api";
export default {
  name: "search",
  data() {
    return {
      show: false,
      loading: false,
      finished: true,
      refreshing: false,
      active: 0,
      brandShow: true,
      username: "",
      carbrand: "",
      pIdx: 0,
      filterDetail: [],
      managerId:'',
      state:'',
      userID:'',
      isTabClick:false,
      titleList:[],
      isPushList:false,
      branchLoanId:'' , //重复进件用
      moduleType:""
    };
  },
  mounted() {
    this.$store.commit('updateParam',getUrlParam())
    this.managerId = getUrlParamFirst("managerId")
    this.state = this.$store.state.state;
    this.menu();


  },
  methods: {

    //menu
    menu(){
      var param = Object.assign(
        { managerId: this.managerId },
      );
      getMenu(param).then(res =>{
        console.log("菜单数据：",res.data.data)
        this.titleList = res.data.data;

        if (this.titleList.length === 0){
          this.$dialog.alert({
            message: '暂无数据，请联系运维人员',
            showConfirmButton:false
          });
        }else{
          this.finished = false;
          this.moduleType = this.titleList[this.active].key
        }
      })
    },
    //确定
    sure(){
      const toast = this.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      console.log("确定按钮branchLoanId",this.branchLoanId)
      this.isPushList = false;
      toast.clear()
      var BranchLoanId = Object.assign({branchLoanId:this.branchLoanId});

      listAgain(BranchLoanId).then(res => {
        console.log("res.data.data.branchLoanId",res.data.data.branchLoanId)
        var wxInfo = Object.assign(
          {branchLoanId:res.data.data.branchLoanId},
          {type:1},
          {managerId:this.$store.state.managerId}
        )
        if(res.data.data.stateCode === 1){
          //微信推送
          wechat(wxInfo).then(res => {
            toast.clear();
            console.log(res.data.data)
            if (res.data.data.stateCode === 1){
              this.$toast.success("已发送微信推送！")
              this.$router.push('/pushSuccess')
            }else {
              this.$toast.fail("发送微信推送失败！")
            }
          })
        }else{
          toast.clear();
          this.$toast.fail("重新进件失败！")
        }
      })
    },
    //重新进件
    listAgain(BranchLoanId){

      console.log("需要重新进件的BranchLoanID：",BranchLoanId);
      this.branchLoanId = BranchLoanId;
      this.isPushList = true;
    },
    //详情页跳转
    toWhichPath(applyStatus,clueId,type,userId,branchLoanId){
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
      else if(applyStatus == '待人工审批'){
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
          path:'/carInfoOCR',
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
    //查询
    toSearch() {
      this.show = false;
      this.pIdx = 1;
      this.filterDetail = [];
      this.getData();
    },
    //清空
    toClear() {
      this.show = false;
      this.username = "";
      this.carbrand = "";
      this.filterDetail = [];
      this.pIdx = 1;
      this.getData();
    },
    tabOnClick() {
      this.moduleType = this.titleList[this.active].key
      console.log("moduleType********",this.moduleType)
      console.log("this.active------------",this.active)
      if (this.active === 4) {
        this.brandShow = false;
        this.carbrand = "";
      } else {
        this.brandShow = true;
      }
      this.pIdx = 1;
      this.filterDetail = [];
      this.isTabClick = true;
      this.finished = false
      this.getData();

    },
    //刷新
    onRefresh() {
      this.pIdx = 1;
      console.log("zou2");
      this.isTabClick = true;
      this.finished = false;
      this.getData();
    },
    //自动加载更多
    onLoad() {
      if (this.isTabClick){
        return;
      }
      console.log("sss",this.finished)
        this.pIdx += 1;
        console.log("zou3");
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
        { name: this.username },
        { managerId: this.managerId },
        { moduleType: this.titleList[this.active].key },

        );
      console.log("结果查询参数：",param)

      QueryResult(param).then(res => {
        console.log("res.data.data",res.data.data);
        let list = res.data.data["loanInfo.list"];
        let num = res.data.data["num.list"];
        console.log(list, num, this.pIdx, this.refreshing);

        if (this.refreshing) {
          this.filterDetail = [];
          this.refreshing = false;
        }
        for (let i in list) {
          // console.log("AAA",list[i].submitTime)
          // list[i].submitTime = dateFormat(parseInt( list[i].submitTime),'yyyy-MM-dd')

          this.filterDetail.push(list[i]);
        }
        this.loading = false;
        this.isTabClick = false;

        if (this.filterDetail.length >= num) {
          this.finished = true;
        }

      });
    }
  }
};
</script>


<style scoped>
  .contentBox{
    position:absolute;top:44px;width:100%;background:#f3eeee;
  }
  .navBar{
    width:100%;
    position:fixed;
    top:0px;
    z-index:999;
    background-color: #ffffff;
    height:44px;
  }
  .nav_icon{
    position:absolute;
    right:4px;
    top:10px;
  }
  .pFlex{
    display:flex;justify-content: center;align-items: center
  }
.search_form {
  margin: 7% 3%;
}
.item-icon {
  margin-top: -1px;
  margin-right: 5px;
  width: 20px;
  height: 20px;
}
.searchContent, .authentication {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  background: #ffffff;
  margin-top: 3%;
  padding: 3%;
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

  .CertificateResult {
    margin-top: 10px;
    padding: 16px;
    text-align: center;
  }
  .CertificateResult-title {
    font-size: 18px;
    font-weight: bold;
  }
  .searchBox{
    width: 70%;
  }
  .searchBox2{
    width: 35%;
  }

</style>
<style>
</style>
