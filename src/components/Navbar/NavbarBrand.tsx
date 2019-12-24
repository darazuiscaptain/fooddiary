import React from 'react';
import { Link } from 'react-router-dom';
import './NavbarBrand.scss';

const NavbarBrand: React.FC = () => {
  return (
    <div className="navbar__brand">
      <Link to="/">Food diary</Link>
    </div>
  );
};

export default NavbarBrand;
