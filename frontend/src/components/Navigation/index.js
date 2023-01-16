// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='navigation-bar'>
      {/* <li> */}
        <NavLink style={{textDecoration: 'none'}} exact to="/">
          <span className='website-name'>
          <img
            className='website-logo'
            src="https://www.publicdomainpictures.net/pictures/130000/nahled/red-snowflake.jpg"
            alt=""
          ></img>
            ChillinBnb
            </span>
        </NavLink>
      {/* </li> */}
      {isLoaded && (
        // <li>
          <ProfileButton user={sessionUser} />
        // </li>
      )}
    </ul>
  );
}

export default Navigation;
