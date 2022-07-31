<template>
  <div>
    <y-shelf title="收货地址">
      <span slot="right"><y-button text="添加收货地址" style="margin: 0" @btnClick="update()"></y-button></span>
      <div slot="content">
        <!--标题-->
        <div class="table-title">
          <span class="name">姓名</span> <span class="address">收货
          地址</span> <span class="tel">电话</span>
        </div>
        <div v-if="addList.length">
          <div class="address-item" v-for="(item,i) in addList" :key="i">
            <div class="name">{{item.userName}}</div>
            <div class="address-msg">{{item.provinceName}}{{item.cityName}}{{item.areaName}}{{item.streetName}}{{item.detailed}}</div>
            <div class="telephone">{{item.tel}}</div>
            <div class="defalut">
              <a @click="changeDef(item)"
                 href="javascript:;"
                 v-text="item.isDefault?'( 默认地址 )':'设为默认'"
                 :class="{'defalut-address':item.isDefault}"></a>
            </div>
            <div class="operation">
              <el-button type="primary" icon="edit" size="small"  @click="update(item)"></el-button>
              <el-button type="danger" icon="delete" size="small" :data-id="item.addressId" @click="del(item.addressId,i)"></el-button>
            </div>
          </div>
        </div>
        <div v-else>
          <div style="padding: 80px 0;text-align: center">
            <div style="font-size: 20px">你还未添加收货地址</div>
            <div style="margin: 20px ">
              <y-button text="添加地址" @btnClick="update()"></y-button>
            </div>
          </div>
        </div>
      </div>
    </y-shelf>
    <y-popup :open="popupOpen" @close='popupOpen=false' :title="popupTitle">
      <div slot="content" class="md" :data-id="msg.addressId">
        <div>
          <input type="text" placeholder="收货人姓名" v-model="msg.userName">
        </div>
        <div>
          <input type="number" placeholder="手机号码" v-model="msg.tel">
        </div>
        <div>
          <el-cascader
            :style=""
            size="large"
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader>
        </div>
        <div>
          <input type="text" placeholder="详细地址" v-model="msg.detailed">
        </div>
        <div>
          <el-checkbox class="auto-login" v-model="msg.isDefault">设为默认</el-checkbox>
        </div>
        <y-button text='保存'
                  class="btn"
                  :classStyle="btnHighlight?'main-btn':'disabled-btn'"
                  @btnClick="save({userId:userId,addressId:msg.addressId,userName:msg.userName,
                  tel:msg.tel,detailed:msg.detailed,isDefault:msg.isDefault,
                  provinceCode: msg.provinceCode,cityCode: msg.cityCode,
                  areaCode: msg.areaCode,streetCode: msg.streetCode})">
        </y-button>
      </div>
    </y-popup>
  </div>
</template>
<script>
  import { addressList, addressUpdate, addressAdd, addressDel, getAddressJson } from '/api/goods'
  import YButton from '/components/YButton'
  import YPopup from '/components/popup'
  import YShelf from '/components/shelf'
  import { getStore } from '/utils/storage'
  export default {
    data () {
      return {
        addList: [],
        popupOpen: false,
        popupTitle: '管理收货地址',
        msg: {
          addressId: '',
          userName: '',
          tel: '',
          provinceCode: '',
          cityCode: '',
          areaCode: '',
          streetCode: '',
          detailed: '',
          isDefault: false
        },
        userId: '',
        options: [],
        selectedOptions: []
      }
    },
    computed: {
      btnHighlight () {
        let msg = this.msg
        return msg.userName && msg.tel && msg.detailed
      }
    },
    methods: {
      message (m) {
        this.$message.error({
          message: m
        })
      },
      _addressList () {
        addressList({userId: this.userId}).then(res => {
          let data = res.result
          if (data.length) {
            this.addList = res.result
            this.addressId = res.result[0].addressId || '1'
          } else {
            this.addList = []
          }
        })
      },
      _addressUpdate (params) {
        addressUpdate(params).then(res => {
          if (res.success === true) {
            this.selectedOptions = []
            this._addressList()
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          } else {
            this.selectedOptions = []
            this.message(res.message)
          }
        })
      },
      _addressAdd (params) {
        addressAdd(params).then(res => {
          if (res.success === true) {
            this.selectedOptions = []
            this._addressList()
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          } else {
            this.selectedOptions = []
            this.message(res.message)
          }
        })
      },
      changeDef (item) {
        if (!item.isDefault) {
          item.isDefault = true
          this._addressUpdate(item)
        }
        return false
      },
      isPhone (v) {
        var rex = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        var re = new RegExp(rex)
        if (re.test(v)) {
          return true
        }
        return false
      },
      // 保存
      save (p) {
        if (this.isPhone(p.tel)) {
          this.popupOpen = false
          if (p.addressId) {
            this._addressUpdate(p)
          } else {
            delete p.addressId
            this._addressAdd(p)
          }
        } else {
          this.message('手机号格式不正确！')
        }
      },
      del (addressId, i) {
        this.$confirm('确定要删除该收货地址?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          addressDel({addressId: addressId}).then(res => {
            if (res.success === true) {
              this.addList.splice(i, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.message('删除失败')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 修改
      update (item) {
        this.popupOpen = true
        if (item) {
          this.popupTitle = '管理收货地址'
          this.msg.userName = item.userName
          this.msg.tel = item.tel
          this.msg.detailed = item.detailed
          this.msg.isDefault = item.isDefault
          this.msg.addressId = item.addressId
          this.msg.provinceCode = item.provinceCode
          this.msg.cityCode = item.cityCode
          this.msg.areaCode = item.areaCode
          this.msg.streetCode = item.streetCode
          this.selectedOptions = [item.provinceCode, item.cityCode, item.areaCode, item.streetCode]
        } else {
          this.popupTitle = '新增收货地址'
          this.msg.userName = ''
          this.msg.tel = ''
          this.msg.detailed = ''
          this.msg.isDefault = false
          this.msg.addressId = ''
          this.selectedOptions = []
        }
      },
      getAddrJson () {
        getAddressJson().then(res => {
          if (res.success === true) {
            this.options = JSON.parse(res.result)
          } else {
            this.message('数据加载失败！')
          }
        })
      },
      handleChange (value) {
        this.msg.provinceCode = value[0]
        this.msg.cityCode = value[1]
        this.msg.areaCode = value[2]
        this.msg.streetCode = value[3]
      }
    },
    created () {
      this.userId = getStore('userId')
      this._addressList()
    },
    mounted () {
      this.getAddrJson()
    },
    components: {
      YButton,
      YPopup,
      YShelf
    }
  }
</script>
<style scoped lang="scss">
  .table-title {
    position: relative;
    z-index: 1;
    line-height: 38px;
    height: 38px;
    padding: 0 0 0 38px;
    font-size: 12px;
    background: #eee;
    border-bottom: 1px solid #dbdbdb;
    border-bottom-color: rgba(0, 0, 0, .08);
    .name {
      float: left;
      text-align: left;
    }
    span {
      width: 137px;
      float: left;
      text-align: center;
      color: #838383;
    }
    .address {
      margin-left: 115px;
    }
    .tel {
      margin-left: 195px;
    }
  }

  .address-item {
    display: flex;
    align-items: center;
    height: 115px;
    text-align: center;
    .name {
      width: 106px;
    }
    .address-msg {
      flex: 1;
    }
    .telephone {
      width: 160px;
    }
    .defalut {
      width: 80px;
      > a {
        text-align: center;
        /*display: none;*/
      }
    }
    .operation {
      width: 135px;
      a {
        padding: 10px 5px;
      }
    }
    &:hover {
      .defalut > a {
        display: block;
      }
    }
  }

  .address-item + .address-item {
    border-top: 1px solid #CFCFCF;
  }

  .defalut-address {
    color: #626262;
    display: block;
    pointer-events: none;
    cursor: default;
  }
  .el-cascader--large{
    font-size: 16px;
    width: 100%;
  }
  .md {
    > div {
      text-align: left;
      margin-bottom: 15px;
      > input {
        width: 100%;
        height: 50px;
        font-size: 18px;
        padding: 10px 20px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-shadow: 0 3px 5px -4px rgba(0, 0, 0, .4) inset, -1px 0 3px -2px rgba(0, 0, 0, .1) inset;
        line-height: 46px;
      }
    }
  }

  .btn {
    margin: 0;
    width: 100%;
    height: 50px;
    font-size: 14px;
    line-height: 48px
  }
</style>
