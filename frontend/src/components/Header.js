import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector ,useDispatch } from 'react-redux'
import NavDropdown from 'react-bootstrap/NavDropdown';
import { logout } from '../action/useraction';
import SearchBox from './SearchBox';
function Header() {
  const userLogin =useSelector(state => state.userLogin)
  const {userInfo} =userLogin
  const userLoginGoogle =useSelector(state => state.userLoginGoogle)
  const {userInfo:userInfoGoogle} =userLoginGoogle
  const dispatch =useDispatch()
  const logouthandler = ()=>{
      dispatch(logout())

  }



  return (
<header>
        <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
          <Container>
        <LinkContainer to='/'>
            <Navbar.Brand >Dc Store</Navbar.Brand>
</LinkContainer>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <SearchBox/>
              <Nav className="ms-auto my-2 my-lg-0"style={{ maxHeight: '100px' }} navbarScroll>
              <LinkContainer to="/cart">  
              <Nav.Link ><i className="fa-solid fa-cart-shopping"></i> <span id='cartnum'>0</span> Cart</Nav.Link>
              </LinkContainer>

             {userInfo || userInfoGoogle ? (
              <NavDropdown title={userInfo ? userInfo.name : userInfoGoogle.name}  id='username'>
                <LinkContainer to={'/profile'}>
               <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={logouthandler}>Logout</NavDropdown.Item>
    
              </NavDropdown>
             ):(
             <LinkContainer to='/login'>
             <Nav.Link ><i className="fa-solid fa-user"></i>  Login</Nav.Link>

             </LinkContainer> 
)}
    {userInfo && userInfo.isAdmin && (
                    <NavDropdown title='Admin' id='adminmenu'>
                    <LinkContainer to={'/admin/userlist'}>
                   <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to={'/admin/productlist'}>
                   <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    
                    <LinkContainer to={'/admin/orderlist'}>
                   <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    </NavDropdown>

    )}


              </Nav>
    </Navbar.Collapse>
          </Container>
        </Navbar></header>
      );
    }

export default Header;