import * as Networker from "monorepo-networker";
import { NetworkSide } from "../sides";

interface Payload {
  text: string;
}

export class HelloMessage extends Networker.MessageType<Payload> {
  constructor(private side: Networker.Side) {
    super("hello-" + side.getName());
  }

  receivingSide(): Networker.Side {
    return this.side;
  }

  handle(payload: Payload, from: Networker.Side) {
    if (from === NetworkSide.PLUGIN){
      // create new global custom event that shares the payload
      const event = new CustomEvent("pluginmsg", { detail: payload.text });
      // dispatch the event
      document.dispatchEvent(event);
    }
    console.log(`${from.getName()} said "${payload.text}"`);
  }
}
