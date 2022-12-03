import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Col, Row, Button, Form } from "react-bootstrap";
import Messages from "../components/Messages";
import Loader from "../components/loader";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../action/useraction";
import FormContainer from "../components/FormContainer";
import { Details,UserUpdate } from '../action/useraction'
import { USER_UPDATE_RESET } from '../constants/userConstants'
function UserEditScreen() {
  const { id } = useParams();
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [isAdmin, setisAdmin] = useState(false);

  const location = useLocation();
  const history = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;
  const userUpdateinfo = useSelector((state) => state.userUpdateinfo);
  const { success:successUpdate, error:errorUpdate, loading:loadingUpdate } = userUpdateinfo;

  useEffect(()=>{
    if(successUpdate){
      dispatch({type:USER_UPDATE_RESET})
      history('/admin/userlist')
    }else{
    if(!user.name || user._id !== Number(id))
      dispatch(Details(id))
    else{
      setemail(user.email)
      setname(user.name)
      setisAdmin(user.isAdmin)
    }
    }

  },[dispatch,user,id,history,successUpdate])

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(UserUpdate({
      _id:user._id,
      name,
      email,
      isAdmin
    }))
  };

  return (
<div>
  <Link to={'/admin/userlist'}>
    Go Back
  </Link>
<FormContainer>
      <h1>Edit User</h1>
      {loadingUpdate && <Loader/>}
      {errorUpdate && <Messages variant={'danger'}>{errorUpdate}</Messages>}
      {loading ? (<Loader/>) : error ? <Messages variant={'danger'}>{error}</Messages> :(
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

      <Form.Group controlId="email">
        <Form.Label>Email Address :</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        ></Form.Control>
      </Form.Group>

      <Form.Group controlId="isadmin">
        <Form.Check
          type='checkbox'
          label=' Is Admin ? '
          checked={isAdmin}
          onChange={(e) => setisAdmin(e.target.checked)}
          className='mt-3'
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

export default UserEditScreen;
