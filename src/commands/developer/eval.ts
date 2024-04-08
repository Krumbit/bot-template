import CommandHandler, { Category } from "@structures/CommandHandler";
import { Client, EmbedBuilder, Message } from "discord.js";
import util from "util";

export default class extends CommandHandler {
    constructor() {
        super({
            name: "eval",
            aliases: [],
            description: "Allows our development team to evalutate provided code.",
            usage: "<code> [--s]",
            example: 'message.channel.send("hello")',
            category: Category.developer,
        });
    }

    async run(client: Client, message: Message<true>, args: string[]) {
        let code = args.join(" ");

        const embed = new EmbedBuilder().setColor(client.colors.main);

        try {
            embed.setAuthor({ name: `Successful Evaluation` });
            embed.addFields({
                name: `:outbox_tray: Output:`,
                value: `\`\`\`js\n${util
                    .inspect(await runCodeWithRunArgs(client, message, args, code))
                    .split("")
                    .slice(0, 1000)
                    .join("")}\n\`\`\``,
            });
        } catch (e) {
            embed.setAuthor({ name: `Unsuccessful Evaluation` });
            embed.addFields({
                name: `:outbox_tray: Error:`,
                value: `\`\`\`js\n${e}\n\`\`\``,
            });
        }

        return message.post(embed);
    }
}

async function runCodeWithRunArgs(
    client: Client,
    message: Message,
    args: string[],
    code: string,
) {
    return Function("client", "message", "args", code)(client, message, args);
}