import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GetAllSpots from "./components/Spots/GetAllSpots";
import GetSpotById from "./components/Spots/GetSpotById";
import Footer from "./components/Footer";
import GetCurrentUserSpots from "./components/Spots/GetCurrentUserSpots";
import UserBookings from "./components/Bookings/UserBookings";
import ErrorPage from "./components/ErrorPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <nav className="navigation">
        <Navigation isLoaded={isLoaded} />
      </nav>
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <GetAllSpots />
          </Route>
          <Route exact path ='/spots/current'>
            <GetCurrentUserSpots />
          </Route>
          <Route exact path='/spots/:spotId'>
            <GetSpotById />
          </Route>
          <Route exact path = '/bookings/current'>
            <UserBookings />
          </Route>
          <Route>
            <ErrorPage />
          </Route>
        </Switch>
      )}
      <Footer />
    </>
  );
}

export default App;
