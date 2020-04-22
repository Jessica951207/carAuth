<template>
  <div>
    <van-nav-bar title="车辆品牌" left-text="返回" left-arrow @click-left="onClickLeft" />
    <form action="/">
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        @input="HandleSearch"
      />
    </form>

    <p class="title">常用车辆品牌</p>
      <div class="car">
        <p class="font" v-for="item in oftenBrand" @click="chooseBrand(item)">{{item}}</p>
      </div>
    <p class="title">所有车辆品牌</p>
      <div class="car">
        <p class="font" v-for="item in brandLists" @click="chooseBrand(item)">{{item}}</p>
      </div>

  </div>
</template>

<script>
  import { getUrlParam } from "../../common/common.js";
  import { carBrandList } from '../../request/api'
export default {
  data() {
    return {
      state:'',
      value: "",
      oftenBrandList:[
        "大众",
        "宝马",
        "奔驰",
        "奥迪",
        "丰田",
        "本田",
        "别克",
        "福特",
        "雪佛兰",
      ],
      oftenBrand:[],
      allBrandList:[],
      brandLists:[],
      carBrand:'',
      managerId:''
    };
  },
  mounted(){
    this.managerId = getUrlParam("managerId")
    console.log(this.managerId)

    this.state = this.$route.query.state

    this.oftenBrand = this.oftenBrandList;
    this.getCarBrand();
  },
  methods: {
    //实时搜索
    HandleSearch(value){
      console.log('search is :',value)
      var that = this;
      that.oftenBrand = [];
      that.brandLists = [];
      this.oftenBrandList.map(function (cur,index) {
        if(cur.indexOf(value) > -1){
          console.log(cur)
          that.oftenBrand.push(cur)
        }
      })
      this.allBrandList.map(function (cur,index) {
        if(cur.ceName.indexOf(value) > -1){
          console.log(cur.ceName)
          that.brandLists.push(cur.ceName)
        }
      })
    },
    //选中的品牌
    chooseBrand(value){
      this.carBrand = value;
      this.$store.state.carBrand = value;
      console.log('this.$store.state.carBrand',this.$store.state.carBrand)
      this.onClickLeft();
    },
    //获取所有车辆品牌
    getCarBrand(){
      var that = this;
      var carInfo = Object.assign(
        {ceInitial:''},
        {pageNum:''},
        {pageSize:''}
      )
      carBrandList(carInfo).then(res => {
        console.log(res.data)
        this.allBrandList = res.data.data.brandList;
        console.log(this.allBrandList)
        this.allBrandList.map(function (cur,index) {
          that.brandLists.push(cur.ceName)
        })
        console.log(that.brandLists)
      })
    },

    onClickLeft() {
      let that = this;
      this.$router.replace({
        path:'/zhuanXiangDai',
        query:{
          state:that.state,
          managerId:that.managerId
          // carBrand:that.carBrand
        }
      });
    }
  }
};
</script>

<style scoped>
  .title{
    font-size: 14px;
    padding-left: 4%;
    color: #0870dc;
  }
  .car{
    width: 100%;
  }
  .font{
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    box-sizing: border-box;
    width: 90%;
    margin: 0 auto;
    padding: 10px 0;
    overflow: hidden;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
    border-bottom: 1px solid #f2f3f5;
  }
  .car:not(:last-child)::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 0;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
  }
</style>
