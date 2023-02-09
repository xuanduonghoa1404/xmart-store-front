/*
 *
 * Add
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import AddAddress from '../../components/Manager/AddAddress';
import SubPage from '../../components/Manager/SubPage';

class Add extends React.PureComponent {
  render() {
    const {
      history,
      addressFormData,
      formErrors,
      addressChange,
      addAddress,
      user,
      locators,
    } = this.props;
    console.log("locatorszzzz", locators);
    return (
      <SubPage
        title="Thêm địa chỉ"
        actionTitle="Hủy"
        handleAction={() => history.goBack()}
      >
        <AddAddress
          addressFormData={addressFormData}
          formErrors={formErrors}
          addressChange={addressChange}
          addAddress={addAddress}
          user={user}
          locators={locators}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    addressFormData: state.address.addressFormData,
    formErrors: state.address.formErrors,
    user: state.account.user,
    locators: state.locator.locators,
  };
};

export default connect(mapStateToProps, actions)(Add);
