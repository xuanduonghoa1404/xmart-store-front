/**
 *
 * Application
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';

import actions from '../../actions';

// routes
import Login from '../Login';
import Signup from "../Signup";
import HomePage from "../Homepage";
import Dashboard from "../Dashboard";
import Navigation from "../Navigation";
import Authentication from "../Authentication";
import Notification from "../Notification";
import ForgotPassword from "../ForgotPassword";
import ResetPassword from "../ResetPassword";
import Shop from "../Shop";
import ProductPage from "../ProductPage";
import Contact from "../Contact";
import OrderSuccess from "../OrderSuccess";
import OrderPage from "../OrderPage";
import CheckoutPage from "../CheckoutPage";
import Locator from "../Locator";
import AuthSuccess from "../AuthSuccess";

import Footer from "../../components/Common/Footer";
import Page404 from "../../components/Common/Page404";
import FooterSection from "../FooterSection/FooterSection";

class Application extends React.PureComponent {
  componentDidMount() {
    const token = localStorage.getItem("token");

    if (token) {
      this.props.fetchProfile();
    }

    this.props.handleCart();

    document.addEventListener("keydown", this.handleTabbing);
    document.addEventListener("mousedown", this.handleMouseDown);
  }

  handleTabbing(e) {
    if (e.keyCode === 9) {
      document.body.classList.add("user-is-tabbing");
    }
  }

  handleMouseDown() {
    document.body.classList.remove("user-is-tabbing");
  }

  render() {
    return (
      <div className="application">
        <Notification />
        <Navigation />
        <main className="main">
          <Container>
            <div className="wrapper">
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/shop" component={Shop} />
                <Route path="/contact" component={Contact} />
                <Route path="/product/:slug" component={ProductPage} />
                <Route path="/order/success/:id" component={OrderSuccess} />
                <Route path="/order/:id" component={OrderPage} />
                <Route path="/checkout" component={CheckoutPage} />
                <Route path="/login" component={Login} />
                <Route path="/locator" component={Locator} />
                <Route path="/register" component={Signup} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <Route
                  path="/reset-password/:token"
                  component={ResetPassword}
                />
                <Route path="/auth/success" component={AuthSuccess} />
                <Route
                  path="/dashboard"
                  component={Authentication(Dashboard)}
                />
                <Route path="/404" component={Page404} />
                <Route path="*" component={Page404} />
              </Switch>
            </div>
          </Container>
        </main>
        {/* <FooterSection /> */}
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    products: state.product.storeProducts
  };
};

export default connect(mapStateToProps, actions)(Application);
