import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import {useDispatch  , useSelector} from 'react-redux'
import { saveShippingAddress } from '../action/cartAction'
import CheckoutSteps from '../components/CheckoutSteps'

function ShippingScreen() {

  const shipping =useSelector(state => state.cart)
  const {ShippingAddress} =shipping
  const history =useNavigate()
  const [address , SetAddress]=useState(ShippingAddress.address)
  const [city , setCity]=useState(ShippingAddress.city)
  const [postalcode , SetPostalCode]=useState(ShippingAddress.postalcode)
  const [country , SetCountry]=useState(ShippingAddress.country)
  const dispatch = useDispatch()  
  const submitHandler=(e)=>{
    e.preventDefault()
    dispatch(saveShippingAddress({address,city,postalcode ,country}))
    history('/payment')
  }

    return (
                
        <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1>SHIPPING</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='address' className='mb-3'>
                <Form.Label>Address</Form.Label>
                <Form.Control
                required
                type='text'
                placeholder='Enter address'
                value={
                    address ? address : ''
                }
                onChange={(e)=>SetAddress(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='city' className='mb-3'>
                <Form.Label>City</Form.Label>
                <Form.Control
                required
                type='text'
                placeholder='Enter city'
                value={city ? city :'' }
                onChange={(e)=>setCity(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='postalcode' className='mb-3'>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                required
                type='text'
                placeholder='Enter postal code'
                value={postalcode ? postalcode : ''}
                onChange={(e)=>SetPostalCode(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='country' className='mb-3'>
                <Form.Label>Country</Form.Label>
                <Form.Control
                required
                type='text'
                placeholder='Enter country'
                value={country ? country : '' }
                onChange={(e)=>SetCountry(e.target.value)}
                
                >
                </Form.Control>
                </Form.Group>

        <Button type='submit' className='mt-3 btn-primary'>Continue</Button>

        </Form>
        </FormContainer>
  )
}

export default ShippingScreen