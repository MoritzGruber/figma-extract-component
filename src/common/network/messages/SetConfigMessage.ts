import * as Networker from "monorepo-networker";
import { NetworkSide } from "@common/network/sides";

interface Payload {
  serverUrl: string;
  componentName: string;
  breakpoint: string;
}

export class SetConfigMessage extends Networker.MessageType<Payload, void> {
  receivingSide(): Networker.Side {
    return NetworkSide.PLUGIN;
  }

  handle(payload: Payload, from: Networker.Side): void {
    // Store the config in the figma plugin user data
    const configString = JSON.stringify({
      serverUrl: payload.serverUrl,
      componentName: payload.componentName,
      breakpoint: payload.breakpoint,
    });

    figma.root.setPluginData("config", configString);
  }
}
