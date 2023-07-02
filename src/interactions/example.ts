import { SlashCommandBuilder, Client, InteractionType, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

import InteractionHandler from '@structures/InteractionHandler';

export default class extends InteractionHandler {
    constructor() {
        super({
            name: "example",
            type: InteractionType.ApplicationCommand,
            description: "Example Command",
        });
    }

    build(builder: SlashCommandBuilder) {
        return builder
            .addStringOption(option =>
                option
                    .setName("input")
                    .setDescription("Input Text")
                    .setRequired(true)
            ) as SlashCommandBuilder;
    }

    async run(client: Client, interaction: ChatInputCommandInteraction) {
        const input = interaction.options.getString("input");

        const embed = new EmbedBuilder()
            .setAuthor({ name: `This is an example command` })
            .addPages(
                new EmbedBuilder()
                    .setTitle("Page 1")
                    .setDescription(`Option is \`${input}\``)
                    .addFields(
                        { name: `Test Field`, value: `Hello World` },
                        { name: `Test Field`, value: `\`Hello World\`` },
                        { name: `Test List`, list: [`Hello`, `World`] }
                    ),
                new EmbedBuilder()
                    .setTitle("Page 2")
                    .addFields(
                        {
                            name: `Test Bullets`, bullets: [
                                { name: `Hello`, value: `World` },
                                { name: `World`, value: `Hello` },
                            ]
                        }
                    )
            );

        interaction.post(embed);
    }
};