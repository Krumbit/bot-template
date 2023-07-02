import { Client, Message, EmbedBuilder } from 'discord.js';
import CommandHandler, { Category } from '@structures/CommandHandler';

import { prettify } from '@utils/misc';

export default class extends CommandHandler {
    constructor() {
        super({
            name: "help",
            aliases: [],
            description: "Shows information on all the commands within the client.",
            usage: "[command]",
            example: "ping",
            category: Category.info,
        });
    }

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async run(client: Client, message: Message<true>, args: string[]) {
        const commands = [...client.commands.values()];
        const embed = new EmbedBuilder()
            .setColor(client.colors.main);

        if (!args[0]) {
            const Category = commands.reduce((a, c) => {
                a[c.category!] = [...(a[c.category!] || []), c];
                return a;
            }, {} as CategoryObject);

            embed.setTitle(`Command Help`);
            embed.setDescription(`For more information on each command do \`${message.prefix}help <command>\`. This will show additional information such as aliases, description, usage and access.`);

            Object.keys(Category).forEach(c => {
                embed.addFields({
                    name: prettify(c),
                    value: Category[c].map(c => `\`${c.name}\``).join(", "),
                    inline: false
                });
            });
        } else {
            const command = commands.find(c => c.name == args[0] || c.aliases?.includes(args[0]));
            if (!command) return message.error(`Could not locate a command with the name or aliase of \`${args[0]}\`. Try doing \`${message.prefix}help\` for a full list of commands.`);

            embed.setTitle(`Command Help - ${prettify(command.name)}`);
            embed.setDescription(`${command.description || "No Description Provided."}\n\u200b`);
            embed.addFields({
                name: `Aliases`,
                value: command.aliases?.length ? command.aliases.map(a => `\`${a}\``).join(", ") : `\u200b`
            }, {
                name: `Usage`,
                value: `\`${message.prefix}${command.name}${command.usage ? ` ${command.usage}` : ``}\``
            }, {
                name: `Example`,
                value: `\`${message.prefix}${command.name}${command.example ? ` ${command.example}` : ``}\``
            }, {
                name: `Category`,
                value: `\`${prettify(command.category!)}\``
            });

            if (command.devOnly || command.access?.length) embed.addFields({
                name: `Access`,
                value: command.devOnly ? `\`•\` Developers` : command.access?.filter(a => message.guild.roles.cache.get(a)).map(a => `\`•\` ${message.guild.roles.cache.get(a)!.name}`).join("\n")
            });
        }

        return message.post(embed);
    }
};

type CategoryObject = {
    [key: string]: CommandHandler[];
};