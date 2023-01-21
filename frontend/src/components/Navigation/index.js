// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import CreateNewSpot from '../SpotForm/CreateSpot';
import OpenModalButton from '../OpenModalButton';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let session;

  if (!sessionUser) {
    session = (
      <ProfileButton user={sessionUser} />
    )
  } else {
    session = (
      <>
        <div className='right-section-nav'>
            <OpenModalButton
              className="host-spot-button"
              buttonText={`ChillinBnb your home`}
              modalComponent={<CreateNewSpot />}
              />
          <ProfileButton user={sessionUser} />
        </div>
      </>
    )
  }


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
      {isLoaded && session
      // (
      //   <>
      //     <ProfileButton user={sessionUser} />
      //   </>
      // )
      }
    </ul>
  );
}

export default Navigation;
