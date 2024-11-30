import { useEffect, useState } from "react";
import * as Networker from "monorepo-networker";
import { NetworkMessages } from "@common/network/messages";

// import ReactLogo from "@ui/assets/react.svg?component";
// import viteLogo from "@ui/assets/vite.svg?url";
// import figmaLogo from "@ui/assets/figma.png";

import { Button } from "@ui/components/Button";
import "@ui/styles/main.scss";

function App() {
  const [serverUrl, setServerUrl] = useState("");
  const [breakpoint, setBreakpoint] = useState("");
  const [componentName, setComponentName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (serverUrl != "" || componentName != "" || breakpoint != "") {
      NetworkMessages.SET_CONFIG.send({
        serverUrl: serverUrl,
        componentName: componentName,
        breakpoint: breakpoint,
      });
    }
    
  }, [serverUrl, componentName, breakpoint]);

  useEffect(() => {
    NetworkMessages.GET_CONFIG.request({}).then((response) => {
      setServerUrl(response.serverUrl);
      setComponentName(response.componentName);
      setBreakpoint(response.breakpoint);
    });
    
  }, []);


  return (
    <div className="homepage">
      <div>
        {/* <a href="https://www.figma.com" target="_blank">
          <img src={figmaLogo} className="logo figma" alt="Figma logo" />
        </a>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <ReactLogo className="logo react" title="React logo" />
        </a> */}
      </div>

      <h1>Send component to your server</h1>

      <div style={{
        flexDirection: "column",
        display: "flex", 
      }}>
        <input
          type="text"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          placeholder="Enter server URL"
          style={{ marginBottom: 10, padding: "5px" }}
        />

        <input
          type="text"
          value={componentName}
          onChange={(e) => setComponentName(e.target.value)}
          placeholder="Enter component name"
          style={{ marginBottom: 10, padding: "5px" }}
        />

        <select
          value={breakpoint}
          onChange={(e) => setBreakpoint(e.target.value)}
          style={{ marginBottom: 10, padding: "5px" }}
        >
          <option value="BRONZE">BRONZE</option>
          <option value="SILVER">SILVER</option>
          <option value="GOLD">GOLD</option>
          <option value="PLATINUM">PLATINUM</option>
          <option value="DIAMOND">DIAMOND</option>
        </select>
      </div>
      <div className="card">
        <Button
          onClick={() => {
            setSubmitting(true);
            const payload = {
              serverUrl: serverUrl,
              componentName: componentName,
              breakpoint: breakpoint,
            };
            
            NetworkMessages.EXPORT_REQUEST.request(payload).then( (response) => {
              console.log(` response`, response);
              setSubmitting(false);
            });
            // NetworkMessages.EXPORT_REQUEST.send(payload)
            setSubmitting(false);
          }}
          style={{ marginInlineStart: 10 }}
          disabled={submitting}
        >
          {submitting ? "Sending export..." : "Send export to server"}
        </Button>
      </div>

      <p className="read-the-docs">
        This plugin will send send the exported JSON, SVGSTRING and PNG to the
        server
        {/* <span>(Current logical side = {Networker.Side.current.getName()})</span> */}
      </p>
    </div>
  );
}

export default App;
