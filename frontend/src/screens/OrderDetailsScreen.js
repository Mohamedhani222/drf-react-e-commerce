import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Messages from "../components/Messages";
import Loader from "../components/loader";
import { Link } from "react-router-dom";
import { getOrderDetails, payOrder, deliverOrder } from "../action/orderAction";
import { AddCopon } from "../action/productAction";
import Moment from "react-moment";
import { PayPalButton } from "react-paypal-button-v2";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
import { PRODUCT_ADD_COPON_RESET } from "../constants/productConstants";

function OrderDetailsScreen() {
  const { id } = useParams();
  const [copon, setCopon] = useState();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { success: successdeliver, loading: loadingdeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const productCopon = useSelector((state) => state.productCopon);
  const {
    loading: loadingCopon,
    success: successCopon,
    error: errorCopon,
  } = productCopon;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sdkReady, setSdkReady] = useState(false);
  ///AYU1KMcxgdJPbSYbcgj5m7zQsx5X14VS33m5MbFvBtOHywJK32VkeKXs64nJg3sGSJIm0jpJvHK9ivOc
  const addPaypalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AYU1KMcxgdJPbSYbcgj5m7zQsx5X14VS33m5MbFvBtOHywJK32VkeKXs64nJg3sGSJIm0jpJvHK9ivOc";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (
      !order ||
      successPay ||
      order._id !== Number(id) ||
      successdeliver ||
      successCopon
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch({ type: PRODUCT_ADD_COPON_RESET });
      dispatch(getOrderDetails(id));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPaypalScript();
      }
    } else {
      setSdkReady(true);
    }
  }, [
    successCopon,
    successPay,
    dispatch,
    order,
    id,
    successdeliver,
    userInfo,
    navigate,
  ]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(id, paymentResult));
  };
  const successDeliverHandler = () => {
    dispatch(deliverOrder(order));
  };
  const submitHandler = async (e) => {
    if (e) {
      e.preventDefault();
    }
    dispatch(AddCopon(id, { copon }));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Messages variant={"danger"}>{error}</Messages>
  ) : (
    <div>
      <h1>ORDER : {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            {/*                              SHIPPING                                        */}

            <ListGroup.Item>
              <h2>SHIPPING</h2>
              <p>
                Name : <strong>{order.user.name}</strong>
              </p>
              <p>
                <strong>Email :</strong>
                <a href={`mailto:${order.user.username}`}>
                  {order.user.username}
                </a>
              </p>
              <p>
                <strong>Shipping : </strong> {order.shippingaddress.address} ,
                {order.shippingaddress.city}, {order.shippingaddress.postalcode}
                , {order.shippingaddress.country}
              </p>
              {order.isDelivered ? (
                <Messages variant="success">
                  Delivered on <Moment>{order.deliveredAt}</Moment>
                </Messages>
              ) : (
                <Messages variant="warning">Not Delivered</Messages>
              )}
            </ListGroup.Item>

            {/*                              PAYMENT                                        */}
            <ListGroup.Item>
              <h2>PAYMENT METHOD</h2>
              <p>
                <strong> Method : </strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Messages variant="success">
                  Paid on <Moment>{order.paidAt}</Moment>
                </Messages>
              ) : (
                <Messages variant="warning">Not Paid</Messages>
              )}
            </ListGroup.Item>

            {/*                              ORDER                                       */}

            <ListGroup.Item>
              <h2 className="mb-3">ORDER ITEMS</h2>
              {order.OrderItems.length === 0 ? (
                <Messages variant={"danger"}>
                  No Order Items Here !{" "}
                  <Link style={{ textDecoration: "none" }} to={"/"}>
                    Go Back
                  </Link>
                </Messages>
              ) : (
                <ListGroup variant="flush">
                  {order.OrderItems.map((item, index) => (
                    <ListGroup.Item key={index} className="pb-4">
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} fluid rounded />
                        </Col>
                        <Col>
                          <Link
                            style={{ textDecoration: "none" }}
                            to={`/product/${item.product}`}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item className="py-3">
                <h2>ORDER SUMMARY</h2>
              </ListGroup.Item>
              <ListGroup.Item className="py-3">
                <Row>
                  <Col>Items:</Col>
                  <Col>
                    $
                    {!loading &&
                      order.OrderItems.reduce(
                        (acc, item) => acc + item.qty * item.price,
                        0
                      ).toFixed(2)}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item className="py-3">
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item className="py-3">
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="py-3">
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}

              {userInfo &&
                order.isPaid &&
                userInfo.isAdmin &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingdeliver && <Loader />}
                    <Button onClick={successDeliverHandler} className="w-100">
                      {" "}
                      Make As Delivered{" "}
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              {" "}
              {userInfo && !order.isPaid && !order.isDelivered && !order.copun && (
                <Form onSubmit={submitHandler}>
                  {loadingCopon && <Loader />}
                  {errorCopon && (
                    <Messages variant={"danger"}>{errorCopon}</Messages>
                  )}
                  {successCopon && (
                    <Messages variant={"success"}>
                      Coupon Added Successfully
                    </Messages>
                  )}
                  <FormGroup controlId="copon">
                    <FormLabel>Add Copon</FormLabel>
                    <FormControl
                      value={copon}
                      type="text"
                      onChange={(e) => {
                        setCopon(e.target.value);
                      }}
                      placeholder="Enter Copun Here !"
                    ></FormControl>
                  </FormGroup>
                  <Button type="submit" className="btn-sm mt-2">
                    Add
                  </Button>
                </Form>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
}

export default OrderDetailsScreen;
