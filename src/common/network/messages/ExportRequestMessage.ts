import * as Networker from "monorepo-networker";
import { NetworkSide } from "@common/network/sides";
import { NetworkMessages } from "../messages";

interface Payload {
  serverUrl: string;
  componentName: string;
  breakpoint: string;
}

type Response = string;

function getNodeDetails(node: SceneNode): any {
  // Base properties that all nodes have
  const baseDetails = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    locked: node.locked,
    width: "width" in node ? node.width : null,
    height: "height" in node ? node.height : null,
    x: "x" in node ? node.x : null,
    y: "y" in node ? node.y : null,
    rotation: "rotation" in node ? node.rotation : null,
    opacity: "opacity" in node ? node.opacity : null,
  };

  // Get layout properties if they exist
  const layoutDetails =
    "layoutMode" in node
      ? {
          layoutMode: node.layoutMode,
          primaryAxisSizingMode: node.primaryAxisSizingMode,
          counterAxisSizingMode: node.counterAxisSizingMode,
          primaryAxisAlignItems: node.primaryAxisAlignItems,
          counterAxisAlignItems: node.counterAxisAlignItems,
          paddingLeft: node.paddingLeft,
          paddingRight: node.paddingRight,
          paddingTop: node.paddingTop,
          paddingBottom: node.paddingBottom,
          itemSpacing: node.itemSpacing,
        }
      : {};

  // Get fill properties if they exist
  const fillDetails =
    "fills" in node
      ? {
          fills: node.fills,
        }
      : {};

  // Get stroke properties if they exist
  const strokeDetails =
    "strokes" in node
      ? {
          strokes: node.strokes,
          strokeWeight: node.strokeWeight,
          strokeAlign: node.strokeAlign,
          strokeCap: "strokeCap" in node ? node.strokeCap : null,
          strokeJoin: "strokeJoin" in node ? node.strokeJoin : null,
          dashPattern: "dashPattern" in node ? node.dashPattern : null,
        }
      : {};

  // Get effect properties if they exist
  const effectDetails =
    "effects" in node
      ? {
          effects: node.effects,
        }
      : {};

  // Get text-specific properties if it's a text node
  const textDetails =
    node.type === "TEXT"
      ? {
          characters: (node as TextNode).characters,
          fontSize: (node as TextNode).fontSize,
          fontName: (node as TextNode).fontName,
          textAlignHorizontal: (node as TextNode).textAlignHorizontal,
          textAlignVertical: (node as TextNode).textAlignVertical,
          textAutoResize: (node as TextNode).textAutoResize,
          textCase: (node as TextNode).textCase,
          textDecoration: (node as TextNode).textDecoration,
          letterSpacing: (node as TextNode).letterSpacing,
          lineHeight: (node as TextNode).lineHeight,
        }
      : {};

  // Get constraints if they exist
  const constraintDetails =
    "constraints" in node
      ? {
          constraints: node.constraints,
        }
      : {};

  // Get children if they exist
  const children =
    "children" in node
      ? {
          children: (
            node as FrameNode | GroupNode | ComponentNode | InstanceNode
          ).children.map((child) => getNodeDetails(child)),
        }
      : {};

  // Combine all properties
  return {
    ...baseDetails,
    ...layoutDetails,
    ...fillDetails,
    ...strokeDetails,
    ...effectDetails,
    ...textDetails,
    ...constraintDetails,
    ...children,
  };
}

// Serialization function - converts Uint8Array to base64 string
function uint8ArrayToBase64(uint8Array: any) {
  let binary = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}

// Deserialization function - converts base64 string back to Uint8Array
function base64ToUint8Array(base64: any) {
  const binary = atob(base64);
  const uint8Array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    uint8Array[i] = binary.charCodeAt(i);
  }
  return uint8Array;
}

export class ExportRequestMessage extends Networker.MessageType<
  Payload,
  Response
> {
  receivingSide(): Networker.Side {
    return NetworkSide.PLUGIN;
  }

  handle(payload: Payload, from: Networker.Side): string {
    console.log(` payload`, payload);
    const serverUrl = payload.serverUrl;
    console.log(` serverUrl`, serverUrl);
    console.log(from.getName(), "has pinged us!");

    const selection = figma.currentPage.selection;

    // Check if anything is selected
    if (selection.length > 0) {
      // Get the first selected node
      const selectedNode = selection[0];
      // fetch('https://prod.api.leicht-dot-com.caisy.site').then(response => response.text()).then(data => console.log(data)).catch(error => console.log(error))
      // You can check the node type
      console.log(` selectedNode.parent?.name`, selectedNode.parent?.name);
      console.log(selectedNode.name); // e.g., "RECTANGLE", "TEXT", "FRAME", etc.
      console.log(
        "Children:",
        (selectedNode as any)?.children?.[0]?.name || "No children"
      );
      //   const details = getNodeDetails(selectedNode)
      //   console.log(JSON.stringify(details, null, 2))

      const exportSettingsPNG: ExportSettingsImage = {
        format: "PNG",
        constraint: { type: "SCALE", value: 1 },
      };
      const exportSettingsSVG: ExportSettingsSVGString = {
        format: "SVG_STRING",
      };
      const exportSettingsJSON: ExportSettingsREST = {
        format: "JSON_REST_V1",
      };
      // selectedNode.exportAsync(exportSettingsSVG).then((data) => {
      //   // Create a buffer from the array
      //   // Log the base64 string
      //   console.log(`SVG--`, data.toString(), `--SVG`)
      // })

      (async () => {
        for (const exportSettings of [
          exportSettingsPNG,
          exportSettingsSVG,
          exportSettingsJSON,
        ]) {
          console.log(` `, exportSettings.format);
          const data = await selectedNode.exportAsync(exportSettings as any);
          const format = exportSettings.format;
          let childNodeName = "";
          if ((selectedNode as any)?.children?.length == 1) {
            childNodeName = (selectedNode as any)?.children[0]?.name;
          }
          const url = `${serverUrl}?nodeName=${encodeURIComponent(
            selectedNode.name || ""
          )}&parentNodeName=${encodeURIComponent(
            selectedNode.parent?.name || ""
          )}&childNodeName=${encodeURIComponent(
            childNodeName
          )}&componentName=${encodeURIComponent(
            payload.componentName
          )}&breakpoint=${encodeURIComponent(
            payload.breakpoint
          )}&format=${encodeURIComponent(format)}`;
          console.log(` sending to url`, url);
          await fetch(url, {
            method: "POST",
            headers: {
              // 'Content-Type': format === 'PNG' ? 'image/png' :  format.includes("svg") ? "image/svg+xml"  : 'application/json',
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: format === "PNG" ? Array.from(data) : data,
            }), // body data type must match "Content-Type" header,
          })
            .then((response) => response.text())
            .then((data) =>
              console.log(
                `send the request to the server - response wa: ${data}`,
                format
              )
            )
            .catch((error) => console.error(format, error));
        }
      })();

      // selectedNode.exportAsync(exportSettingsPNG).then((data) => {
      //   // Create a buffer from the array
      //   // Log the base64 string
      //   console.log(`PNG--`, data.toString(), `--PNG`)
      // })
      return `Send to server`;
    } else {
      return "Please select something";
    }
  }
}
