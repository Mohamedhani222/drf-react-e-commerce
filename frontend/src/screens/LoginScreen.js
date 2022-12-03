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
import { Login,GoogleLogin } from '../action/useraction'
import FormContainer from '../components/FormContainer';
import jwt_decode from 'jwt-decode'
import axios from 'axios';
import {USER_LOGOUT_GOOGLE} from '../constants/userConstants'
function LoginScreen() {
    const [email,SetEmail] =useState("")
    const [password,Setpassword] =useState("")
    const dispatch =useDispatch()
    const location =useLocation()
    const history =useNavigate()
    const userLogin =useSelector(state => state.userLogin)
    const {error , loading , userInfo} = userLogin
    const userLoginGoogle =useSelector(state => state.userLoginGoogle)
    const {error:errorgoogle , loading:loadinggoogle , userInfo:userInfogoogle} = userLoginGoogle
    const redirect =location.search ? location.search.split('=')[1]:'/'
    
    const submitHandler = (e)=>{
        e.preventDefault()
        dispatch(Login(email,password)) 
    }
    


    useEffect(()=>{
      if (userInfo) {
        history(redirect);
      }
      if (userInfogoogle) {
        history(redirect);
      }
      const callbackhandle = (res)=>{
        dispatch(GoogleLogin(res.credential))
      }
      

      /* global google */
      google.accounts.id.initialize({
        client_id:"130018081071-pnrn9nm8i3kva60gc8edra5t2q9jds4t.apps.googleusercontent.com",
        callback: callbackhandle,
      });
      google.accounts.id.renderButton(
        document.getElementById('SigninDiv'),
        {theme :'outline' , size :'large' }
      )
    },[history,redirect ,userInfo,userInfogoogle,dispatch])




return (
  <FormContainer>
    <h1>Sign in</h1>
    {error && <Messages variant={"danger"}>{error}</Messages>}
    {loading && <Loader />}
    {errorgoogle && <Messages variant={"danger"}>{errorgoogle}</Messages>}
    {loadinggoogle && <Loader />}

    <Form onSubmit={submitHandler}>
      <Form.Group controlId="email">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => SetEmail(e.target.value)}
        ></Form.Control>{" "}
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Label>password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter Your password"
          value={password}
          onChange={(e) => Setpassword(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Button type="submit" variant="primary" className="mt-3 mb-2">
        Sign in
      </Button>
    </Form>
    <div className='text-center'>
      {" "}
      <span className="mt-3" style={{
          position: "absolute",
          bottom: "41px",
          background: "white",
          fontWeight: '1000',
      }}>or</span>
      <hr
        style={{
          position: "relative",

        }}
      ></hr>
    </div>
    <div id="SigninDiv" className="mt-3 text-dark w-100"></div>
    <Row className="py-3">
      <Col>
        New Customer ?
        <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
          Register
        </Link>
      </Col>
    </Row>
  </FormContainer>
);
}

export default LoginScreen