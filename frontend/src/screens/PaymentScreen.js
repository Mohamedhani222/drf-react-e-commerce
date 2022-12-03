import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import {useDispatch  , useSelector} from 'react-redux'
import { savePaymentmethod } from '../action/cartAction'
import CheckoutSteps from '../components/CheckoutSteps'


function PaymentScreen() {
  const cart =useSelector(state => state.cart)
  const {ShippingAddress} =cart
  const history =useNavigate()
  const dispatch =useDispatch()
  const[payment , SetPayment] = useState('PayPal')
  if(!ShippingAddress){
    history('/shipping')
  }
  const submitHandler=(e)=>{
    e.preventDefault()
    dispatch(savePaymentmethod(payment))
    history('/placeorder')
  }
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
        <Form onSubmit={submitHandler}>
        <Form.Group >
        <Form.Label as={'legend'} className='pb-3'>Select Method</Form.Label>
        <Form.Check
          label='PayPal or Credit Card'
          type='radio' 
          value={'PayPal'}
          checked
          onChange={(e)=>SetPayment(e.target.value ,console.log(e.target.value)) }
          ></Form.Check>
        </Form.Group>
<Button type='submit' className='mt-4'>Continue</Button>
</Form>
        </FormContainer>
  )
}

export default PaymentScreen
