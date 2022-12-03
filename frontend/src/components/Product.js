import React from 'react'
import { Button, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { addToCart } from '../action/cartAction'
import Rating from './Rating'
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

function Product({product}) {

  const dispatch =useDispatch()
  const history =useNavigate()
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  let cartm =document.getElementById('cartnum')
  cartm.innerHTML =cartItems.length

  const carthandler = async ()=>{
      dispatch(addToCart(product._id , 1))
      const exist =cartItems.find(x =>x.product === product._id)
      if (exist){
        alertify.error('already exist')
      }else{
        alertify.success('Added To cart')
      }
      
  }
  return (
<Card className='my-3 p-3 rounded' >
      <Link to={`/product/${product._id}`}>
        < Card.Img src={product.image}/>
        
        </Link>  
  <Card.Body>
  <Link to={`/product/${product._id}`}>
<Card.Title as={'div'}>
<strong> {product.name} </strong>

</Card.Title>
</Link>  
<Card.Text as={'div'}>
<div className='my-3'>
    <Rating value={product.rating} text={`${product.numReviews} reviews `} color={'#f8e825'}/>
</div>
</Card.Text>
<Card.Text as={'h3'}>
    ${product.price}
</Card.Text>
{product.countInStock === 0 ?
 <Button disabled >Add To Cart</Button>
:  <Button onClick={carthandler}>Add To Cart</Button>
}

  </Card.Body>
</Card>


  )
}

export default Product