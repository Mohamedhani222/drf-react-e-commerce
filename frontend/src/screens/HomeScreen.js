import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { listProducts } from "../action/productAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/loader";
import Messages from "../components/Messages";
import { useLocation } from "react-router-dom";
import Paginator from "../components/Paginator";
import ProductCarousel from "../components/ProductCarousel";

function HomeScreen() {
  const dispatch = useDispatch();
  const productlist = useSelector((state) => state.productList);
  const { error, products, loading, page, pages } = productlist;
  let history = useLocation();
  let keyword = history.search;
  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);
  return (
    <div>
      {!keyword && <ProductCarousel/>}
      <h1>latest products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Messages variant="danger" children={error} />
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product products={products} product={product} />
              </Col>
            ))}
          </Row>
          <Paginator pages={pages} page={page} keyword={keyword}  />
        </>
      )}
    </div>
  );
}

export default HomeScreen;
