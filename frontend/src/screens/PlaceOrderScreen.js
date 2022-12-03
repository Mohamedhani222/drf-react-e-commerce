import React, { useEffect } from "react";
import { Button, Row, Col, ListGroup, Image , Card} from "react-bootstrap";
import {  useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import Messages from "../components/Messages";
import { Link } from "react-router-dom";
import axios from "axios";
import { CreateOrder } from '../action/orderAction'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'



function PlaceOrderScreen() {

  const orderCreate =useSelector(state => state.orderCreate)
  const {order ,error ,success} = orderCreate
  const cart = useSelector((state) => state.cart);
  const { cartItems, ShippingAddress, PaymentMethod } = cart;
  const userLogin =useSelector(state => state.userLogin)
  const { userInfo} = userLogin
  const navigate = useNavigate();
  const dispatch =useDispatch()
  cart.Itemsprice = cartItems.reduce((acc ,item) => acc + item.qty * item.price ,0).toFixed(2)
  cart.shippingPrice = (cart.Itemsprice > 100 ? 0 : 10).toFixed(2)
  cart.tax=Number((0.0082 * cart.Itemsprice)).toFixed(2)
  cart.total=(Number(cart.Itemsprice) + Number(cart.shippingPrice) + Number(cart.tax)).toFixed(2)
  //  const ID =1426448501 
  //  const token ='2049009607:AAEX_Pj0WwKeyMQ3LQLk1Ri7JWq2aj-YqNs'
  //  const msg = `user ${userInfo.name} \n email ${userInfo.username} \n has ordered ${cartItems.length} Items \n total price is ${cart.total}`
  
  
if(!cart.PaymentMethod){
  navigate('/payment')
}

useEffect(() =>{
  if(success){
    navigate(`/order/${order._id}`)
    dispatch({type:ORDER_CREATE_RESET})
  }
},[success ,navigate])


  const placeorder =()=>{

  dispatch(CreateOrder({
    OrderItems:cart.cartItems,
    shippingaddress : cart.ShippingAddress,
    paymentMethod:cart.PaymentMethod,
    Itemsprice:cart.Itemsprice,
    shippingPrice:cart.shippingPrice,
    taxPrice:cart.tax,
    totalPrice:cart.total,
  }))
  }

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            {/*                              SHIPPING                                        */}

            <ListGroup.Item >
              <h2>SHIPPING</h2>
              <p>
                <strong>Shipping : </strong> {ShippingAddress.address} ,{ShippingAddress.city},
                {" "}
                {ShippingAddress.postalcode},
                {" "}
                {ShippingAddress.country}
              </p>
            </ListGroup.Item>

            {/*                              PAYMENT                                        */}
            <ListGroup.Item >
              <h2>PAYMENT METHOD</h2>
              <p>
                <strong> Method : </strong> {PaymentMethod}
              </p>
            </ListGroup.Item>

            {/*                              ORDER                                       */}

    <ListGroup.Item >
        <h2 className="mb-3">ORDER ITEMS</h2>
            {cartItems.length === 0 ? <Messages variant={'danger'}>Your cart is empty <Link style={{'textDecoration' : 'none'}} to={'/'}>Go Back</Link></Messages>
                : (
                    <ListGroup variant="flush">
                        {cartItems.map((item , index) =>( 
                            <ListGroup.Item key={index} className='pb-4'>
                                <Row>
                                    <Col md={1} >
                                        <Image src={item.image} fluid rounded />
                                    </Col>
                                <Col>
                                    <Link style={{'textDecoration':'none'}} to={`/product/${item.product}`}>{item.name}</Link>
                                
                                </Col>
                                <Col md={4}>
                                {item.qty} X ${item.price} = ${item.qty * item.price}
                                </Col>
                                </Row>
                            </ListGroup.Item>
                            
                            ))}
                    </ListGroup>
                ) }


</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
      <Card>
        <ListGroup>
          <ListGroup.Item className='py-3'>
            <h2 >ORDER SUMMARY</h2>
          </ListGroup.Item>
          <ListGroup.Item className='py-3'>
            <Row>
              <Col>Items:</Col>
              <Col>${cart.Itemsprice}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item className='py-3'>            
            <Row>
              <Col>Shipping:</Col>
              <Col>${cart.shippingPrice}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item className='py-3'>
          <Row>
              <Col>Tax:</Col>
              <Col>${cart.tax}</Col>
            </Row>

          </ListGroup.Item>
          <ListGroup.Item className='py-3'>
          <Row>
              <Col>Total:</Col>
              <Col>${cart.total}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            {error && <Messages variant={'danger'}>{error}</Messages>}

          </ListGroup.Item>


          <ListGroup.Item className='py-3'>
          <Button 
          type="button" 
          className="w-100"
          disabled ={cartItems.length === 0}
          onClick={placeorder}
          >Place Order</Button>
          </ListGroup.Item>

      </ListGroup>
      </Card>

        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
