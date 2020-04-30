import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    cityCode:'',
    provinceCode:'',
    cityZone:'',
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
      Seal:"",
    },
    licenseUrl:'',

    price:'',

    carBrandName:'',
    checkOrder:'',
    agreement:'',
    ScreenResult:'',
    managerName:'',
    managerTel:'',



    /*
    *  参数
    * */
    managerId:'',
    type:'',
    clueId:'',
    id:'',
    state:'',
    branchLoanId:'',
    token:'',
    serialNumber:''


  },
  //commit
  mutations:{
    updateParam(state,param){
      console.log('param', param["id"], state)
      state.managerId = param["managerId"];
      state.id = param["id"];
      state.type = param["type"];
      state.clueId = param["clueId"];
      state.branchLoanId = param['branchLoanId'];
      state.state = param["state"];
      state.token = param["token"];
    }
  },
  // same as computed
  getters:{

  },
  //异步操作-dispatch
  actions:{

  }
})


export default store


// export const store = new Vuex.Store({
//   state: {
//     isAll:'', // 1-全部 0-单一功能
//
//   },
//   mutations:{
//       setIsAll(state, value){
//           state.isAll = value
//       }
//   }
// })
