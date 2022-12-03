import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import Messages from "../components/Messages";
import Loader from "../components/loader";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import {
  listProductsAdminDetails,
  updateproduct,
} from "../action/productAction";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
import axios from "axios";
function ProductEditScreen() {
  const { id } = useParams();
  const [name, setname] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [describtion, setDescribtion] = useState("");
  const [brand, setbrand] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [show, setShow] = useState(false);
  const [Uploading, setUploading] = useState(false);

  const location = useLocation();
  const history = useNavigate();
  const dispatch = useDispatch();

  const productDetailsAdmin = useSelector((state) => state.productDetailsAdmin);
  const { error, product, loading } = productDetailsAdmin;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    error: errorupdate,
    success: successupdate,
    loading: loadingupdate,
  } = productUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (successupdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history("/admin/productlist");
    } else {
      if (!product.name || product._id !== Number(id)) {
        dispatch(listProductsAdminDetails(id));
      } else {
        setname(product.name);
        setPrice(product.price);
        setImage(product.image);
        setCategory(product.category);
        setDescribtion(product.describtion);
        setCountInStock(product.countInStock);
        setShow(product.show);
      }
    }
  }, [dispatch, product, id, successupdate, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateproduct({
        _id: id,
        name,
        image,
        brand,
        category,
        describtion,
        price,
        countInStock,
        show,
      })
    );
  };

  const UploaddFileHandler = async (e) => {
    const file =e.target.files[0]
    const formData = new FormData()
    formData.append('image' ,file)
    formData.append('product_id' ,id)
    setUploading(true)

    try {
      const config ={
        headers:{
          'Content-Type':'multipart/form-data',
        }
      }
      const {data} = await axios.post('/api/products/upload' , formData,config)
      setUploading(false)

      setImage(data)
    } catch (error) {
      setUploading(false)
    }


  };

  return (
    <div>
      <Link to={"/admin/productlist"}>Go Back</Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Messages variant={"danger"}>{error}</Messages>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name : </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setname(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price :</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image :</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Your image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="file"
                label="Choose File"
                className="my-3"
                onChange={UploaddFileHandler}
              />
            </Form.Group>
            {Uploading && (<Loader/>)}
            <Form.Group controlId="brand">
              <Form.Label>brand :</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Your brand"
                value={brand}
                onChange={(e) => setbrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>category :</Form.Label>
              <Form.Control
                type="text"
                placeholder=" Category :"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="describtion">
              <Form.Label>describtion :</Form.Label>
              <Form.Control
                type="text"
                placeholder="Describtion"
                value={describtion}
                onChange={(e) => setDescribtion(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>CountInStock :</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Your Email"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="Show">
              <Form.Check
                type="checkbox"
                label=" Show Product ? "
                checked={show}
                onChange={(e) => setShow(e.target.checked)}
                className="mt-3"
              ></Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
}

export default ProductEditScreen;
