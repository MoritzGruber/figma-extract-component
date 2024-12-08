// https://www.figma.com/plugin-docs/manifest/
export default {
  name: "send-compnent-to-server",
  id: "1441863874619228475",
  api: "1.0.2",
  main: "plugin.js",
  ui: "index.html",
  capabilities: [],
  enableProposedApi: false,
  documentAccess: "dynamic-page",
  networkAccess: {
    allowedDomains: ["*"],
    devAllowedDomains: ["*"],
    reasoning: "We need to send the component to the server, but the server address is not known in advance. It can be a public service or a locel dev server",
  },
  editorType: ["figma"],
};
