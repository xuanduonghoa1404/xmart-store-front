/**
 *
 * AccountDetails
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import UserRole from '../UserRole';
import Input from '../../Common/Input';
import Button from '../../Common/Button';

const AccountDetails = props => {
  const { user, accountChange, updateProfile } = props;

  const handleSubmit = event => {
    event.preventDefault();
    updateProfile();
  };

  return (
    <div className="account-details">
      <div className="info">
        <div className="desc">
          <p className="one-line-ellipsis mr-3">{user.email}</p>
          <UserRole user={user} />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <Row>
          {/* <Col xs="12" md="6">
            <Input
              type={"text"}
              label={"First Name"}
              name={"firstName"}
              placeholder={"Please Enter Your First Name"}
              value={user.firstName ? user.firstName : ""}
              onInputChange={(name, value) => {
                accountChange(name, value);
              }}
            />
          </Col> */}
          <Col xs="12" md="12">
            <Input
              type={"text"}
              label={"Họ Tên"}
              name={"name"}
              placeholder={"Nguyễn Văn A"}
              value={user.name ? user.name : ""}
              onInputChange={(name, value) => {
                accountChange(name, value);
              }}
            />
          </Col>
          {/* TODO: update email feature to be added instead form change */}
          {/* <Col xs='12' md='6'>
            <Input
              type={'text'}
              label={'Email'}
              name={'email'}
              placeholder={'Please Enter Your Email'}
              value={user.email ? user.email : ''}
              onInputChange={(name, value) => {
                accountChange(name, value);
              }}
            />
          </Col> */}
          <Col xs="12" md="12">
            <Input
              type={"text"}
              label={"Số điện thoại"}
              name={"phone"}
              placeholder={"Nhập số điện thoại"}
              value={user.phone ? user.phone : ""}
              onInputChange={(name, value) => {
                accountChange(name, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className="profile-actions">
          <Button type="submit" variant="secondary" text="Lưu thay đổi" />
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;
