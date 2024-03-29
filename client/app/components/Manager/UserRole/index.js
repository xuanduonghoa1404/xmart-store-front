/**
 *
 * UserRole
 *
 */

import React from 'react';

const UserRole = props => {
  const { className, user } = props;

  return (
    <>
      {user.role === "admin" ? (
        <span className={`role admin ${className}`}>Admin</span>
      ) : user.role === "ROLE_MERCHANT" ? (
        <span className={`role merchant ${className}`}>Merchant</span>
      ) : (
        <span className={`role member ${className}`}>Thành viên</span>
      )}
    </>
  );
};

UserRole.defaultProps = {
  className: ''
};

export default UserRole;
