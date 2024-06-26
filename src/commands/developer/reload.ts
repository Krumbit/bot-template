import path from 'path';
import { Client, Message, EmbedBuilder } from 'discord.js';
import CommandHandler, { Category } from '@structures/CommandHandler';

import allFiles from '@utils/allFiles';

export default class extends CommandHandler {
    constructor() {
        super({
            name: "reload",
            aliases: ["r", "rl"],
            description: "Allows our development team to reload a command on the client.",
            usage: "<command/alias>",
            example: "help",
            category: Category.developer,
            devOnly: true
        });
    }


    async run(client: Client, message: Message<true>, args: string[]) {
        if (!args.length) return message.error(`You did not include a command to reload.`);
        const command = client.commands.get(args[0]?.toLowerCase()) || client.commands.find(cmd => cmd.aliases! && cmd.aliases.includes(args[0]?.toLowerCase()));
        if (!command) return message.error(`There is no command with name or alias \`${args[0]?.toLowerCase()}\``);

        allFiles('src/commands').forEach(file => {
            if (path.basename(file) == `${command.name}.ts`) {
                let formattedPath = path.join(__dirname, '..', '..', '..', file).replace(/\\/g, '\\\\');
                try {
                    const startTime = Date.now();
                    const newCommand = new (require(formattedPath)).default();
                    client.commands.set(newCommand.name, newCommand);
                    delete require.cache[require.resolve(formattedPath)];

                    let embed = new EmbedBuilder()
                        .setTitle(`Command Reloaded`)
                        .addFields(
                            { name: `Command`, value: `\`${command.name}\`` },
                            { name: `Aliases`, value: `\`${(command.aliases || []).length ? command.aliases?.join(", ") : "No Aliases."}\`` },
                            { name: `Description`, value: `\`${command.description || "No Description."}\`` },
                            { name: `Reload time`, value: `\`${Date.now() - startTime} ms\`` })
                        .setColor(client.colors.main);

                    return message.post(embed);

                } catch (error: any) {
                    console.log(error);
                    return message.error(`There was an error while reloading command \`${command.name}\`\n\n\`\`\`${error.message}\`\`\``);
                }
            }
        });
    }
};