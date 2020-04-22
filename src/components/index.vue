<template>
  <div>
    <van-nav-bar title="" :right-text="city" @click-right="showAddress = true" />

    <!-- 进度栏 -->
    <div v-show="state != 4" class="step">
      <van-steps :active="0">
        <van-step>车辆认证</van-step>
        <van-step>实名认证</van-step>
        <van-step>完成初筛</van-step>
      </van-steps>
    </div>
    <div>
      <span class="title">拍摄行驶证</span>
      <div class="alert-content">
        <span>温馨提示：本次贷款车辆仅办理抵押登记手续，并不影响您使用车辆，您的车辆登记证在贷款期间由我行进行保管</span>
      </div>
    </div>


      <!--上传图片-->
      <div class="verift-photo">
        <div class="carItem">
          <van-uploader
            v-model="fileList"
            :max-count="1"
            :after-read="afterRead"
            :style="{ height: '100%', width: '100%'}"
          />
        </div>

      <!--<input-->
        <!--style="display:none"-->
        <!--type="file"-->
        <!--id="uploadFile"-->
        <!--accept="image/*"-->
        <!--multiple="multiple"-->
        <!--v-on:change="readLocalFile()"-->
      <!--/>-->
      <!--<van-image class="image-center-item" :src="url" @click="imgClick" />-->


    </div>
    <p class="license">点击上传行驶证首页</p>
    <van-overlay :show="showLoading">
      <div class="wrapper">
        <van-loading type="spinner" />
      </div>
    </van-overlay>

    <div class="bottom-button">
      <van-button class="bottom-button-item" type="default" @click="showChangeChassisID = true">手动填写</van-button>
      <van-button class="bottom-button-item" type="primary" @click="showAlert = true">拍摄提示</van-button>
    </div>

    <!-- city popup-->
    <van-popup
      v-model="showAddress"
      position="bottom"
      A
      get-container="body"
      :close-on-click-overlay="false"
    >
      <van-area
        :area-list="areaList"
        :value="cityValue"
        :columns-num="2"
        title="查看城市"
        confirm-button-text="确定"
        @confirm="onSelectCity"
        @cancel="hideProCityList"
      />
    </van-popup>

    <!--拍摄提示 popup-->
    <van-overlay :show="showAlert" @click="showAlert = false">
      <div class="shootAlert">
        <span>拍摄提示</span>
        <ul>
          <li>请拍摄行驶证原件</li>
          <li>照片要四角对齐,如有模糊、遮挡、无法识别等情况则不与认证</li>
          <li>只支持非运营车办理</li>
        </ul>
        <div class="shootAlert-img">
          <div class="shootAlert-item">
            <van-image src="http://iph.href.lu/500x400?text=标准样式" />
            <span>标准</span>
          </div>
          <div class="shootAlert-item">
            <van-image src="http://iph.href.lu/500x400?text=边框缺失" />
            <span>边框缺失</span>
          </div>
          <div class="shootAlert-item">
            <van-image src="http://iph.href.lu/500x400?text=照片模糊" />
            <span>照片模糊</span>
          </div>
          <div class="shootAlert-item">
            <van-image src="http://iph.href.lu/500x400?text=闪光强烈" />
            <span>闪光强烈</span>
          </div>
        </div>
      </div>
    </van-overlay>

    <!--手动填写popup-->
    <van-popup v-model="showChangeChassisID" position="bottom">
      <div class="changeChassisID">
        <span class="changeChassisID-title">手工录入</span>
        <van-form @submit="HFClick">
          <van-field
            v-model="hFchassisID"
            label="车架号:"
            placeholder="请填写车架号"
            :rules="[{validator:vinValidator, required: true, message: '请填写正确的车架号' }]"
          />
          <van-button style="margin-top:25px" round block type="info">手工录入</van-button>
        </van-form>
      </div>
    </van-popup>

    <!--未开通城市提示-->
    <van-popup
      v-model="notOpenCity"
      :style="{ width: '80%'}"
      get-container="body"
      :close-on-click-overlay="false"
    >
      <p class="license">您现在所在的城市暂未开通服务</p>
      <div class="bottom-button">
        <van-button class="bottom-button-item" type="info" @click="checkOpenedCity">点击查看已开通城市</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getUrlParam } from "../common/common.js";
import { OCRdriving } from "../request/api";
import { provinceCity } from "../request/api";
import { searchCityZone } from "../request/api";

export default {
  data() {
    return {
      hFchassisID: "",
      city: "",
      cityCode:'',
      cityValue:'',
      state: "", //1-初筛 2-助手app直销 3-车惠贷直销 4-单个功能
      url: "http://iph.href.lu/500x400?text=OCR扫描",
      showAddress: false,
      showAlert: false,
      showLoading: false,
      showChangeChassisID: false,
      currentRate: 20,
      areaList: {
        province_list: {

        },
        city_list: {

        }
      },
      fileList: [],
      notOpenCity: false,
      adcode:'',
      adcodeSub:'',
      count:this.$store.state.count,
      cityCodeList:[],
      lng:'',
      lat:'',
      cityNameArr:[],
      cityCodeSub:[],

    };
  },
  created(){

  },
  mounted() {
    console.log(getUrlParam())
    this.$store.commit('updateParam',getUrlParam())
    console.log("his.$store.state.managerId",this.$store.state.managerId);
    this.getProvinceCity();
  },
  watch:{
    "city":{
      deep:true,
      handler:function (newValue,oldValue) {
        console.log('newValue is',newValue,"oldValue is",oldValue)
        if(newValue == ""){
          this.notOpenCity = true;
        }else{
          this.notOpenCity = false;
        }
      }
    },
  },
  methods: {
    //校验
    vinValidator(val){
      return /^[A-HJ-NP-Z0-9]{17}$/.test(val);
    },
    afterRead(file){
      console.log('file is :',file)
      var baseImgUrl = file.content;
      const toast = this.$toast.loading({
        duration: 0,
        message: '识别中...',
        forbidClick: true,
        loadingType: 'spinner',
      });

      OCRdriving(baseImgUrl).then(res => {
        toast.clear();
        if(res.data.data != ""){
          this.$toast.success(res.data.msg);
          console.log(res.data.data.FrontInfo)
          this.$store.state.FrontInfo = res.data.data.FrontInfo;
          this.$store.state.licenseUrl = res.data.data.licenseUrl;
          this.$router.push({
            path:'/carInfoOCR',
            // query:{
            //   state:this.state,
            //   managerId:this.managerId,
            //   branchLoanId:this.branchLoanId
            // }
          })
        }else{
          this.$toast.fail(res.data.msg)
        }

      })
    },

    //加载城市列表
    getProvinceCity(){
      const toast = this.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      provinceCity().then(res => {
        toast.clear();
        console.log(res.data)
        this.areaList = res.data.data;

        var list = res.data.data.city_list;
        console.log("list",list)
        for(let i in list){
          this.cityCodeList.push(i)
          this.cityCodeSub.push(i.substr(0,4))
          this.cityNameArr.push(list[i])
        }
        console.log('this.cityCodeList is',this.cityCodeList)
        console.log('this.cityCodeSub is',this.cityCodeSub)
        console.log('this.cityNameArr is',this.cityNameArr)
        this.cityValue = this.cityCodeList[0];

        this.locatingCity();

      })
    },
    //定位城市
    locatingCity() {
      console.log("进入定位方法")
      var that = this;
      // 浏览器定位
      AMap.service('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: 'RB'
        })
        console.log("进入AMap.Geolocation")
        geolocation.getCurrentPosition((status,result) =>{
          // alert(status,result)
          if (result && result.position) {
            that.lng = result.position.lng;
            that.lat = result.position.lat;
            // alert(result.position)
            console.log("进入geolocation")
            AMap.plugin('AMap.Geocoder', function() {
              var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
              });
              console.log("进入AMap.Geocoder")
              geocoder.getAddress([that.lng, that.lat], function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  if (result && result.regeocode) {
                    console.log('result=======',result)
                    that.adcode = result.regeocode.addressComponent.adcode;
                    that.adcodeSub = that.adcode.substr(0,4)
                    console.log("定位城市的码值:",that.adcode,that.adcodeSub ,result.regeocode.addressComponent.province)
                    var speCity = result.regeocode.addressComponent.province
                    if(speCity == "上海市" || speCity == "北京市" || speCity == "天津市" || speCity == "重庆市"){
                      that.city = result.regeocode.addressComponent.province
                    }else{
                      that.city = result.regeocode.addressComponent.city
                    }
                    that.checkIsOpenCity();
                  }
                }else {
                  this.$toast.fail('地址获取失败')
                }
              });

            })

          }else{
            // that.$toast.fail('定位失败')
            that.notOpenCity = true;
          }
        })

      })


    },
    //判断浏览器定位城市是否开通
    checkIsOpenCity(){
      console.log("判断定位城市的码值",this.adcodeSub)
      console.log("========",this.cityCodeSub.indexOf(this.adcodeSub))
      if(this.cityCodeSub.indexOf(this.adcodeSub) != -1 ){
        this.notOpenCity = false;
        this.cityCodeSub.map((cur,index) => {
          if(cur == this.adcodeSub){
            this.cityCode = this.cityCodeList[index]
            this.$store.state.cityCode = this.cityCodeList[index]
          }
        })
        this.$store.state.provinceCode = this.adcodeSub.substr(0,2)+"0000"
        console.log("this.cityCode is",this.cityCode,this.$store.state.provinceCode)
        //获取城市区域
        this.getCityZone()

      }else{
        this.notOpenCity = true;
      }

    },
    //ip定位
    // ipLocateCity(){
    //   var that = this;
    //   AMap.plugin("AMap.CitySearch", function() {
    //     var citySearch = new AMap.CitySearch();
    //     citySearch.getLocalCity(function(status, result) {
    //       if (status === "complete" && result.info === "OK") {
    //         // 查询成功，result即为当前所在城市信息
    //         console.log('---------------',status,result);
    //         that.city = result.city;
    //         //adcode 是provinceCode
    //         that.adcode = result.adcode;
    //         console.log("ip定位的城市，adcode", that.city,that.adcode);
    //
    //         that.$store.state.provinceCode = result.adcode;
    //         console.log(that.$store.state.provinceCode)
    //         that.getIpCityCode();
    //
    //       }
    //     });
    //   });
    // },

    //通过cityName获取ip定位城市的cityCode
    // getIpCityCode(){
    //   let that = this
    //   this.cityNameArr.map((cur,index) => {
    //     if(cur == that.city){
    //       this.cityCode = this.cityCodeList[index];
    //       this.$store.state.cityCode = this.cityCodeList[index]
    //       console.log('this.cityCode ip',this.cityCode)
    //     }
    //   })
    // },

    //判断所选城市是否开通
    checkIsSelectOpenCity(){
      if(this.areaList.city_list[this.cityCode] == undefined){
        this.notOpenCity = true;
      }
    },

    //选中的城市
    onSelectCity(area) {
      console.log("area is:",area)
      this.city = area[1].name;
      this.cityCode = area[1].code;

      this.$store.state.provinceCode = area[0].code;
      this.$store.state.cityCode = area[1].code;
      console.log(this.$store.state.provinceCode,this.$store.state.cityCode)

      this.showAddress = false;
      /**
       * 只可定位，不可选择城市
       * */
      // this.notOpenCity = true;
      //获取城市区域
     this.getCityZone()
    },
    hideProCityList(){
      this.showAddress = false;
      // this.notOpenCity = true;
      // this.checkIsSelectOpenCity()
    },
    checkOpenedCity(){
      this.showAddress = true;
      this.notOpenCity = false;
    },
    //获取城市区域
    getCityZone(){
      searchCityZone(this.cityCode).then(res => {
        console.log(res.data.data);
        this.$store.state.cityZone = res.data.data.zone;
      })
    },
    //手工录入
    HFClick() {
      let that = this;
      console.log(that.hFchassisID)
      this.$router.push({
        path:"/carInfoHandFill",
        query:{
          hFVin:that.hFchassisID,
        }
      });
    },

    //之前input OCR扫描
    // readLocalFile() {
    //   let that = this;
    //   var localFile = document.getElementById("uploadFile").files[0];
    //   var reader = new FileReader();
    //   var content;
    //   reader.onload = function(event) {
    //     content = event.target.result;
    //     that.url = content;
    //     that.showLoading = true;
    //
    //     // 临时
    //     setTimeout(() => {
    //       that.showLoading = false;
    //       that.$router.push({
    //         path:'/carInfoOCR',
    //         query:{
    //           state:that.state
    //         }
    //       });
    //     }, 3000);
    //
    //     // current.imgs.push(content); //获取图片base64代码
    //   };
    //   reader.onerror = function(event) {
    //     alert("error");
    //   };
    //   content = reader.readAsDataURL(localFile, "UTF-8");
    //   var sss = document.getElementById("uploadFile").value;
    //   console.log('sss is :',sss);
    // },
    // imgClick() {
    //   document.getElementById("uploadFile").click();
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.currentCity {
  padding-left: 15px;
  padding-right: 15px;
  background: #d5d5d5;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 20px;
}
.title {
  padding-left: 16px;
  font-size: 16px;
  display: block;
}
.alert-content {
  margin: 3% 20px;
  font-size: 12px;
}
.image-center {
  width: 90%;
  margin: 0 auto;
  margin-top: 50px;
}
.image-center-item {
  width: 100%;
  height: 180px;
}
.bottom-button {
  margin-top: 30px;
  display: flex;

  justify-content: space-between;
}
.bottom-button-item {
  margin: 30px;
  width: 340%;
}
.shootAlert {
  width: 80%;
  height: 200px;
  margin: 0 auto; /*水平居中*/
  position: relative; /*脱离文档流*/
  top: 50%; /*偏移*/
  margin-top: -100px;
  background: #fff;
  color: #a2a2a2;
  padding: 20px;
}
.shootAlert-item {
  width: 20%;
}
.shootAlert-img {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  text-align: center;
  font-size: 12px;
  height: 160px;
}

</style>

<style>
  .verift-photo {
    width: 90%;
    margin: 0 auto;
    margin-top: 10%;
  }
  .carItem{
    width: 75%;
    margin: 0 auto;
    height: 180px;
    border-radius: 6px;
    background: url("../assets/car.png") no-repeat ;
    background-size: contain;
    margin-bottom: 5%;
  }
  .carItem .van-uploader__upload{
    background-color: transparent;
    width: 100%;
    height: 180px;
  }
  .carItem .van-uploader__input{
    width: auto;
  }
  .carItem .van-uploader{
    width: 100%;
  }
  .carItem .van-uploader__preview-image,.van-uploader__preview{
    width: 100%;
    height: 180px;
    margin: 0;
  }
</style>
