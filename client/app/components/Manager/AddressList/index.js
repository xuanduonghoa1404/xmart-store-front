/**
 *
 * AddressList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import { AddressIcon, CheckIcon } from '../../Common/Icon';

const AddressList = props => {
  const { addresses } = props;

  return (
    <div className="a-list">
      {addresses.map((address, index) => (
        <Link
          to={`/dashboard/address/edit/${address._id}`}
          key={index}
          className="d-block"
        >
          <div className="d-flex align-items-center mb-3 address-box">
            <div className="mx-3">
              <AddressIcon />
            </div>
            <div className="flex-1 p-3 p-lg-4">
              {address.isDefault ? (
                <h4 className="mb-0">Địa chỉ</h4>
              ) : (
                <h4 className="mb-0">Địa chỉ</h4>
              )}
              <p className="mb-2 address-desc">
                {`${address?.name || ""}, ${address?.phone || ""} ${
                  address?.address
                } ${address?.city}, ${address?.country}, ${address?.zipCode}`}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AddressList;
