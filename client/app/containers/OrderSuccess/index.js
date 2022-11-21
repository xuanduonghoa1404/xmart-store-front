/*
 *
 * OrderSuccess
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import actions from '../../actions';

import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

class OrderSuccess extends React.PureComponent {
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.fetchOrder(id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const id = this.props.match.params.id;
      this.props.fetchOrder(id);
    }
  }

  render() {
    const { order, isLoading } = this.props;

    return (
      <div className="order-success">
        {isLoading ? (
          <LoadingIndicator />
        ) : order._id ? (
          <div className="order-message">
            <h2>Bạn đã đặt hàng thành công !</h2>
            <p>
              Đơn hàng{" "}
              <Link
                to={{
                  pathname: `/order/${order._id}?success`,
                  state: { prevPath: location.pathname },
                }}
                // to={`/order/${order._id}?success`}
                className="order-label"
              >
                #{order._id}
              </Link>{" "}
              đã được tạo.
            </p>
            <div className="order-success-actions">
              <Link to="/dashboard/orders" className="btn-link">
                Lịch sử mua hàng
              </Link>
              <Link to="/shop" className="btn-link shopping-btn">
                Tiếp tục mua hàng
              </Link>
            </div>
          </div>
        ) : (
          <NotFound message="Không tìm thấy đơn hàng" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    order: state.order.order,
    isLoading: state.order.isLoading
  };
};

export default connect(mapStateToProps, actions)(OrderSuccess);
