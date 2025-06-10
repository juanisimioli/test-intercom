import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [appId, setAppId] = useState("");
  const [email, setEmail] = useState("");
  const [isIntercomLoaded, setIsIntercomLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [step, setStep] = useState("setup");

  useEffect(() => {
    if (isIntercomLoaded && window.Intercom) {
      window.Intercom("boot", {
        app_id: appId,
      });
      setCurrentUser("anonymous");
    }
  }, [isIntercomLoaded, appId]);

  const loadIntercomScript = () => {
    if (!appId.trim()) {
      alert("Please enter a valid Intercom App ID");
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="widget.intercom.io"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://widget.intercom.io/widget/${appId}`;

    script.onload = () => {
      setIsIntercomLoaded(true);
      setStep("ready");
    };

    script.onerror = () => {
      alert("Failed to load Intercom. Please check your App ID.");
      setIsIntercomLoaded(false);
    };

    document.head.appendChild(script);
  };

  const bootWithEmail = () => {
    if (!email.trim()) {
      alert("Please enter an email address");
      return;
    }

    const userData = {
      app_id: appId,
      email: email,
      name: "Test User",
      phone: "1234567890",
    };

    // OPTION 1
    if (window.Intercom) {
      window.Intercom("shutdown");
      window.Intercom("boot", { ...userData });

      setCurrentUser(email);
    }

    // OPTION 2
    // if (window.Intercom) {
    //   window.Intercom("update", { ...userData });

    //   setTimeout(() => {
    //     window.Intercom("shutdown");
    //     window.Intercom("boot", { ...userData });
    //   }, 500);
    //   setCurrentUser(email);
    // }

    // // OPTION 3
    // if (window.Intercom) {
    //   window.Intercom("shutdown");
    //   window.Intercom("boot", { ...userData });
    //   setTimeout(() => {
    //     window.Intercom("update");
    //   }, 500);
    //   setCurrentUser(email);
    // }
  };

  const bootAnonymous = () => {
    if (window.Intercom) {
      window.Intercom("shutdown");
      window.Intercom("boot", {
        app_id: appId,
      });
      setCurrentUser("anonymous");
    }
  };

  if (step === "setup") {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Intercom Integration Test</h1>

          <div className="setup-container">
            <label className="input-label">Intercom App ID:</label>
            <input
              type="password"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="Enter your Intercom App ID"
              className="app-input"
            />
          </div>

          <button onClick={loadIntercomScript} className="btn btn-primary">
            Load Intercom
          </button>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Intercom Integration Test</h1>

        <div className="status-bar">
          <span>App ID: ✅</span>
          <span>
            Status: {isIntercomLoaded ? "✅ Loaded" : "⏳ Loading..."}
          </span>
          <button
            onClick={() => setStep("setup")}
            className="btn btn-secondary btn-small"
          >
            ⚙️ Change App ID
          </button>
        </div>

        <p className="current-user">
          Current User:{" "}
          {currentUser === "anonymous"
            ? "👤 Anonymous"
            : currentUser
            ? `🔑 ${currentUser}`
            : "❌ Not logged in"}
        </p>

        <div className="actions-container">
          {currentUser === "anonymous" ? (
            <div className="login-section">
              <div className="email-input-container">
                <label className="input-label">Email for login:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="app-input"
                />
              </div>

              <button
                onClick={bootWithEmail}
                disabled={!isIntercomLoaded}
                className="btn btn-login"
              >
                🔑 Login with Email
              </button>
            </div>
          ) : (
            <button
              onClick={bootAnonymous}
              disabled={!isIntercomLoaded}
              className="btn btn-anonymous"
            >
              👤 Go Anonymous
            </button>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
