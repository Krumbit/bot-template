import EventHandler from "@structures/EventHandler";
import chalk from "chalk";
import { ChannelType, ChatInputCommandInteraction, Client, Events, Interaction, InteractionType } from "discord.js";
import moment from "moment";

export default class extends EventHandler {
    constructor() {
        super({
            event: Events.InteractionCreate
        });
    }

    async onEvent(client: Client, interaction: Interaction) {
        let interactionName = "unknown";

        if (interaction.type == InteractionType.MessageComponent) {
            interactionName = interaction.customId;
        } else if (interaction.type == InteractionType.ApplicationCommand) {
            interactionName = interaction.commandName;
        }

        const interactionHandler = client.interactions.find(i => i.name == interactionName && i.type == interaction.type);

        if (!interactionHandler) return;

        if (interaction.channel?.type != ChannelType.DM) {
            console.log(chalk.blue(`[INTERACTION] [${moment().format('LTS')}] ${interaction.user.tag} in #${interaction.channel?.name} used: ${interactionName}`));
        }

        interactionHandler.run(client, interaction).catch(err => {
            console.log(err);
            (interaction as ChatInputCommandInteraction).error(`An unexpected error has occured, please report this issue if it continues.\n\n\`\`\`diff\n- ${err.toString().split('\n')[0]}\n\`\`\``);
        });
    }
}