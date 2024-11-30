import * as Networker from "monorepo-networker";
import { NetworkSide } from "@common/network/sides";

interface Payload {}

type Response = {
	serverUrl: string;
	componentName: string;
	breakpoint: string;
};

export class GetConfigMessage extends Networker.MessageType<Payload, Response> {
  receivingSide(): Networker.Side {
    return NetworkSide.PLUGIN;
  }

  handle(payload: Payload, from: Networker.Side): Response {
	// get the config from the figma plugin user data if its there 
	const config = figma.root.getPluginData('config');

	// if the config is not there, return an error
	// lets return empty string for all
	if (!config) {
		return {
			serverUrl: '',
			componentName: '',
			breakpoint: 'BRONZE'
		};

	} 

	// parse the config
	const parsedConfig = JSON.parse(config);
	return {
		serverUrl: parsedConfig.serverUrl,
		componentName: parsedConfig.componentName,
		breakpoint: parsedConfig.breakpoint
	}
  }
}
