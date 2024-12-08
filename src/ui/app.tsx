import { useEffect, useState } from "react";
import * as Networker from "monorepo-networker";
import { NetworkMessages } from "@common/network/messages";
import { NetworkSide } from "@common/network/sides";
import { Toaster, toast } from 'sonner'

// import ReactLogo from "@ui/assets/react.svg?component";
// import viteLogo from "@ui/assets/vite.svg?url";
// import figmaLogo from "@ui/assets/figma.png";

import { Button } from "@ui/components/Button";
import "@ui/styles/main.scss";
const version = "v1.0.2";
const BREAKPOINTS = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];

function App() {
  const [serverUrl, setServerUrl] = useState("");
  const [breakpoint, setBreakpoint] = useState("");
  const [componentName, setComponentName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState("AUTO");

  useEffect(() => {
    if (serverUrl != "" || componentName != "" || breakpoint != "") {
      NetworkMessages.SET_CONFIG.send({
        serverUrl: serverUrl,
        componentName: componentName,
        breakpoint: breakpoint,
        mode: mode,
      });
    }
  }, [serverUrl, componentName, breakpoint]);

  useEffect(() => {
    NetworkMessages.GET_CONFIG.request({}).then((response) => {
      setServerUrl(response.serverUrl);
      setComponentName(response.componentName);
      setBreakpoint(response.breakpoint);
      setMode(response.mode);
    });
  }, []);
  useEffect(() => {
    const handlePluginMsg = (event: CustomEvent) => {
      const msg = `${event.detail}`.replace("_x_", " @ ").replace("starting", "▶️");
      if (`${event.detail}`.startsWith("done")) {
        toast.success(msg, {duration: 10000})
      }else if (`${event.detail}`.startsWith("starting")) {
        toast.info(msg, {duration: 10000})
      }else {
        toast.error(event.detail, {duration: 10000})
      }
    };

    (document as any).addEventListener("pluginmsg", handlePluginMsg);

    return () => {
      (document as any).removeEventListener("pluginmsg", handlePluginMsg);
    };
  }, []);

  return (
    <div className="homepage">
      <Toaster 
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: 'bg-blue-400',
          title: 'text-red-400',
          description: 'text-red-400',
          actionButton: 'bg-zinc-400',
          cancelButton: 'bg-orange-400',
          closeButton: 'bg-lime-400',
        },
      }}
      />
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

      <h1 style={{ fontSize: "1.2rem" }}>
        Send components to your server ({version})
      </h1>

      <div
        style={{
          flexDirection: "column",
          display: "flex",
        }}
      >
        <label
          style={{
            display: "flex",
            justifyContent: "flex-start",
            color: "lightgray",
            paddingBottom: "4px",
            paddingTop: "8px",
          }}
          htmlFor="serverUrl"
        >
          Server Url
        </label>
        <input
          type="text"
          id="serverUrl"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          placeholder="Enter server URL"
          style={{ marginBottom: 0, padding: "5px" }}
        />
        <label
          style={{
            display: "flex",
            justifyContent: "flex-start",
            color: "lightgray",
            paddingBottom: "4px",
            paddingTop: "8px",
          }}
          htmlFor="mode"
        >
          Mode
        </label>
        <select
          id="mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{ marginBottom: 10, padding: "5px" }}
        >
          <option value="MANUAL">MANUAL</option>
          <option value="AUTO">AUTO</option>
        </select>
        {mode === "MANUAL" || mode == "manual" && (
          <>
            <label
              style={{
                display: "flex",
                justifyContent: "flex-start",
                color: "lightgray",
                paddingBottom: "4px",
                paddingTop: "8px",
              }}
              htmlFor="componentName"
            >
              Component Name
            </label>

            <input
              type="text"
              id="componentName"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="Enter component name"
              style={{ marginBottom: 10, padding: "5px" }}
            />
            <label
              style={{
                display: "flex",
                justifyContent: "flex-start",
                color: "lightgray",
                paddingBottom: "4px",
                paddingTop: "8px",
              }}
              htmlFor="breakpoint"
            >
              Breakpoint
            </label>

            <select
              value={breakpoint}
              id="breakpoint"
              onChange={(e) => setBreakpoint(e.target.value)}
              style={{ marginBottom: 10, padding: "5px" }}
            >

            {BREAKPOINTS.map((bp) => (
              <option key={bp} value={bp}>
                {bp}
              </option>
            ))}
            </select>
          </>
        )}
      </div>
      <div className="card">
        <Button
          onClick={() => {
            setSubmitting(true);
            const payload = {
              serverUrl: serverUrl,
              componentName: componentName,
              breakpoint: breakpoint,
              mode: mode,
            };

            NetworkMessages.EXPORT_REQUEST.request(payload).then((response) => {
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
        This plugin will send send the exported JSON, SVGSTRING and PNG to the server
        {/* <span>(Current logical side = {Networker.Side.current.getName()})</span> */}
      </p>
    </div>
  );
}

export default App;
