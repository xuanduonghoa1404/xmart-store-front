/*
 *
 * Contact
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';

class Contact extends React.PureComponent {
  render() {
    const {
      contactFormData,
      contactFormChange,
      contactUs,
      formErrors
    } = this.props;

    const handleSubmit = event => {
      event.preventDefault();
      contactUs();
    };

    return (
      <div className="contact">
        <h2>Liên hệ</h2>
        <hr />
        <form onSubmit={handleSubmit}>
          <Row>
            <Col xs="12" md="6">
              <Input
                type={"text"}
                error={formErrors["name"]}
                label={"Họ tên"}
                name={"name"}
                placeholder={"Nguyễn Văn A"}
                value={contactFormData.name}
                onInputChange={(name, value) => {
                  contactFormChange(name, value);
                }}
              />
            </Col>
            <Col xs="12" md="6">
              <Input
                type={"text"}
                error={formErrors["email"]}
                label={"Email"}
                name={"email"}
                placeholder={"abc@example.com"}
                value={contactFormData.email}
                onInputChange={(name, value) => {
                  contactFormChange(name, value);
                }}
              />
            </Col>
            <Col xs="12" md="12">
              <Input
                type={"textarea"}
                error={formErrors["message"]}
                label={"Bạn cần hỗ trợ gì?"}
                name={"message"}
                placeholder={"Vui lòng nhập thông tin"}
                value={contactFormData.message}
                onInputChange={(name, value) => {
                  contactFormChange(name, value);
                }}
              />
            </Col>
          </Row>
          <hr />
          <div className="contact-actions">
            <Button type="submit" text="Gửi" />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    contactFormData: state.contact.contactFormData,
    formErrors: state.contact.formErrors
  };
};

export default connect(mapStateToProps, actions)(Contact);
