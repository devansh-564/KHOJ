import React, { useState } from "react";
import "./App.css";
import states from "./statesData";

function App() {
  const [page, setPage] = useState("landing");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reports, setReports] = useState(() =>
    JSON.parse(localStorage.getItem("reports") || "[]")
  );
  const [users, setUsers] = useState(() =>
    JSON.parse(localStorage.getItem("users") || "[]")
  );
  const [, setCurrentUser] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");

  // --- Authentication ---
  const handleLogin = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const email = data.get("email");
    const password = data.get("password");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setPage("home");
    } else {
      alert("Invalid email or password!");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get("name");
    const phone = data.get("phone");
    const email = data.get("email");
    const password = data.get("password");
    const confirm = data.get("confirm");
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }
    const newUser = { name, phone, email, password };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("Sign-up successful! You can now log in.");
    setPage("login");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage("landing");
  };

  // --- Save Reports ---
  const saveReport = (e, type) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const report = {
      type,
      title: data.get("title"),
      desc: data.get("desc"),
      state: data.get("state"),
      district: data.get("district"),
      landmark: data.get("landmark"),
      date: data.get("date"),
      photo: "",
    };
    const file = data.get("photo");
    const reader = new FileReader();
    reader.onload = () => {
      report.photo = reader.result;
      const updated = [...reports, report];
      setReports(updated);
      localStorage.setItem("reports", JSON.stringify(updated));
      alert("Report submitted successfully!");
      e.target.reset();
    };
    reader.readAsDataURL(file);
  };

  // --- Landing Page ---
  if (page === "landing") {
    return (
      <div className="landing">
        <nav className="landing-nav">
          <h1>KHOJ</h1>
          <div>
            <button onClick={() => setPage("login")}>Login</button>
            <button onClick={() => setPage("signup")}>Sign Up</button>
          </div>
        </nav>

        <div className="landing-content">
          <h2>Welcome to KHOJ</h2>
          <p>Your smart assistant for reporting and finding lost items.</p>

          <div className="info-cards">
            <div className="info-card">
              <h3>⚙️ How it works</h3>
              <ol>
                <li>Create an account and login.</li>
                <li>
                  Choose <b>Report Lost</b> or <b>Report Found</b>.
                </li>
                <li>
                  Fill details: Item, Description, State, District, Landmark,
                  Date, Photo.
                </li>
                <li>Use filters to view reports by location.</li>
              </ol>
            </div>

            <div className="info-card">
              <h3>⭐ Why Khoj?</h3>
              <ul>
                <li>Clean, student-friendly UI</li>
                <li>Location-based filtering</li>
                <li>Separate Lost & Found flows</li>
                <li>Photo evidence for clarity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Signup Page ---
  if (page === "signup") {
    return (
      <div className="container">
        <h2>Create an Account</h2>
        <form onSubmit={handleSignup}>
          <input name="name" placeholder="Full Name" required />
          <input name="phone" placeholder="Phone Number" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <input name="confirm" type="password" placeholder="Re-enter Password" required />
          <button type="submit">Sign Up</button>
        </form>
        <p style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <span className="link" onClick={() => setPage("login")}>
            Log in
          </span>
        </p>
      </div>
    );
  }

  // --- Login Page ---
  if (!isLoggedIn && page === "login") {
    return (
      <div className="container">
        <h2>Login to KHOJ</h2>
        <form onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <p style={{ textAlign: "center" }}>
          Don’t have an account?{" "}
          <span className="link" onClick={() => setPage("signup")}>
            Sign up
          </span>
        </p>
      </div>
    );
  }

  // --- Logged-in Pages ---
  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <div className="container">
            <h2>Welcome to KHOJ</h2>
            <p>Your intelligent Lost & Found assistant — report, find, and connect.</p>
          </div>
        );

      case "lost":
      case "found":
        return (
          <div className="container">
            <h2>{page === "lost" ? "Report Lost Item" : "Report Found Item"}</h2>
            <form onSubmit={(e) => saveReport(e, page)}>
              <input name="title" placeholder="Item Title" required />
              <textarea name="desc" placeholder="Description" required></textarea>

              {/* State Dropdown */}
              <select
                name="state"
                required
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">Select State</option>
                {Object.keys(states).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              {/* District Dropdown */}
              <select name="district" required>
                <option value="">Select District</option>
                {selectedState &&
                  states[selectedState].map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
              </select>

              <input name="landmark" placeholder="Landmark" required />
              <input name="date" type="date" required />
              <input name="photo" type="file" accept="image/*" required />
              <button type="submit">Submit</button>
            </form>
          </div>
        );

      case "dashboard":
        // Filtering logic
        const filteredReports = reports.filter((r) => {
          return (
            (!filterState || r.state === filterState) &&
            (!filterDistrict || r.district === filterDistrict)
          );
        });

        // Sort filtered reports alphabetically
        const sortedReports = [...filteredReports].sort((a, b) => {
          if (a.state !== b.state) return a.state.localeCompare(b.state);
          return a.district.localeCompare(b.district);
        });

        return (
          <div className="container">
            <h2>All Reports</h2>

            {/* Filter Controls */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <select
                value={filterState}
                onChange={(e) => {
                  setFilterState(e.target.value);
                  setFilterDistrict("");
                }}
              >
                <option value="">All States</option>
                {Object.keys(states).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                disabled={!filterState}
              >
                <option value="">All Districts</option>
                {filterState &&
                  states[filterState].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid">
              {sortedReports.length > 0 ? (
                sortedReports.map((r, i) => (
                  <div className="card" key={i}>
                    <h3>{r.title}</h3>
                    <p><b>Type:</b> {r.type}</p>
                    <p>{r.desc}</p>
                    <p><b>State:</b> {r.state} | <b>District:</b> {r.district}</p>
                    {r.photo && <img src={r.photo} alt="Item" />}
                  </div>
                ))
              ) : (
                <p>No reports found for selected filters.</p>
              )}
            </div>
          </div>
        );

      case "about":
        return (
          <div className="container" style={{ textAlign: "center" }}>
            <h2>About KHOJ</h2>
            <p>
              <b>KHOJ</b> is a smart lost & found platform designed to help users
              easily report, find, and reconnect with lost items.
            </p>
            <p>
              Built using <b>React.js</b>, it ensures a smooth, user-friendly
              experience for individuals, schools, and communities.
            </p>
            <ul style={{ textAlign: "left", display: "inline-block" }}>
              <li>🔍 Report and search items with detailed location info.</li>
              <li>📸 Upload photos to improve accuracy and recognition.</li>
              <li>📍 Sort and filter results by state and district.</li>
              <li>👥 Connect with others to help return lost belongings.</li>
            </ul>
            <p style={{ marginTop: "20px" }}>
              <b>Team KHOJ</b> — building safer, more connected communities.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <nav>
        <h1>KHOJ</h1>
        <div>
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("lost")}>Report Lost</button>
          <button onClick={() => setPage("found")}>Report Found</button>
          <button onClick={() => setPage("dashboard")}>Dashboard</button>
          <button onClick={() => setPage("about")}>About</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      {renderPage()}
    </div>
  );
}

export default App;
