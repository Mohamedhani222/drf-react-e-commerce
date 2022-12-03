import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Col,
    Row,
    Button,
    Table
  } from "react-bootstrap";
  import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import Messages from '../components/Messages';
import Loader from '../components/loader'
import {deleteproduct,listProductsAdmin,createProduct } from '../action/productAction'
import {PRODUCT_CREATE_RESET } from '../constants/productConstants'
import Paginator from '../components/Paginator';


function ProductListScreen() {
    const history =useNavigate()
    const dispatch =useDispatch()

    const userLogin =useSelector(state => state.userLogin)
    const {userInfo} =userLogin

    const productListAdmin =useSelector(state => state.productListAdmin)
    const {products ,loading , error ,pages,page} =productListAdmin
    const productDelete =useSelector(state => state.productDelete)
    const {success:successDelete ,loading:loadingDelete , error:errorDelete} =productDelete

    const productCreate =useSelector(state => state.productCreate)
    const {success:successCreate ,loading:loadingCreate , error:errorCreate , product:createdproduct} =productCreate


    const keyword =useLocation().search
    const deletehandler =(id)=>{
        if (window.confirm('Are You Sure ?? ')) {
            dispatch(deleteproduct(id))
        }
    }
    const createProductHandler = ()=>{
        dispatch(createProduct())
    }


    useEffect(() => {
      dispatch({type:PRODUCT_CREATE_RESET})
      if(!userInfo.isAdmin ){
          history('/login')
      }
      if(successCreate){
        history(`/admin/product/${createdproduct._id}/edit`)
      }else{
        dispatch(listProductsAdmin(keyword))
      }
    }, [dispatch,history,userInfo,successDelete,successCreate,createdproduct,keyword])
    
  return (
    <div>
    <Row className='align-items-center'>
        <Col md={10}>
            <h1>Products : </h1>
        </Col>

        <Col className='align-items-right'>
             <Button className='my-3' onClick={createProductHandler}> 
                <i className='fas fa-plus'></i> Create Product
            </Button>
        </Col>
    </Row>
    {loadingDelete && <Loader />}
    {errorDelete && <Messages variant='danger'>{errorDelete}</Messages>}

    {loadingCreate && <Loader />}
    {errorCreate && <Messages variant='danger'>{errorCreate}</Messages>}


    
    
    {loading ? (<Loader/>) : error ? (<Messages variant={'danger'}>{error}</Messages>) : (
       <>
       <Table striped responsive hover bordered className = 'table-sm '>
            <thead>
                <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th></th>
                </tr>
            </thead>

            <tbody>
                {products.map(product =>(
                <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.catregory}</td>
                <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`} >
                    <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                    </Button>
                    </LinkContainer>                        
                    <Button variant='danger' onClick={() => deletehandler(product._id)} className='btn-sm'>
                        <i className='fas fa-trash'></i>
                    </Button>

                    </td>
                </tr>

                ))}
            </tbody>

        </Table>
        <Paginator page={page} pages={pages} isAdmin={true} keyword={keyword}/>
        </>
    )}
</div>
)
}

export default ProductListScreen