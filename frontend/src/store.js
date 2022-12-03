import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productListAdminReducer,
  productDetailsAdminReducer,
  productCreateReducer,
  productUpdateReducer,
  productCreateReviewReducer,
  productCoponReducer,
  productTopReducer
} from "./reducer/ProductReducers";
import { CartReducer } from "./reducer/CartReducer";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  updateUserProfileReducer,
  UserListReducer,
  deleteUserReducer,
  updateUserReducer,
  userLoginGoogleReducer
} from "./reducer/UserReducer";
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  MyOrdersReducer,
  OrdersListReducer,
  orderDeliverReducer
} from "./reducer/orderReducer";

const reducer = combineReducers({
  productList: productListReducer,
  productListAdmin:productListAdminReducer,
  productDetails: productDetailsReducer,
  productDetailsAdmin: productDetailsAdminReducer,
  productCreate:productCreateReducer,
  productUpdate:productUpdateReducer,
  productDelete:productDeleteReducer,
  productCopon:productCoponReducer,
  productTop:productTopReducer,
  CreateProductReview:productCreateReviewReducer,
  cart: CartReducer,
  userLogin: userLoginReducer,
  userLoginGoogle:userLoginGoogleReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdate: updateUserProfileReducer,
  usersList: UserListReducer,
  userDelete: deleteUserReducer,
  userUpdateinfo:updateUserReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver:orderDeliverReducer,
  MyOrders: MyOrdersReducer,
  OrdersList:OrdersListReducer
});
let cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];
let userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;
let shippingaddressFromStorage = localStorage.getItem("ShippingAddress")
  ? JSON.parse(localStorage.getItem("ShippingAddress"))
  : {};

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    ShippingAddress: shippingaddressFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
  userLoginGoogle: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
