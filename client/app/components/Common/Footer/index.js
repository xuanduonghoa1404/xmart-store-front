/**
 *
 * Footer
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';

import Newsletter from '../../../containers/Newsletter';

const Footer = () => {
  const infoLinks = [
    { id: 0, name: "Liên hệ", to: "/contact" },
    { id: 1, name: "Sản phẩm", to: "/shop" },
    { id: 2, name: "Vận chuyển", to: "/shipping" },
  ];
  const policyLinks = [
    { id: 0, name: "Chính sách bảo mật", to: "/privacy-policy" },
    { id: 1, name: "Điều khoản", to: "/policy" },
  ];
  const businessLinks = [
    { id: 0, name: "Tài khoản", to: "/dashboard" },
    { id: 1, name: "Lịch sử mua hàng", to: "/dashboard/orders" },
  ];

  // const footerBusinessLinks = (
  //   <ul className="support-links">
  //     <li className="footer-link">
  //       <Link to="/dashboard">Tài khoản</Link>
  //     </li>
  //     <li className="footer-link">
  //       <Link to="/dashboard/orders">Lịch sử mua hàng</Link>
  //     </li>
  //   </ul>
  // );

  const footerLinks = infoLinks.map((item) => (
    <li key={item.id} className="footer-link">
      <Link key={item.id} to={item.to}>
        {item.name}
      </Link>
    </li>
  ));
  const footerPolicyLinks = policyLinks.map((item) => (
    <li key={item.id} className="footer-link">
      <Link key={item.id} to={item.to}>
        {item.name}
      </Link>
    </li>
  ));
  const footerBusinessLinks = businessLinks.map((item) => (
    <li key={item.id} className="footer-link">
      <Link key={item.id} to={item.to}>
        {item.name}
      </Link>
    </li>
  ));

  return (
    <footer className="footer">
      <Container>
        <div className="footer-content">
          <div className="footer-block">
            <div className="block-title">
              <h2>Chăm sóc khách hàng</h2>
            </div>
            <div className="block-content">
              <ul>{footerBusinessLinks}</ul>
            </div>
          </div>
          <div className="footer-block">
            <div className="block-title">
              <h2>Điều khoản và chính sách</h2>
            </div>
            <div className="block-content">
              <ul>{footerPolicyLinks}</ul>
            </div>
          </div>
          <div className="footer-block">
            <div className="block-title">
              <h2>Thông tin X Mart</h2>
            </div>
            <div className="block-content">
              <ul>{footerLinks}</ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <span>© {new Date().getFullYear()} X Mart</span>
        </div>
        <ul className="footer-social-item">
          <li>
            <a
              href="https://www.facebook.com/xuanduong.hoa.9"
              rel="noreferrer noopener"
              target="_blank"
            >
              <span className="facebook-icon" />
            </a>
          </li>
          <li>
            <a href="/#instagram" rel="noreferrer noopener" target="_blank">
              <span className="instagram-icon" />
            </a>
          </li>
          <li>
            <a href="/#pinterest" rel="noreferrer noopener" target="_blank">
              <span className="pinterest-icon" />
            </a>
          </li>
          <li>
            <a href="/#twitter" rel="noreferrer noopener" target="_blank">
              <span className="twitter-icon" />
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
};

export default Footer;
