import * as Networker from "monorepo-networker";
import { initializeNetwork } from "@common/network/init";
import { NetworkSide } from "@common/network/sides";
import { NetworkMessages } from "@common/network/messages";

async function bootstrap() {
  initializeNetwork(NetworkSide.PLUGIN);

  if (figma.editorType === "figma") {
    figma.showUI(__html__, {
      width: 800,
      height: 650,
      title: "send-compnent-to-server",
    });
  } 

  console.log("Bootstrapped @", Networker.Side.current.getName());

  NetworkMessages.HELLO_UI.send({ text: "Hey there, UI!" });
}

bootstrap();
