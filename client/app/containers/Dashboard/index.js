/**
 *
 * Dashboard
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import Admin from '../../components/Manager/Dashboard/Admin';
import Merchant from '../../components/Manager/Dashboard/Merchant';
import Customer from '../../components/Manager/Dashboard/Customer';

import LoadingIndicator from '../../components/Common/LoadingIndicator';

import dashboardLinks from './links.json';

class Dashboard extends React.PureComponent {
  componentDidMount() {
    this.props.fetchProfile();
  }

  render() {
    const { user, isLoading, isMenuOpen, toggleDashboardMenu } = this.props;

    return (
      <>
        {isLoading ? (
          <LoadingIndicator inline />
        ) : user.role === "admin" ? (
          <Admin
            isMenuOpen={isMenuOpen}
            links={dashboardLinks["admin"]}
            toggleMenu={toggleDashboardMenu}
          />
        ) : user.role === "ROLE_MERCHANT" && user.merchant ? (
          <Merchant
            isMenuOpen={isMenuOpen}
            links={dashboardLinks["ROLE_MERCHANT"]}
            toggleMenu={toggleDashboardMenu}
          />
        ) : (
          <Customer
            isMenuOpen={isMenuOpen}
            links={dashboardLinks["customer"]}
            toggleMenu={toggleDashboardMenu}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    isLoading: state.account.isLoading,
    isMenuOpen: state.dashboard.isMenuOpen
  };
};

export default connect(mapStateToProps, actions)(Dashboard);
