import * as Networker from "monorepo-networker";
import { NetworkSide } from "@common/network/sides";
import { NetworkMessages } from "../messages";

interface Payload {
  serverUrl: string;
  componentName: string;
  breakpoint: string;
}

type Response = string;



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

    const isAutoMode = `${payload.componentName}`.toLowerCase() === "auto";
    // Check if anything is selected
    if (selection.length > 0) {
      // Get the first selected node
      const processNode = async (
        selectedNode: SceneNode,
        componentName: string,
        breakpointName: string
      ) => {
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

        await (async () => {
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
              componentName
            )}&breakpoint=${encodeURIComponent(
              breakpointName
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
      };

      //   const details = getNodeDetails(selectedNode)
      //   console.log(JSON.stringify(details, null, 2))
      if (isAutoMode) {
        const components: any = {};

        console.log(` selection`, selection);
        const BREAKPOINTS = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];

        selection.forEach((node) => {
          (node as any)?.children?.map((child: any) => {
            const breakpointName = `${child.name}`.toUpperCase();
            if (BREAKPOINTS.includes(breakpointName)) {
              const componentName = node.name;
              components[`${componentName}_x_${breakpointName}`] = child;
            }
          });
          console.log(
            ` in selected node `,
            node?.name,
            (node as any)?.children?.map((child: any) => child.name)
          );
        });

        // iterate over the components and call processNode - but one by one
        // exectue the async func processNode and when its done porcess the next key in components
        const keys = Object.keys(components);
        (async () => {
          for (const key of keys) {
            console.log(` starting ${key}`, );
            NetworkMessages.HELLO_UI.send({ text: `starting ${key}` });

            const [componentName, breakpoint] = key.split("_x_");
            await processNode(components[key], componentName, breakpoint);

            NetworkMessages.HELLO_UI.send({ text: `done ${key}` });

            console.log(` done with `, key);
          }
          NetworkMessages.HELLO_UI.send({ text: `done with all selected components` });

        })();

        return `Auto mode is not supported yet`;
      } else {
        processNode(selection[0], payload.componentName, payload.breakpoint);
        return `Send to server`;
      }
    } else {
      return "Please select something";
    }
  }
}


// function getNodeDetails(node: SceneNode): any {
//   // Base properties that all nodes have
//   const baseDetails = {
//     id: node.id,
//     name: node.name,
//     type: node.type,
//     visible: node.visible,
//     locked: node.locked,
//     width: "width" in node ? node.width : null,
//     height: "height" in node ? node.height : null,
//     x: "x" in node ? node.x : null,
//     y: "y" in node ? node.y : null,
//     rotation: "rotation" in node ? node.rotation : null,
//     opacity: "opacity" in node ? node.opacity : null,
//   };

//   // Get layout properties if they exist
//   const layoutDetails =
//     "layoutMode" in node
//       ? {
//           layoutMode: node.layoutMode,
//           primaryAxisSizingMode: node.primaryAxisSizingMode,
//           counterAxisSizingMode: node.counterAxisSizingMode,
//           primaryAxisAlignItems: node.primaryAxisAlignItems,
//           counterAxisAlignItems: node.counterAxisAlignItems,
//           paddingLeft: node.paddingLeft,
//           paddingRight: node.paddingRight,
//           paddingTop: node.paddingTop,
//           paddingBottom: node.paddingBottom,
//           itemSpacing: node.itemSpacing,
//         }
//       : {};

//   // Get fill properties if they exist
//   const fillDetails =
//     "fills" in node
//       ? {
//           fills: node.fills,
//         }
//       : {};

//   // Get stroke properties if they exist
//   const strokeDetails =
//     "strokes" in node
//       ? {
//           strokes: node.strokes,
//           strokeWeight: node.strokeWeight,
//           strokeAlign: node.strokeAlign,
//           strokeCap: "strokeCap" in node ? node.strokeCap : null,
//           strokeJoin: "strokeJoin" in node ? node.strokeJoin : null,
//           dashPattern: "dashPattern" in node ? node.dashPattern : null,
//         }
//       : {};

//   // Get effect properties if they exist
//   const effectDetails =
//     "effects" in node
//       ? {
//           effects: node.effects,
//         }
//       : {};

//   // Get text-specific properties if it's a text node
//   const textDetails =
//     node.type === "TEXT"
//       ? {
//           characters: (node as TextNode).characters,
//           fontSize: (node as TextNode).fontSize,
//           fontName: (node as TextNode).fontName,
//           textAlignHorizontal: (node as TextNode).textAlignHorizontal,
//           textAlignVertical: (node as TextNode).textAlignVertical,
//           textAutoResize: (node as TextNode).textAutoResize,
//           textCase: (node as TextNode).textCase,
//           textDecoration: (node as TextNode).textDecoration,
//           letterSpacing: (node as TextNode).letterSpacing,
//           lineHeight: (node as TextNode).lineHeight,
//         }
//       : {};

//   // Get constraints if they exist
//   const constraintDetails =
//     "constraints" in node
//       ? {
//           constraints: node.constraints,
//         }
//       : {};

//   // Get children if they exist
//   const children =
//     "children" in node
//       ? {
//           children: (
//             node as FrameNode | GroupNode | ComponentNode | InstanceNode
//           ).children.map((child) => getNodeDetails(child)),
//         }
//       : {};

//   // Combine all properties
//   return {
//     ...baseDetails,
//     ...layoutDetails,
//     ...fillDetails,
//     ...strokeDetails,
//     ...effectDetails,
//     ...textDetails,
//     ...constraintDetails,
//     ...children,
//   };
// }

// // Serialization function - converts Uint8Array to base64 string
// function uint8ArrayToBase64(uint8Array: any) {
//   let binary = "";
//   for (let i = 0; i < uint8Array.length; i++) {
//     binary += String.fromCharCode(uint8Array[i]);
//   }
//   return btoa(binary);
// }

// // Deserialization function - converts base64 string back to Uint8Array
// function base64ToUint8Array(base64: any) {
//   const binary = atob(base64);
//   const uint8Array = new Uint8Array(binary.length);
//   for (let i = 0; i < binary.length; i++) {
//     uint8Array[i] = binary.charCodeAt(i);
//   }
//   return uint8Array;
// }