<template>
  <div>
    <van-nav-bar title="OCR扫描结果" />
    <div>
      <div class="alert-carInfo">
        <van-icon class="alert-carInfo-icon" name="info-o" color="#ff9900" />
        <span>请确认车辆信息</span>
      </div>
      <van-form @submit="onSubmit">
        <!--<van-field-->
          <!--v-model="FrontInfo.Vin"-->
          <!--name="vin"-->
          <!--label="车架号:"-->
          <!--right-icon="edit"-->
          <!--@click-right-icon="showChangeChassisID = true"-->
        <!--/>-->
        <van-field
          v-model="FrontInfo.Vin"
          name="vin"
          label="车架号:"
          placeholder="请填写车架号"
          :rules="[{ required: true, message: '请填写车架号' }]"
          @blur="blurVin"
        />
        <van-field
          v-model="FrontInfo.EngineNo"
          label="发动机号:"
          name="engineNo"
          placeholder="请填写发动机号"
          :rules="[{ required: true, message: '请填写发动机号' }]"
        />
        <van-field
          v-model="FrontInfo.PlateNo"
          label="车牌号:"
          name="plateNo"
          placeholder="请填写车牌号"
          :rules="[{ required: true, message: '请填写车牌号' }]"
        />
        <van-field
          is-link
          readonly
          clickable
          v-model="FrontInfo.RegisterDate"
          label="注册日期:"
          name="registerDate"
          placeholder="请选择注册日期"
          @click="showDate = true"
          :rules="[{ required: true, message: '请选择注册日期' }]"
        />
        <van-field
          v-model="FrontInfo.Owner"
          label="所有人名称:"
          name="owner"
          placeholder="请填写所有人名称"
          :rules="[{ required: true, message: '请填写所有人名称' }]"
        />
        <van-field
          type="digit"
          v-model="mileage"
          name="mileage"
          label="公里数(公里)"
          placeholder="列：一万公里，填写10000"
          :rules="[{validator:mileValidator, required: true, message: '请填写正确的公里数' }]"
        />

        <van-field
          readonly
          clickable
          label="汽车型号"
          :value="modelName"
          name="modelName"
          placeholder="选择汽车型号"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>

        <div style="margin: 50px 16px 0 16px;">
          <van-button round block type="info" native-type="submit">评估车价</van-button>
        </div>
      </van-form>
    </div>
    <van-overlay style :show="showLoading">
      <div class="wrapper">
        <van-loading type="spinner" />
        <!--<van-loading size="30px">正在评估...</van-loading>-->
      </div>
    </van-overlay>

    <!--&lt;!&ndash;手工录入popup&ndash;&gt;-->
    <!--<van-popup v-model="showChangeChassisID" position="top">-->
      <!--<div class="changeChassisID">-->
        <!--<span class="changeChassisID-title">手工录入</span>-->
        <!--<van-form @submit="HFClick">-->
          <!--<van-field-->
            <!--v-model="hFVin"-->
            <!--label="车架号:"-->
            <!--placeholder="请填写车架号"-->
            <!--:rules="[{validator:vinValidator, required: true, message: '请填写正确的车架号' }]"-->
          <!--/>-->
          <!--<van-button style="margin-top:25px" round block type="info" >手工录入</van-button>-->
        <!--</van-form>-->
      <!--</div>-->
    <!--</van-popup>-->

    <!--日期-->
    <van-popup
      v-model="showDate"
      position="bottom"
      :style="{ height: '300px', width: '100%'}"
      get-container="body"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="selectDate"
        @cancel="showDate = false"
      />
    </van-popup>

  </div>
</template>

<script>
  import { dateFormat } from "../../common/common.js";
import { checkCarModel ,saveCarInfo } from "../../request/api";
import { assessCarValue ,updateLoanStatus ,amountCalculate, searchCarInfo,searchCityZone} from "../../request/api";

export default {
  data() {
    return {
      showDate: false,
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      state:'',
      hFVin: "",
      FrontInfo:{
        PlateNo:"",
        VehicleType:"",
        Owner:"",
        Address:"",
        UseCharacter:"",
        Model:"",
        Vin:"",
        EngineNo:"",
        RegisterDate:"",
        IssueDate:"",
        Seal:""
      },
      mileage: "",
      showLoading: false,
      showChangeChassisID: false,
      modelName: '',
      showPicker:false,
      columns: [],
      provinceId:'',
      cityId:'',
      modelIdArray:[],
      modelId:'',
      brandIdArray:[],
      brandId:'',
      branchLoanId:'',
      seriesArray:[],
      series:'',
      brandNameArray:[],
      brandName:'',
      seriesNameArray:[],
      seriesName:'',
      managerId:'',
      feedModel:'',

    };
  },
  mounted() {
    console.log(this.$store.state.managerId,this.$store.state.branchLoanId,this.$store.state.state,this.$store.state.id,this.$store.state.clueId)
    this.state = this.$store.state.state;
    this.managerId = this.$store.state.managerId;
    this.branchLoanId = this.$store.state.branchLoanId;
    console.log(this.$store.state)

    if (this.state == 2) {
      //客户经理
      this.feedModel = 1;
    }
    else if(this.state == 3){
      //代理人
      this.feedModel = 2;
    }
    else if(this.state == 6){
      //渠道直销
      this.feedModel = 3;
    }

    if(this.$store.state.clueId != ""){
      console.log("结果查询")
      this.assignCarInfo();
    }else{
      console.log("正常进件")
      this.assignData();
      this.getCarModel();
    }

  },
  watch:{
    "this.FrontInfo.Vin":{
      deep:true,
      handler:function (newValue,oldValue) {
        console.log('newValue is',newValue,"oldValue is",oldValue);
        this.$store.state.FrontInfo.Vin = newValue;
        console.log(newValue)
      }
    },
  },

  methods: {
    //clueId不为空则时从search界面跳转过来，给页面初始赋值
    assignCarInfo(){
      var ClueId = Object.assign({clueId:this.$store.state.clueId})

      searchCarInfo(ClueId).then(res => {
        console.log(res.data.data)
        this.$store.state.cityCode = res.data.data.clueInfo.cityId;
        this.$store.state.provinceCode = res.data.data.clueInfo.provinceId;
        console.log("cityCode",this.$store.state.cityCode,this.$store.state.provinceCode)

        this.FrontInfo.Vin = res.data.data.carLicenseInfo.vin;
        this.FrontInfo.EngineNo = res.data.data.carLicenseInfo.engineNo;
        this.FrontInfo.PlateNo = res.data.data.carLicenseInfo.plateNo;
        this.FrontInfo.RegisterDate = res.data.data.carLicenseInfo.registerDate;
        this.FrontInfo.Owner = res.data.data.carLicenseInfo.owner;
        this.mileage = res.data.data.carLicenseInfo.mileage;
        this.modelName = res.data.data.carLicenseInfo.modelName;
        this.modelId = res.data.data.carLicenseInfo.model - 11000000000;
        this.series = res.data.data.carLicenseInfo.series;
        this.seriesName = res.data.data.carLicenseInfo.seriesName;
        this.brandName = res.data.data.carLicenseInfo.brandName;
        this.brandId = res.data.data.carLicenseInfo.brand - 900000000;

        this.$store.state.FrontInfo = this.FrontInfo;

        //获取城市区域
        this.getCityZone();

      })
    },
    //获取城市区域
    getCityZone(){
      var cityId = Object.assign({cityId:this.$store.state.cityCode})
      searchCityZone(cityId).then(res => {
        console.log(res.data.data);
        this.$store.state.cityZone = res.data.data.zone;
         this.getCarModel();
      })
    },
    blurVin(){
      this.getCarModel();
    },
    //选择日期
    selectDate(value) {
      this.FrontInfo.RegisterDate = dateFormat(value, "yyyy-MM-dd");
      this.showDate = false;
    },
    //检验
    mileValidator(val){
      return /^[1-9]\d*$/.test(val);
    },
    vinValidator(val){
      return /^[A-HJ-NP-Z0-9]{17}$/.test(val);
    },
    //页面初始赋值
    assignData(){
      console.log('this.$store.state.FrontInfo is:',this.$store.state.FrontInfo);
      this.FrontInfo = this.$store.state.FrontInfo;
      this.hFVin = this.$store.state.FrontInfo.Vin;
    },
    //获取汽车型号
    getCarModel(){
      this.columns = [];
      this.modelIdArray = [];
      this.brandIdArray = [];
      this.seriesArray = [];
      this.brandNameArray = [];
      this.seriesNameArray = [];


      var Vin = this.$store.state.FrontInfo.Vin;
      checkCarModel(Vin).then(res => {
        console.log('modelInfo is :',res.data.data.modelInfo)
        if(res.data.data.status == 1){
          var modelInfoArray = res.data.data.modelInfo;
          modelInfoArray.map((cur,index) => {
            this.columns.push(cur.modelName);
            this.modelIdArray.push(cur.modelId);
            this.brandIdArray.push(cur.brandId);

            this.seriesArray.push(cur.seriesId);
            this.brandNameArray.push(cur.brandName);
            this.seriesNameArray.push(cur.seriesName);
          })

        }else{
          this.$toast.fail("车架号不合法！")
        }


      })
    },
    //选取汽车型号
    onConfirm(value) {
      this.modelName = value;
      this.modelId = this.modelIdArray[this.columns.indexOf(value)]
      this.brandId = this.brandIdArray[this.columns.indexOf(value)]
      this.series = this.seriesArray[this.columns.indexOf(value)]
      this.brandName = this.brandNameArray[this.columns.indexOf(value)]
      this.seriesName = this.seriesNameArray[this.columns.indexOf(value)]
      console.log("modelName is:",value + 'modelId is:',this.modelId + 'brandId is:', this.brandId,"series is:"+this.series,"brandName is:"+this.brandName,"seriesName is:"+this.seriesName)

      this.showPicker = false;
    },
    //手工录入
    HFClick() {
      this.showChangeChassisID = true;
      this.$store.state.FrontInfo.Vin = this.hFVin;
      this.$router.push({
        path:"/carInfoHandFill"
      });
    },
    //评估车价
    onSubmit(values) {
      const toast = this.$toast.loading({
        duration: 0,
        message: '保存中...',
        forbidClick: true,
        loadingType: 'spinner',
      });

      this.provinceId = this.$store.state.provinceCode
      this.cityId = this.$store.state.cityCode

      var carInfoData = Object.assign(values,
        {provinceId:this.provinceId},
        {cityId:this.cityId},
        {vehicleType:this.FrontInfo.VehicleType},
        {address:this.FrontInfo.Address},
        {useCharacter:this.FrontInfo.UseCharacter},
        {issueDate:this.FrontInfo.IssueDate},
        {seal:this.FrontInfo.Seal},
        {ownerModel:this.FrontInfo.Model},
        {model:this.modelId},
        {brand:this.brandId},
        {series:this.series},
        {brandName:this.brandName},
        {seriesName:this.seriesName},
        {branchLoanId:this.branchLoanId},
        {licenseUrl:this.$store.state.licenseUrl},
        {feedModel:this.feedModel},
        {managerId:this.managerId},
        {clueId: this.$store.state.clueId},
        {applyNum:this.$store.state.serialNumber},
        {franchiserId:this.$store.state.franchiserId}
        )
      console.log(carInfoData)

      //保存汽车信息
      saveCarInfo(carInfoData).then(res => {
        console.log('res.data.data.clueId',res.data.data.clueId)

        if(res.data.state === 'Y' && res.data.data.clueId != '0'){
          this.$store.state.clueId = res.data.data.clueId;

          //评估车辆价格
          var assessData = Object.assign(
            {clueId:this.$store.state.clueId},
            {vin:this.FrontInfo.Vin},
            {zone:this.$store.state.cityZone},
            {modelId:this.modelId},
            {mile:this.mileage},
            {regDate:this.FrontInfo.RegisterDate},
          )
          assessCarValue(assessData).then(res => {
            console.log('res.data.data',res.data.data)
            if(res.data.data.stateCode === 1){
              // 额度测算 获得车辆价格
              var clueId = this.$store.state.clueId
              amountCalculate(clueId).then(res => {
                if(res.data.data.price != ""){
                  toast.clear();
                  this.$store.state.price = res.data.data.price;
                  console.log(res.data.data.price)

                  setTimeout(() => {
                    this.$router.push({
                      path: "/carEvaluatingPrice",
                    });
                  }, 1000);

                }else{
                  toast.clear();
                  this.$toast.fail("车价评估失败！")
                  this.updateState();
                }
              })
            } else {
              //失败情况下调用更新状态
              toast.clear();
              this.$toast.fail("车价评估失败！")
              this.updateState();
            }

          })

        }else{
          toast.clear();
          this.$toast.fail('保存失败！')
        }

      })
    },
    //更新状态
    updateState(){
      var update = Object.assign(
        {state:'A010'},
        {clueId:this.$store.state.clueId}
      )
      updateLoanStatus(update).then(res => {
        if(res.data.data.stateCode === 0){
          this.$toast.fail('状态保存失败！')
        }
      })
    },

  }
};
</script>

<style scoped>
.alert-carInfo {
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  color: #ff9900;
  font-size: 15px;
  display: flex;
}
.alert-carInfo-icon {
  height: 20px;
  margin-top: 12px;
  margin-right: 5px;
}
.title{
  text-align: center;
}
</style>
