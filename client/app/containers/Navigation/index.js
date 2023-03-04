/**
 *
 * Navigation
 *
 */

 import React from 'react';

 import { connect } from 'react-redux';
 import { Link, NavLink as ActiveLink, withRouter } from 'react-router-dom';
 import Autosuggest from 'react-autosuggest';
 import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
 import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
 import {
   Container,
   Row,
   Col,
   Navbar,
   Nav,
   NavItem,
   NavLink,
   UncontrolledDropdown,
   Dropdown,
   DropdownToggle,
   DropdownMenu,
   DropdownItem
 } from 'reactstrap';
 
 import actions from '../../actions';
 
 import Button from '../../components/Common/Button';
 import CartIcon from '../../components/Common/CartIcon';
 import { BarsIcon } from "../../components/Common/Icon";
 import Menu from '../NavigationMenu';
 import Cart from '../Cart';
 
 class Navigation extends React.PureComponent {
   componentDidMount() {
     this.props.fetchStoreCategories();
     this.props.fetchLocator();
     this.props.fetchMarketing();
   }

   toggleMenu() {
     this.props.fetchStoreCategories();
     this.props.toggleMenu();
   }

   getSuggestionValue(suggestion) {
     return suggestion.name;
   }

   renderSuggestion(suggestion, { query, isHighlighted }) {
     const BoldName = (suggestion, query) => {
       const matches = AutosuggestHighlightMatch(suggestion.name, query);
       const parts = AutosuggestHighlightParse(suggestion.name, matches);

       return (
         <div>
           {parts.map((part, index) => {
             const className = part.highlight
               ? "react-autosuggest__suggestion-match"
               : null;
             return (
               <span className={className} key={index}>
                 {part.text}
               </span>
             );
           })}
         </div>
       );
     };

     return (
       <Link to={`/product/${suggestion.slug}`}>
         <div className="d-flex">
           <img
             className="item-image"
             src={`${
               suggestion.photo
                 ? suggestion.photo
                 : "/images/placeholder-image.png"
             }`}
           />
           <div>
             <Container>
               <Row>
                 <Col>
                   <span className="name">{BoldName(suggestion, query)}</span>
                 </Col>
               </Row>
               <Row>
                 <Col>
                   {suggestion.final_price ? (
                     <>
                       <span className="special-price mb-0">
                         {suggestion.final_price} ₫
                       </span>
                       <span className="old-price mb-0">
                         {suggestion.price} ₫
                       </span>
                     </>
                   ) : (
                     <span className="price mb-0">{suggestion.price} ₫</span>
                   )}
                 </Col>
               </Row>
             </Container>
           </div>
         </div>
       </Link>
     );
   }

   render() {
     const {
       history,
       authenticated,
       user,
       cartItems,
       brands,
       categories,
       signOut,
       isMenuOpen,
       isCartOpen,
       isBrandOpen,
       toggleCart,
       toggleMenu,
       searchValue,
       suggestions,
       onSearch,
       onSuggestionsFetchRequested,
       onSuggestionsClearRequested,
     } = this.props;

     const inputProps = {
       placeholder: "Tìm kiếm sản phẩm",
       value: searchValue,
       onChange: (_, { newValue }) => {
         onSearch(newValue);
       },
     };

     return (
       <header className="header fixed-mobile-header">
         <div className="header-info">
           <Container>
             <Row>
               <Col md="4" className="text-center d-none d-md-block">
                 <i className="fa fa-truck" />
                 <span>Miễn phí vận chuyển</span>
               </Col>
               <Col md="4" className="text-center d-none d-md-block">
                 <i className="fa fa-credit-card" />
                 <span>Thanh toán</span>
               </Col>
               <Col md="4" className="text-center d-none d-md-block">
                 <i className="fa fa-phone" />
                 <span>Liên hệ 0963-220-676</span>
               </Col>
               <Col xs="12" className="text-center d-block d-md-none">
                 <i className="fa fa-phone" />
                 <span> Liên hệ 0963-220-676</span>
               </Col>
             </Row>
           </Container>
         </div>
         <Container>
           <Row className="align-items-center top-header">
             <Col
               xs={{ size: 12, order: 1 }}
               sm={{ size: 12, order: 1 }}
               md={{ size: 3, order: 1 }}
               lg={{ size: 3, order: 1 }}
             >
               <div className="brand">
                 {categories && categories.length > 0 && (
                   <Button
                     borderless
                     variant="empty"
                     className="d-none d-md-block"
                     ariaLabel="open the menu"
                     icon={<BarsIcon />}
                     onClick={() => this.toggleMenu()}
                   />
                 )}
                 <Link to="/">
                   <h1 className="logo">
                     <img
                       className="item-image"
                       src={`https://res.cloudinary.com/hoaduonghx/image/upload/v1669542110/image/yhoyntyb7v44rcecmxha.png`}
                       width={"130px"}
                     />
                   </h1>
                 </Link>
               </div>
             </Col>
             <Col
               xs={{ size: 12, order: 4 }}
               sm={{ size: 12, order: 4 }}
               md={{ size: 12, order: 4 }}
               lg={{ size: 5, order: 2 }}
               className="pt-2 pt-lg-0"
             >
               <Autosuggest
                 suggestions={suggestions}
                 onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                 onSuggestionsClearRequested={onSuggestionsClearRequested}
                 getSuggestionValue={this.getSuggestionValue}
                 renderSuggestion={this.renderSuggestion}
                 inputProps={inputProps}
                 onSuggestionSelected={(_, item) => {
                   history.push(`/product/${item.suggestion.slug}`);
                 }}
               />
             </Col>
             <Col
               xs={{ size: 12, order: 2 }}
               sm={{ size: 12, order: 2 }}
               md={{ size: 4, order: 1 }}
               lg={{ size: 5, order: 3 }}
               className="desktop-hidden"
             >
               <div className="header-links">
                 <Button
                   borderless
                   variant="empty"
                   ariaLabel="open the menu"
                   icon={<BarsIcon />}
                   onClick={() => this.toggleMenu()}
                 />
                 <div className="header-links-cart">
                   <CartIcon cartItems={cartItems} onClick={toggleCart} />
                 </div>
               </div>
             </Col>
             <Col
               xs={{ size: 12, order: 2 }}
               sm={{ size: 12, order: 2 }}
               md={{ size: 9, order: 1 }}
               lg={{ size: 4, order: 3 }}
               // className='px-0'
             >
               <Navbar color="light" light expand="md" className="mt-1 mt-md-0">
                 <CartIcon
                   className="d-none d-md-block"
                   cartItems={cartItems}
                   onClick={toggleCart}
                 />
                 <Nav navbar>
                   <NavItem>
                     <NavLink
                       tag={ActiveLink}
                       to="/shop"
                       activeClassName="active"
                     >
                       Cửa hàng
                     </NavLink>
                   </NavItem>
                   {authenticated ? (
                     <UncontrolledDropdown nav inNavbar>
                       <DropdownToggle nav>
                         {user.name
                           ? `Xin chào, ${user.name
                               .toString()
                               .split(" ")
                               .pop()}`
                           : "Tài khoản"}
                         <span className="fa fa-chevron-down dropdown-caret"></span>
                       </DropdownToggle>
                       <DropdownMenu right>
                         <DropdownItem
                           onClick={() => history.push("/dashboard")}
                           className="dropdown-account"
                         >
                           Tài khoản
                         </DropdownItem>
                         <DropdownItem
                           onClick={() => history.push("/dashboard/address")}
                           className="dropdown-address"
                         >
                           Địa chỉ
                         </DropdownItem>
                         <DropdownItem
                           onClick={() => history.push("/dashboard/orders")}
                           className="dropdown-order"
                         >
                           Đơn hàng
                         </DropdownItem>
                         <DropdownItem
                           onClick={signOut}
                           className="dropdown-signout"
                         >
                           Đăng xuất
                         </DropdownItem>
                       </DropdownMenu>
                     </UncontrolledDropdown>
                   ) : (
                     <UncontrolledDropdown nav inNavbar>
                       <DropdownToggle nav>
                         Xin chào!
                         <span className="fa fa-chevron-down dropdown-caret"></span>
                       </DropdownToggle>
                       <DropdownMenu right>
                         <DropdownItem onClick={() => history.push("/login")}>
                           Đăng nhập
                         </DropdownItem>
                         <DropdownItem
                           onClick={() => history.push("/register")}
                         >
                           Đăng ký
                         </DropdownItem>
                       </DropdownMenu>
                     </UncontrolledDropdown>
                   )}
                 </Nav>
               </Navbar>
             </Col>
           </Row>
         </Container>

         {/* hidden cart drawer */}
         <div
           className={isCartOpen ? "mini-cart-open" : "hidden-mini-cart"}
           aria-hidden={`${isCartOpen ? false : true}`}
         >
           <div className="mini-cart">
             <Cart />
           </div>
           <div
             className={
               isCartOpen ? "drawer-backdrop dark-overflow" : "drawer-backdrop"
             }
             onClick={toggleCart}
           />
         </div>

         {/* hidden menu drawer */}
         <div
           className={isMenuOpen ? "mini-menu-open" : "hidden-mini-menu"}
           aria-hidden={`${isMenuOpen ? false : true}`}
         >
           <div className="mini-menu">
             <Menu />
           </div>
           <div
             className={
               isMenuOpen ? "drawer-backdrop dark-overflow" : "drawer-backdrop"
             }
             onClick={toggleMenu}
           />
         </div>
       </header>
     );
   }
 }

 const mapStateToProps = (state) => {
   return {
     isMenuOpen: state.navigation.isMenuOpen,
     isCartOpen: state.navigation.isCartOpen,
     isBrandOpen: state.navigation.isBrandOpen,
     cartItems: state.cart.cartItems,
     categories: state.category.storeCategories,
     authenticated: state.authentication.authenticated,
     user: state.account.user,
     searchValue: state.navigation.searchValue,
     suggestions: state.navigation.searchSuggestions,
   };
 };
 
 export default connect(mapStateToProps, actions)(withRouter(Navigation));
 