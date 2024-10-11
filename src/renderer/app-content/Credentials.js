import React, { useState } from "react";

function Credentials() {
  const [user, setUser] = useState("");
  const [pass, setPassword] = useState("");

  const handleSave = () => {
    window.electron.saveData({ user, pass }).then((response) => {
      alert(response);
    });
  };

  return (
    <div className="login-container">
      <h1>ingradient.</h1>
      <div className="form-container">
        <input
          className="input"
          type="text"
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className="input password"
          type="text"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="sign-reg">
          <button onClick={handleSave}>Sign In</button>
          <button onClick={handleSave}>Register</button>
        </div>
        <p className="warning">
          <em>
            <b>Warning:</b>
          </em>{" "}
          Do not enter any personal information.
        </p>
      </div>
    </div>
  );
}

export default Credentials;
