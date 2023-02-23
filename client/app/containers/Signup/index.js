/*
 *
 * Signup
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Redirect, Link } from 'react-router-dom';

import actions from '../../actions';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import Checkbox from '../../components/Common/Checkbox';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import SignupProvider from '../../components/Common/SignupProvider';

class Signup extends React.PureComponent {
  render() {
    const {
      authenticated,
      signupFormData,
      formErrors,
      isLoading,
      isSubmitting,
      isSubscribed,
      signupChange,
      signUp,
      subscribeChange
    } = this.props;

    if (authenticated) return <Redirect to='/dashboard' />;

    const handleSubmit = event => {
      event.preventDefault();
      signUp();
    };

    return (
      <div className="signup-form">
        {isLoading && <LoadingIndicator />}
        <h2>Đăng ký</h2>
        <hr />
        <form onSubmit={handleSubmit} noValidate>
          <Row>
            <Col
              xs={{ size: 12, order: 2 }}
              md={{ size: "6", order: 1 }}
              className="p-0"
            >
              <Col xs="12" md="12">
                <Input
                  type={"text"}
                  error={formErrors["email"]}
                  label={"Email"}
                  name={"email"}
                  placeholder={"Nhập Email"}
                  value={signupFormData.email}
                  onInputChange={(name, value) => {
                    signupChange(name, value);
                  }}
                />
              </Col>
              <Col xs="12" md="12">
                <Input
                  type={"text"}
                  error={formErrors["firstName"]}
                  label={"Họ tên"}
                  name={"name"}
                  placeholder={"Nguyễn Văn A"}
                  value={signupFormData.name}
                  onInputChange={(name, value) => {
                    signupChange(name, value);
                  }}
                />
              </Col>
              <Col xs="12" md="12">
                <Input
                  type={"text"}
                  error={formErrors["phone"]}
                  label={"Số điện thoại"}
                  name={"phone"}
                  placeholder={"Nhập số điện thoại"}
                  value={signupFormData.lastName}
                  onInputChange={(name, value) => {
                    signupChange(name, value);
                  }}
                />
              </Col>
              <Col xs="12" md="12">
                <Input
                  type={"password"}
                  label={"Mật khẩu"}
                  error={formErrors["password"]}
                  name={"password"}
                  placeholder={"Nhập mật khẩu"}
                  value={signupFormData.password}
                  onInputChange={(name, value) => {
                    signupChange(name, value);
                  }}
                />
              </Col>
            </Col>
            {/* <Col
              xs={{ size: 12, order: 1 }}
              md={{ size: '6', order: 2 }}
              className='mb-2 mb-md-0'
            >
              <SignupProvider />
            </Col> */}
          </Row>
          <hr />
          {/* <Checkbox
            id={"subscribe"}
            label={"Đăng ký nhập thông tin mới nhất"}
            checked={isSubscribed}
            toggleCheckboxChange={subscribeChange}
          /> */}
          <div className="input-btn ml-md-3 custom-btn-link md text-only icon-left ">
            <Button
              type="submit"
              variant="primary"
              text="Đăng ký"
              disabled={isSubmitting}
            />
            <Link className="ml-3 mt-md-0 redirect-link" to={"/login"}>
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    signupFormData: state.signup.signupFormData,
    formErrors: state.signup.formErrors,
    isLoading: state.signup.isLoading,
    isSubmitting: state.signup.isSubmitting,
    isSubscribed: state.signup.isSubscribed
  };
};

export default connect(mapStateToProps, actions)(Signup);
