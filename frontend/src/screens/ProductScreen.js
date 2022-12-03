/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Col,
  Row,
  Card,
  ListGroup,
  Button,
  Image,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listProductsDetails } from "../action/productAction";
import Loader from "../components/loader";
import Messages from "../components/Messages";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { addToCart } from "../action/cartAction";
import { CreateReview } from "../action/productAction";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

function ProductScreen() {
  const [qty, SetQty] = useState(1);
  const [rating, Setrating] = useState(0);
  const [comment, Setcomment] = useState('');

  const dispatch = useDispatch();

  const productdetails = useSelector((state) => state.productDetails);
  const { error, product, loading } = productdetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const CreateProductReview = useSelector((state) => state.CreateProductReview);
  const {
    error: errorcreatereview,
    success: successcreatereview,
    loading: loadingcreatereview,
  } = CreateProductReview;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const { id } = useParams();
  const history = useNavigate();

  useEffect(() => {
    if (successcreatereview) {
      Setrating(0)
      Setcomment('')
      dispatch({type:PRODUCT_CREATE_REVIEW_RESET})
    }
    dispatch(listProductsDetails(id));
  }, [dispatch, id,successcreatereview]);

  const AddToCartHandle = async () => {
    dispatch(addToCart(product._id, qty));
    const exist = cartItems.find((x) => x.product === product._id);
    if (exist) {
      alertify.error("already exist");
    } else {
      alertify.success("Added To cart");
      history("/cart");
    }
  };

  const SubmitHandler = (e) =>{
    e.preventDefault()
    dispatch(CreateReview(id ,{rating,comment}))
  }

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Messages variant="danger" children={error} />
      ) : (
        <div>
          <Row className="p-3">
            <Col md={6}>
              <Image src={product.image} fluid />
            </Col>

            <Col md={3} className="p-3">
              <ListGroup variant="flush">
                <ListGroup.Item className="p-3">
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item className="p-3">
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                    color={"#f8e825"}
                  />
                </ListGroup.Item>

                <ListGroup.Item className="p-3">
                  Price: ${product.price}
                </ListGroup.Item>

                <ListGroup.Item className="p-3">
                  Description: {product.describtion}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card variant="flush">
                <ListGroup>
                  <ListGroup.Item className="p-3">
                    <Row>
                      <Col>Price :</Col>
                      <Col>
                        <strong>{product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item className="p-3">
                    <Row>
                      <Col>Status :</Col>
                      <Col>
                        {product.countInStock > 0
                          ? "In Stock "
                          : "Out Of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col xs="auto" className="my-1">
                          <Form.Select
                            value={qty}
                            onChange={(e) => SetQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item className="p-3">
                    <Button
                      className="btn btn-block w-100"
                      disabled={product.countInStock === 0}
                      type="button"
                      onClick={AddToCartHandle}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <h4>Reviews</h4>
              {product.reviews.length === 0 && (
                <Messages variant={"info"}>No Rating Here ! </Messages>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} color="#f8e825" />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h4>Write A Review</h4>
                  {loadingcreatereview && (<Loader/>)}
                  {errorcreatereview && (<Messages variant={'danger'}>{errorcreatereview}</Messages>)}
                  {successcreatereview && (<Messages variant={'success'}>Review Added Successfully</Messages>)}
                  {!userInfo ? (
                    <Messages variant={"info"}>
                      You Must{" "}
                      <Link
                        className="text-decoration-none"
                        style={{ color: "red" }}
                        to={"/login"}
                      >
                        Login
                      </Link>{" "}
                      To write a review
                    </Messages>
                  ) : (
                    <Form onSubmit={SubmitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                          value={rating}
                          onChange={(e) => {
                            Setrating(e.target.value);
                          }}
                        >
                          <option value={''}>Select ..</option>
                          <option value={1}>1- Poor</option>
                          <option value={2}>2- Fair</option>
                          <option value={3}>3- Good</option>
                          <option value={4}>4- Very Good</option>
                          <option value={5}>5- Excllent</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as={"textarea"}
                          raw="5"
                          value={comment}
                          onChange={(e) => {
                            Setcomment(e.target.value);
                          }}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        type="submit"
                        className="mt-3"
                        disabled={loadingcreatereview}
                      >
                        Submit
                      </Button>
                    </Form>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;
