/*
 *
 * LOCATOR
 *
 */

import React from "react";
import { connect } from "react-redux";

import actions from "../../actions";

// import AccountDetails from "../../components/Manager/AccountDetails";
// import SubPage from "../../components/Manager/SubPage";

class Locator extends React.PureComponent {
  componentDidMount() {
    this.props.fetchLocator();
  }

  render() {
    const { locator } = this.props;

    return (
      <div className="account">
        {/* <SubPage title={"Cập nhật thông tin"} isMenuOpen={null}>
          <AccountDetails
            user={user}
            accountChange={accountChange}
            updateProfile={updateProfile}
          />
        </SubPage> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    locator: state.locator,
  };
};

export default connect(mapStateToProps, actions)(Locator);
