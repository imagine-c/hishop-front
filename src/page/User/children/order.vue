<template>
  <div>
    <y-shelf title="我的订单">
      <div slot="content">
        <div v-loading="loading" element-loading-text="加载中..." v-if="orderList.length" style="min-height: 10vw;">
          <div v-for="(item,i) in orderList" :key="i">
            <div class="gray-sub-title cart-title">
              <div class="first">
                <div>
                  <span class="date" v-text="item.createDate"></span>
                  <span class="order-id"> 订单号： <a @click="orderDetail(item.orderId)">{{item.orderId}}</a> </span>
                </div>
                <div class="f-bc">
                  <span class="price">单价</span>
                  <span class="num">数量</span>
                  <span class="operation">订单操作</span>
                </div>
              </div>
              <div class="last">
                <span class="sub-total">实付金额</span>
                <span class="order-detail"> <a @click="orderDetail(item.orderId)">查看详情 ><em class="icon-font"></em></a> </span>
              </div>
            </div>
            <div class="pr">
              <div class="cart" v-for="(good,j) in item.goodsList" :key="j">
                <div class="cart-l" :class="{bt:j>0}">
                  <div class="car-l-l">
                    <div class="img-box"><a @click="goodsDetails(good.productId)"><img :src="good.productImg" alt=""></a></div>
                    <div class="ellipsis"><a style="color: #626262;" @click="goodsDetails(good.productId)">{{good.productName}}</a></div>
                  </div>
                  <div class="cart-l-r">
                    <div>¥ {{Number(good.salePrice).toFixed(2)}}</div>
                    <div class="num">{{good.productNum}}</div>
                    <div class="type" v-if="item.orderStatus === '3'">
                      <el-button style="margin-left:20px" @click="_refundOrder(item.orderId,i)" type="warning" size="small" v-if="j<1" class="del-order">申请退款</el-button><br/>
                      <el-button style="margin-left:20px" @click="_confirmOrder(item.orderId,i)" type="primary" size="small" v-if="j<1" class="del-order">确认收货</el-button><br/>
                      <el-button style="margin-left:20px" @click="_delOrder(item.orderId,i)" type="danger" size="small" v-if="j<1" class="del-order">删除订单</el-button>
                    </div>
                    <div class="type" v-if="item.orderStatus === '9' && item.consign">
                      <el-button style="margin-left:20px" @click="_refundOrder(item.orderId,i)" type="warning" size="small" v-if="j<1" class="del-order">申请退款</el-button><br/>
                      <el-button style="margin-left:20px" @click="_confirmOrder(item.orderId,i)" type="primary" size="small" v-if="j<1" class="del-order">确认收货</el-button><br/>
                      <el-button style="margin-left:20px" @click="_delOrder(item.orderId,i)" type="danger" size="small" v-if="j<1" class="del-order">删除订单</el-button>
                    </div>
                    <div class="type" v-if="item.orderStatus === '9' && !item.consign">
                      <el-button style="margin-left:20px" @click="_refundOrder(item.orderId,i)" type="warning" size="small" v-if="j<1" class="del-order">申请退款</el-button><br/>
                      <el-button style="margin-left:20px" @click="_delOrder(item.orderId,i)" type="danger" size="small" v-if="j<1" class="del-order">删除订单</el-button>
                    </div>
                    <div class="type" v-if="item.orderStatus !== '1' && item.orderStatus !== '2' && item.orderStatus !== '3' && item.orderStatus !== '7' && item.orderStatus !== '9'">
                      <el-button style="margin-left:20px" @click="_delOrder(item.orderId,i)" type="danger" size="small" v-if="j<1" class="del-order">删除订单</el-button>
                    </div>
                    <div class="type" v-if="item.orderStatus === '1' || item.orderStatus === '2'">
                      <el-button style="margin-left:20px" @click="_refundOrder(item.orderId,i)" type="warning" size="small" v-if="j<1" class="del-order">申请退款</el-button><br/>
                      <el-button style="margin-left:20px" @click="_delOrder(item.orderId,i)" type="danger" size="small" v-if="j<1" class="del-order">删除订单</el-button>
                    </div>
                    <div class="type" v-if="item.orderStatus === '7'">
                      <el-button style="margin-left:20px" @click="_canrefundOrder(item.orderId,i)" type="warning" size="small" v-if="j<1" class="del-order">取消退款</el-button><br/>
                      <el-button style="margin-left:20px" @click="_delOrder(item.orderId,i)" type="danger" size="small" v-if="j<1" class="del-order">删除订单</el-button>
                    </div>

                  </div>
                </div>
                <div class="cart-r">
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div class="prod-operation pa" style="right: 0;top: 0;">
                <div class="total">¥ {{item.orderTotal}}</div>
                <div v-if="item.orderStatus === '0'">
                  <el-button @click="orderPayment(item.orderId)" type="primary" size="small">现在付款</el-button>
                </div>
                <div class="status" v-if="item.orderStatus !== '0'" v-html="getOrderStatus(item.orderStatus,item.consign)"></div>
              </div>
            </div>

          </div>
        </div>
        <div v-loading="loading" element-loading-text="加载中..." class="no-info" v-else>
          <div style="padding: 100px 0;text-align: center">
            你还未创建过订单
          </div>
        </div>
      </div>
    </y-shelf>
    <div style="float:right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import { orderList, delOrder, confirmOrder, refundOrder, canrefundOrder } from '/api/goods'
  import YShelf from '/components/shelf'
  import { getStore } from '/utils/storage'
  export default {
    data () {
      return {
        orderList: [0],
        userId: '',
        orderStatus: '',
        loading: true,
        currentPage: 1,
        pageSize: 5,
        total: 0
      }
    },
    methods: {
      message (m) {
        this.$message.error({
          message: m
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this._orderList()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this._orderList()
      },
      orderPayment (orderId) {
        window.open(window.location.origin + '#/order/payment?orderId=' + orderId)
      },
      goodsDetails (id) {
        window.open(window.location.origin + '#/goodsDetails?productId=' + id)
      },
      orderDetail (orderId) {
        this.$router.push({
          path: 'orderDetail',
          query: {
            orderId: orderId
          }
        })
      },
      getOrderStatus (status, consign) {
        if (status === '1') {
          return '支付审核中'
        } else if (status === '2') {
          return '待发货'
        } else if (status === '3') {
          return '待收货'
        } else if (status === '4') {
          return '交易成功'
        } else if (status === '5') {
          return '交易关闭'
        } else if (status === '6') {
          return '支付失败'
        } else if (status === '7') {
          return '退款中'
        } else if (status === '8') {
          return '退款成功'
        } else if (status === '9' && consign) {
          return '已取消退款'
        } else if (status === '9' && !consign) {
          return '已取消退款<br/><br/>等待发货'
        }
      },
      _orderList () {
        let params = {
          params: {
            userId: this.userId,
            size: this.pageSize,
            page: this.currentPage
          }
        }
        orderList(params).then(res => {
          if (res.success === true) {
            this.orderList = res.result.data
            this.total = res.result.total
            this.loading = false
          } else {
            this.message('订单加载失败')
          }
        })
      },
      _canrefundOrder (orderId, i) {
        this.$confirm('确定要取消退款吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            params: {
              orderId: orderId
            }
          }
          canrefundOrder(params).then(res => {
            if (res.success === true) {
              this.orderList[i].orderStatus = '9'
              this.$message({
                type: 'success',
                message: '取消退款成功'
              })
            } else {
              this.message('取消退款失败!')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      _refundOrder (orderId, i) {
        this.$confirm('确定要退款吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            params: {
              orderId: orderId
            }
          }
          refundOrder(params).then(res => {
            if (res.success === true) {
              this.orderList[i].orderStatus = '7'
              this.$message({
                type: 'success',
                message: '申请其提交，请等待审核'
              })
            } else {
              this.message('申请退款失败!')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      _confirmOrder (orderId, i) {
        this.$confirm('确定要收货吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            params: {
              orderId: orderId
            }
          }
          confirmOrder(params).then(res => {
            if (res.success === true) {
              this.orderList[i].orderStatus = '4'
              this.$message({
                type: 'success',
                message: '已收货'
              })
            } else {
              this.message('确认收货失败!')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      _delOrder (orderId, i) {
        this.$confirm('确定要删除该订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            params: {
              orderId: orderId
            }
          }
          delOrder(params).then(res => {
            if (res.success === true) {
              // 在数组中删除
              this.orderList.splice(i, 1)
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
      }
    },
    created () {
      this.userId = getStore('userId')
      this._orderList()
    },
    components: {
      YShelf
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/style/mixin";

  .gray-sub-title {
    height: 38px;
    padding: 0 24px;
    background: #EEE;
    border-top: 1px solid #DBDBDB;
    border-bottom: 1px solid #DBDBDB;
    line-height: 38px;
    font-size: 12px;
    color: #666;
    display: flex;
    span {
      display: inline-block;
      height: 100%;
    }
    .first {
      display: flex;
      justify-content: space-between;
      flex: 1;
      .f-bc {
        > span {
          width: 112px;
          text-align: center;
        }
      }
    }
    .last {
      width: 230px;
      text-align: center;
      display: flex;
      border-left: 1px solid #ccc;
      span {
        flex: 1;
      }
    }
  }

  .bt {
    border-top: 1px solid #EFEFEF;
  }

  .date {
    padding-left: 0px;
  }

  .order-id {
    margin-left: 25px;
  }

  .cart {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    &:hover {
      .del-order {
        display: block;
      }
    }
    .del-order {
      display: none;
    }
    .cart-l {
      display: flex;
      align-items: center;
      flex: 1;
      padding: 15px 0;
      justify-content: space-between;
      position: relative;
      &:before {
        position: absolute;
        content: ' ';
        right: -1px;
        top: 0;
        width: 1px;
        background-color: #EFEFEF;
        height: 100%;
      }
      .ellipsis {
        margin-left: 20px;
        width: 220px;
      }
      .img-box {
        border: 1px solid #EBEBEB;
      }
      img {
        display: block;
        @include wh(80px);
      }
      .cart-l-r {
        display: flex;
        > div {
          text-align: center;
          width: 112px;
        }
      }
      .car-l-l {
        display: flex;
        align-items: center;
      }
    }
    .cart-r {
      width: 230px;
      display: flex;
      span {
        text-align: center;
        flex: 1;
      }
    }
  }

  .prod-operation {
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 254px;
    div {
      width: 100%;
      text-align: center;
    }
    div:last-child {
      padding-right: 24px;
    }
  }
</style>
