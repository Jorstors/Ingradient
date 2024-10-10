import React, { useState } from "react";

function App() {
  const [user, setUser] = useState("");
  const [pass, setPassword] = useState("");

  const handleSave = () => {
    window.electron.saveData({ name, age }).then((response) => {
      alert(response);
    });
  };

  return (
    <div className="app-container">
      <h1>Electron with React and SQLite</h1>
      <input
        className="input"
        type="text"
        placeholder="Username"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        className="input"
        type="number"
        placeholder="Password"
        value={pass}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSave}>Save to Database</button>
    </div>
  );
}

export default App;
