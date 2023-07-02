import ms from "ms";
import { Client, InteractionType, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import InteractionHandler from '@structures/InteractionHandler';

import { developers } from '@config/config.json';

export default class extends InteractionHandler {
    constructor() {
        super({
            name: "ping",
            type: InteractionType.ApplicationCommand,
            description: "Pong!"
        });
    }

    async run(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.user!.username} - Information`, iconURL: client.user!.avatarURL()! })
            .addFields({
                name: `Credits`,
                value: `:desktop: ${(await Promise.all(developers.map(async d => `\`${(await client.users.fetch(d))?.tag}\``))).join(", ")}`,
            }, {
                name: `Ping`,
                value: `:hourglass_flowing_sand: \`${Math.round(client.ws.ping)}ms\``,
                inline: true
            }, {
                name: `Uptime`,
                value: ` :alarm_clock:  \`${ms(Number(client.uptime), { long: true })}\``,
                inline: true
            }, {
                name: `Memory Used`,
                value: `:dna: \`${(parseInt(JSON.stringify(process.memoryUsage().heapUsed)) / 1024 / 1024).toFixed(2)} MB\``,
                inline: true
            }, {
                name: `Servers`,
                value: `:speech_left: \`${client.guilds.cache.size.toLocaleString()}\``,
                inline: true
            }, {
                name: `Channels`,
                value: `:hash: \`${client.channels.cache.size.toLocaleString()}\``,
                inline: true
            }, {
                name: `Users`,
                value: `:busts_in_silhouette: \`${client.guilds.cache.reduce((a, c) => a + c.memberCount, 0).toLocaleString()}\``,
                inline: true
            })
            .setColor(client.colors.main);

        interaction.post(embed);
    }
};