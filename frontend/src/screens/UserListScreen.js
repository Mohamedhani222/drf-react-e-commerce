import React, { useState , useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Col,
    Row,
    Button,
    Form,
    Table
  } from "react-bootstrap";
  import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import Messages from '../components/Messages';
import Loader from '../components/loader'
import { ListUsers, UserDelete } from '../action/useraction'



function UserListScreen() {
    const history =useNavigate()
    const dispatch =useDispatch()
    const usersList = useSelector(state => state.usersList)
    const {error ,loading ,users } =usersList
    const userLogin =useSelector(state => state.userLogin)
    const {userInfo} =userLogin
    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete

    const deletehandler = (id) =>{
        if (window.confirm('Are You Sure ?? ')) {
                    dispatch(UserDelete(id))

        }
    }
    useEffect(()=>{
        if (userInfo && userInfo.isAdmin) {
                    dispatch(ListUsers())
        }else{
            history('/login')
        }
    },[dispatch,userInfo,history,successDelete])



    return (
    <div>
        <h1>Users :</h1>
        {loading ? (<Loader/>) : error ? (<Messages variant={'danger'}>{error}</Messages>) : (
            <Table striped responsive hover borderd='true' className = 'table-sm'>
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th></th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(user =>(
                    <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.isAdmin ? (<i className="fa-solid fa-check" style={{'color':'green'}}></i>): (<i className="fa-solid fa-xmark" style={{'color':'red'}}></i>) }</td>
                    <td>
                        <LinkContainer to={`/admin/user/${user._id}/edit`} >
                        <Button variant='light' className='btn-sm'>
                            <i className='fas fa-edit'></i>
                        </Button>
                        </LinkContainer>                        
                        <Button variant='danger' onClick={() => deletehandler(user._id)} className='btn-sm'>
                            <i className='fas fa-trash'></i>
                        </Button>

                        </td>
                    </tr>

                    ))}
                </tbody>

            </Table>
        )}


    </div>
  )
}

export default UserListScreen