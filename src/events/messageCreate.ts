import EventHandler from "@structures/EventHandler";
import { ChannelType, Client, Events, Message, PermissionsBitField } from "discord.js";

import { prefix, developers } from '@config/config.json';
import chalk from "chalk";
import moment from "moment";

export default class extends EventHandler {
    constructor() {
        super({
            event: Events.MessageCreate
        });
    }

    async onEvent(client: Client<true>, message: Message<true>) {
        if (![ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.GuildVoice].includes(message.channel.type)) return;
        if (message.author.bot) return;

        message.prefix = prefix;

        if (message.content.match(new RegExp(`^<@!?${client.user.id}>`))) return message.post(`Hey ${message.member}! For a list of commands please use \`${message.prefix}help\`.`);
        if (!message.content.toLowerCase().startsWith(message.prefix.toLowerCase())) return;

        const args = message.content.slice(message.prefix.length).split(/ +/);
        const commandName = args.shift()!.toLocaleLowerCase();
        const commandHandler = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases! && cmd.aliases?.includes(commandName));

        if (!commandHandler) return;

        if (commandHandler.channels?.whitelist && !commandHandler.channels?.whitelist.includes(message.channel.id) && !developers.includes(message.author.id) && !message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        else if (commandHandler.channels?.blacklist && commandHandler.channels?.blacklist.includes(message.channel.id) && !developers.includes(message.author.id) && !message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        if (commandHandler.access?.length && !message.member?.roles.cache.some(r => commandHandler.access?.includes(r.id)!) && !developers.includes(message.author.id) && !message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) return message.error(`This command is locked to the following roles:\n\n${commandHandler.access.filter(a => message.guild.roles.cache.get(a)).map(a => `\`•\` ${message.guild.roles.cache.get(a)?.name}`).join("\n")}`);
        if (commandHandler.devOnly && !developers.includes(message.author.id)) return message.error(`This command requires you to be part of our development team.`);

        console.log(chalk.blue(`[CMD] [${moment().format('LTS')}] ${message.author.tag} in #${message.channel.name} used: ${message.content}`));

        commandHandler.run(client, message, args).catch(err => {
            console.log(err);
            message.error(`An unexpected error has occured, please report this issue if it continues.\n\n\`\`\`diff\n- ${err.toString().split('\n')[0]}\n\`\`\``);
        });
    };
}