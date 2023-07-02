import EventHandler from "@structures/EventHandler";
import chalk from "chalk";
import { Client, Events, InteractionType } from "discord.js";
import moment from "moment";

export default class extends EventHandler {
    constructor() {
        super({
            event: Events.ClientReady
        });
    }

    onEvent(client: Client) {
        console.log(chalk.blueBright(chalk.bold(`Successfully launched ${client.user!.tag} with ${client.guilds.cache.size || 0} guilds at ${moment().format('LTS')}`)));

        client.guilds.cache.forEach(async guild => {
            await guild.commands.set(
                client.interactions
                    .filter(i => i.type == InteractionType.ApplicationCommand)
                    .map(i => i.data)
            );
        });
    };
}