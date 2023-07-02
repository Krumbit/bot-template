require('dotenv').config();
import { Client, ClientEvents, Collection, GatewayIntentBits } from 'discord.js';

import allFiles from '@utils/allFiles';

import assets from '@config/assets.json';
import { colors } from '@config/config.json';
import CommandHandler from '@structures/CommandHandler';
import InteractionHandler from '@structures/InteractionHandler';
import { Colors } from '@utils/types/Config';
import { Assets } from '@utils/types/Assets';
import EventHandler from '@structures/EventHandler';

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, CommandHandler>;
        interactions: Collection<string, InteractionHandler>;
        colors: Colors;
        assets: Assets;
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildEmojisAndStickers
    ]
});

client.commands = new Collection();
client.interactions = new Collection();

client.colors = colors as Colors;
client.assets = assets;

allFiles('./utils/extenders')
    .filter(file => file.endsWith(`.${__filename.split('.').pop()}`))
    .forEach(file => {
        file = file.replace(/\\/g, "/");
        require(`./${file}`);
    });

allFiles('./events')
    .filter(file => file.endsWith(`.${__filename.split('.').pop()}`))
    .forEach(async file => {
        file = file.replace(/\\/g, "/");
        const event = require(`./${file}`);
        const e: EventHandler = new event.default();
        client.on(e.event as keyof ClientEvents, e.onEvent.bind(null, client));
        delete require.cache[require.resolve(`./${file}`)];
    });

allFiles('./commands')
    .filter(file => file.endsWith(`.${__filename.split('.').pop()}`))
    .forEach(file => {
        file = file.replace(/\\/g, "/");
        const command = require(`./${file}`);
        const c: CommandHandler = new command.default();
        client.commands.set(c.name, c);
        delete require.cache[require.resolve(`./${file}`)];
    });

allFiles('./interactions')
    .filter(file => file.endsWith(`.${__filename.split('.').pop()}`))
    .forEach(file => {
        file = file.replace(/\\/g, "/");
        const interaction = require(`./${file}`);
        const i: InteractionHandler = new interaction.default();
        client.interactions.set(i.name, i);
        delete require.cache[require.resolve(`./${file}`)];
    });

client.login(process.env.DISCORD_BOT_TOKEN);