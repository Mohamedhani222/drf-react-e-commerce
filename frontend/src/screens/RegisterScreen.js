import React, { useState , useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    Col,
    Row,
    Button,
    Form,
  } from "react-bootstrap";
import Messages from '../components/Messages'
import Loader from '../components/loader'
import { useDispatch, useSelector } from "react-redux";
import { register } from '../action/useraction'
import FormContainer from '../components/FormContainer';

function RegisterScreen() {
const[email ,setemail] = useState("")
const[name ,setname] = useState("")
const[password ,setpassword] = useState("")
const[confirmpassword ,setconfirmpassword] = useState("")
const[message ,setmessage] = useState("")



const location =useLocation()
const history =useNavigate()
const dispatch =useDispatch()
const userregister =useSelector(state => state.userRegister)
const {error , loading , userInfo} =userregister
const redirect =location.search ? location.search.split('=')[1]:'/'

    useEffect(()=>{
    if(userInfo){
        history(redirect)
    }
    },[dispatch,redirect,userInfo,history])

const submitHandler = (e)=>{
    e.preventDefault()
    if (password !== confirmpassword) {
        setmessage('Passwords do not match')
    }else{
        dispatch(register(name,email,password))
    }
 
}



  return (
    <FormContainer>
                <h1>Sign Up</h1>
          {error && <Messages variant={'danger'}>{error}</Messages>}
          {loading && <Loader/>}
        <Form onSubmit={submitHandler}>
        {message && <Messages variant={'danger'}>{message}</Messages>}
        <Form.Group controlId='name'>
        <Form.Label>Your Name</Form.Label>
        <Form.Control
                required
                type='text'
                placeholder='Enter Your Name'
                value={name}
                onChange={(e)=>setname(e.target.value)}
                >
                </Form.Control>           
        </Form.Group>
            <Form.Group controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                required

                type='email'
                placeholder='Enter Your Email'
                value={email}
                onChange={(e)=>setemail(e.target.value)}
                >
                </Form.Control>            </Form.Group>

                <Form.Group controlId='password'>
                <Form.Label>password</Form.Label>
                <Form.Control
                required

                type='password'
                placeholder='Enter Your password'
                value={password}
                onChange={(e)=>setpassword(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
                <Form.Group controlId='confirmpassword'>
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                required
                type='password'
                placeholder='Confirm password'
                value={confirmpassword}
                onChange={(e)=>setconfirmpassword(e.target.value)}
                >
                </Form.Control>
            </Form.Group>


            <Button type='submit' variant='primary' className='mt-3'>
                Register
                </Button>
        </Form>
        <Row className='py-3'>
            <Col>Have An Account ?<Link to={redirect ? `/login?redirect=${redirect}`: '/login'}>Login</Link></Col>
        </Row>


    </FormContainer>
  )
}

export default RegisterScreen