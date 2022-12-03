import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Row,
  Card,
  ListGroup,
  Button,
  Image,
  Form,
} from "react-bootstrap";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Messages from "../components/Messages";
import { addToCart, RemoveFromCart } from "../action/cartAction";

function CartScreen() {
  const { id } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const qty = searchParams.get("qty");

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const history = useNavigate()
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty));
      history('/cart')
    }
  }, [dispatch, id, qty,history]);

  const removeFromCartHandler = (id) => {
    dispatch(RemoveFromCart(id))
    

  };

  const checkouthandler =()=>{
    if(userInfo){
      history('/shipping')
    
    }else{
      history('/login?redirect=/shipping')
    }
  }

  const del =()=>{
    window.location.reload()
    localStorage.removeItem('cartItems')
    
  }
  return (
    <div>
      <Row>
        <Col md={8}>
          <h1>Shopping Card</h1>

          <Button className="btn btn-warning my-3 " onClick={del} disabled={cartItems.length===0}> Delete All </Button>
          {cartItems.length === 0 ? (
            <Messages>
              Your cart is empty <Link to={"/"}>Go Back</Link>
            </Messages>
          ) : (
            //else
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/product/${item.product}`}
                      >
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={2}>{item.price} $</Col>
                    <Col md={3}>
                      <Form.Select
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            addToCart(item.product, Number(e.target.value))
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={1}>
                      <Button
                       onClick={() => removeFromCartHandler(item.product)}
                        type="submit"
                        variant="light"
                      >
                        <i
                          className="fas fa-trash"
                          style={{ color: "red" }}
                          
                        ></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item className="pb-3">
                <h2 className="pb-0">
                  SUBTOTAL 
                  ({cartItems.reduce((acc, item) => +acc + +item.qty, 0)})
                   
                </h2>
                <h2 className="pt-0">ITEMS</h2>
                $
                {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                 className="w-100 my-3 p-3 btn-block"
                  type="button"
                  disabled ={cartItems.length === 0}
                  onClick={checkouthandler}
                  >
                  Procced To Checkout
                  </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CartScreen;
