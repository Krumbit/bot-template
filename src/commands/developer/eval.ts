import util from 'util';
import { Message, Client, EmbedBuilder } from "discord.js";

import CommandHandler, { Category } from '@structures/CommandHandler';

export default class extends CommandHandler {
    constructor() {
        super({
            name: "eval",
            aliases: [],
            description: "Allows our development team to evalutate provided code.",
            usage: "<code>",
            example: "message.channel.send(\"hello\")",
            category: Category.developer,
            devOnly: true
        });
    }

    async run(client: Client, message: Message<true>, args: string[]) {
        let code = args.join(" ");
        if (!code.includes('return')) code = `return ${code}`;

        const embed = new EmbedBuilder()
            .setColor(client.colors.main);

        try {
            embed.setAuthor({ name: `Successful Evaluation` });
            embed.addFields({
                name: `:outbox_tray: Output:`,
                value: `\`\`\`js\n${util.inspect(await eval(`(async () => {${code}})()`)).split("").slice(0, 1000).join("")}\n\`\`\``
            });
        } catch (e) {
            embed.setAuthor({ name: `Unsuccessful Evaluation` });
            embed.addFields({
                name: `:outbox_tray: Error:`,
                value: `\`\`\`js\n${e}\n\`\`\``
            });
        }

        return message.post(embed);
    }
};