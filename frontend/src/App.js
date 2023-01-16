import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GetAllSpots from "./components/Spots/GetAllSpots";

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
        </Switch>
      )}
    </>
  );
}

export default App;
