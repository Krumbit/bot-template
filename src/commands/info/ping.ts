import ms from "ms";
import { Client, EmbedBuilder, Message } from 'discord.js';
import CommandHandler, { Category } from '@structures/CommandHandler';

import { developers } from '@config/config.json';

export default class extends CommandHandler {
    constructor() {
        super({
            name: "ping",
            aliases: ["invite"],
            description: "Sends information and statistics about the client.",
            usage: "",
            example: "",
            category: Category.info
        });
    }

    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    async run(client: Client, message: Message<true>, args: string[]) {
        const embed = new EmbedBuilder()
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

        return message.post(embed);
    }
};