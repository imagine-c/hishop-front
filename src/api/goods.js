import http from './public'
// 商品列表
export const getAllGoods = (params) => {
  return http.fetchGet('/goods/allGoods', params)
}
// 获取购物车列表
export const getCartList = (params) => {
  return http.fetchPost('/member/cartList', params)
}
// 加入购物车
export const addCart = (params) => {
  return http.fetchPost('/member/addCart', params)
}
// 删除购物车
export const delCart = (params) => {
  return http.fetchPost('/member/delCart', params)
}
// 删除购物车勾选商品
export const delCartChecked = (params) => {
  return http.fetchPost('/member/delCartChecked', params)
}
// 编辑购物车
export const cartEdit = (params) => {
  return http.fetchPost('/member/cartEdit', params)
}
// 全选
export const editCheckAll = (params) => {
  return http.fetchPost('/member/editCheckAll', params)
}
// 删除整条购物车
export const cartDel = (params) => {
  return http.fetchPost('/member/cartDel', params)
}
// 获取用户地址
export const addressList = (params) => {
  return http.fetchPost('/member/addressList', params)
}
// 获取收货地json
export const getAddressJson = (params) => {
  return http.fetchGet('/member/getAddrJson', params)
}
// 通过id获取地址
export const getAddress = (params) => {
  return http.fetchPost('/member/address', params)
}
// 修改收货地址
export const addressUpdate = (params) => {
  return http.fetchPost('/member/updateAddress', params)
}

// 修改邮箱
export const emailUpdate = (params) => {
  return http.fetchPost('/member/updateEmail', params)
}
// 添加收货地址
export const addressAdd = (params) => {
  return http.fetchPost('/member/addAddress', params)
}
// 删除收货地址
export const addressDel = (params) => {
  return http.fetchPost('/member/delAddress', params)
}
// 生成订单
export const submitOrder = (params) => {
  return http.fetchPost('/member/addOrder', params)
}
// 支付宝支付
export const payMent = (params) => {
  return http.fetchPost('/member/toAliPay', params)
}
// 支付成功
export const paid = (params) => {
  return http.fetchGet('/member/paid', params)
}
// 获取用户订单
export const orderList = (params) => {
  return http.fetchGet('/member/orderList', params)
}
// 获取单个订单详情
export const getOrderDet = (params) => {
  return http.fetchGet('/member/orderDetail', params)
}
// 取消订单
export const cancelOrder = (params) => {
  return http.fetchPost('/member/cancelOrder', params)
}
// 商品详情
export const productDet = (params) => {
  return http.fetchGet('/goods/productDet', params)
}
// 删除订单
export const delOrder = (params) => {
  return http.fetchGet('/member/delOrder', params)
}
// 确认收货
export const confirmOrder = (params) => {
  return http.fetchGet('/member/confirm', params)
}
// 申请退款
export const refundOrder = (params) => {
  return http.fetchGet('/member/refund', params)
}
// 取消申请退款
export const canrefundOrder = (params) => {
  return http.fetchGet('/member/cancelRefund', params)
}
// 商品列表
export const getSearch = (params) => {
  return http.fetchGet('/goods/search', params)
}
// 快速搜索
export const getQuickSearch = (params) => {
  return http.fetchGet('/goods/quickSearch', params)
}
