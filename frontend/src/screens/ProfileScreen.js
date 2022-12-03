import React, { useState , useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Col,
    Row,
    Button,
    Form,
    Table
  } from "react-bootstrap";
  import { LinkContainer } from 'react-router-bootstrap'
import Messages from '../components/Messages'
import Loader from '../components/loader'
import { useDispatch, useSelector } from "react-redux";
import { Details,Update } from '../action/useraction';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import Moment from 'react-moment';

import { listMyOrders } from '../action/orderAction'
import { Link } from 'react-router-dom';


function ProfileScreen() {
    const[email ,setemail] = useState("")
    const[name ,setname] = useState("")
    const[password ,setpassword] = useState("")
    const[confirmpassword ,setconfirmpassword] = useState("")
    const[oldpassword ,setoldpassword] = useState("")
    const[message ,setmessage] = useState("")

    const userDetails =useSelector(state => state.userDetails)
    const {user,loading,error} =userDetails

    const userLogin =useSelector(state => state.userLogin)
    const {userInfo} =userLogin
    
    const userLoginGoogle =useSelector(state => state.userLoginGoogle)
    const {userInfo:userInfogoogle} = userLoginGoogle

    const {id} =useParams()
    const userUpdate =useSelector(state => state.userUpdate)
    const {success , error:errorupdate} =userUpdate
    const MyOrders =useSelector(state => state.MyOrders)
    const {loading:loadingorders ,orders,error:errororder} =MyOrders

    const history =useNavigate()
    const dispatch=useDispatch()
    useEffect(()=>{
        if(!userInfo){
            history('/login')
        }else{
            if (!user || !user.name || success || userInfo._id !== user._id) {
                dispatch({type:USER_UPDATE_PROFILE_RESET})
                dispatch(Details(userInfo._id))
                dispatch(listMyOrders())
            }else{
                setname(user.name)
                setemail(user.email)
            }
        }
    },[history,dispatch,userInfo,user,success])

    const submitHandler=(e)=>{
        e.preventDefault()
        if (password !== confirmpassword) {
            setmessage('Passwords do not match')
        }else{
        setmessage('')
        dispatch(Update({
            'id':user._id ,
            'name':name,
            'email':email,
            'password':password,
            'oldpassword':oldpassword
        }))    
        }
    }
    
    return (
        
    <Row>
        <Col md={3}>
            <h2>User Profile</h2>
            {error && <Messages variant={'danger'}>{error}</Messages>}
            {errorupdate && <Messages variant={'danger'}>{errorupdate}</Messages>}
            {message && <Messages variant={'danger'}>{message}</Messages>}
          {loading && <Loader/>}
        <Form onSubmit={submitHandler}>
        
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

                <Form.Group controlId='oldpassword'>
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                type='password'
                placeholder='Enter Your old password'
                value={oldpassword}
                onChange={(e)=>setoldpassword(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
                <Form.Group controlId='password'>
                <Form.Label>New Password</Form.Label>
                <Form.Control
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
                type='password'
                placeholder='Confirm password'
                value={confirmpassword}
                onChange={(e)=>setconfirmpassword(e.target.value)}
                >
                </Form.Control>
            </Form.Group>


            <Button type='submit' variant='primary' className='mt-3'>
                Update
                </Button>
</Form>
        </Col>
        <Col md={9}><h2>My Orders</h2>
        {loadingorders ? (<Loader/>) : loadingorders ? <Messages variant={'danger'}>{loadingorders}</Messages> :(
            <Table striped responsive className='table-sm'>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Deliverd</th>
                        <th>Details</th>
                        </tr>
                    </thead>
                <tbody>
                    {orders.map(order=>(
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.createdAt.substring(0,10)}</td>
                            <td>${order.totalPrice}</td>
                            <td>{order.isPaid ? (<Moment>{order.paidAt}</Moment>) :(<i className="fa-solid fa-xmark" style={{'color':'red'}}></i>) }</td>
                            <td>{order.isDeliverd ? (<Moment>{order.deliveredAt}</Moment>):(<i className="fa-solid fa-xmark" style={{'color':'red'}}></i>)}</td>
                            <td><LinkContainer to={`/order/${order._id}`}>
                            <Button className='btn-sm'>Details</Button>
                            </LinkContainer></td>
                        </tr>
                    ))}
                </tbody>



            </Table>
)}
        </Col>
    </Row>
  )
}
export default ProfileScreen