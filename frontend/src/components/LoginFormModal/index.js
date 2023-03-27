// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useHistory } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory()

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  return (
    <div className="whole-login-container">
      <h3 className="log-in-header"><div className="x-button" onClick={closeModal}><i className="fas fa-times"></i></div><span>Log In</span></h3>
      <form
        onSubmit={handleSubmit}
        className='form-container'
        >
      <h2 className="welcome-header">Welcome to ChillinBnb</h2>
        <ul className="errors-map">
          {errors.length > 0 ? errors.map((error, idx) => (
            <li key={idx}>{error}</li>
            )) : null}
        </ul>
        <div className="label-tag-container">
        <label>
          <input
            placeholder="Username or Email"
            className="username-email-tag"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            placeholder="Password"
            className="password-tag"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          className="log-in-demo-button"
          type="submit">Log In</button>
        <button
            className="log-in-demo-button demo-button"
            type="submit"
            onClick={() => {
              setCredential("demo@user.io");
              setPassword("password");
            }}
          >
            <span>Demo User</span>
        </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
