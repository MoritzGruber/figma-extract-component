import { CreateRectMessage } from "@common/network/messages/CreateRectMessage";
import { HelloMessage } from "@common/network/messages/HelloMessage";
import { ExportRequestMessage } from "@common/network//messages/ExportRequestMessage";
import { NetworkSide } from "@common/network/sides";
import * as Networker from "monorepo-networker";
import { SetConfigMessage } from "./messages/SetConfigMessage";
import { GetConfigMessage } from "./messages/GetConfigMessage";

export namespace NetworkMessages {
  export const registry = new Networker.MessageTypeRegistry();

  export const EXPORT_REQUEST = registry.register(new ExportRequestMessage("export-request"));
  export const SET_CONFIG = registry.register(new SetConfigMessage("set-config"));
  export const GET_CONFIG = registry.register(new GetConfigMessage("get-config"));

  export const HELLO_PLUGIN = registry.register(
    new HelloMessage(NetworkSide.PLUGIN)
  );

  export const HELLO_UI = registry.register(new HelloMessage(NetworkSide.UI));

  export const CREATE_RECT = registry.register(
    new CreateRectMessage("create-rect")
  );
}
