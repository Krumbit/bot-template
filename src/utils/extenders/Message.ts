import { Message, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, BufferResolvable, HexColorString, BaseMessageOptions, APIEmbed, ButtonStyle, MessageEditOptions, MessageReplyOptions } from 'discord.js';
import * as fs from 'fs';
import path from 'path';

import { colors } from '@config/config.json';
import assets from '@config/assets.json';

declare module 'discord.js' {
    interface Message {
        prefix: string;
        reacts(...reactions: string[]): void;
        error(description: string, image?: BufferResolvable): Promise<Message<boolean> | undefined>;
        post(content: string | EmbedBuilder, options?: ExtendedMessageReplyOptions): Promise<Message<boolean> | undefined>;
    }
}

Message.prototype.reacts = async function (...reactions: string[]) {
    reactions.forEach(r => this.react(r));
};

Message.prototype.error = function (description: string, image?: BufferResolvable) {
    const embed = new EmbedBuilder()
        .setDescription(description)
        .setColor(colors.error as HexColorString)
        .setThumbnail(assets.icons.error);

    var attachment;
    if (image) {
        if (fs.existsSync(image)) {
            attachment = new AttachmentBuilder(image, { name: path.basename(image as string) });
            embed.setImage(`attachment://${path.basename(image as string)}`);
        } else {
            embed.setImage(image as string);
        }
    }

    return this.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
        ...(attachment ? { files: [attachment] } : {})
    });
};

Message.prototype.post = async function (content: string | EmbedBuilder, options?: ExtendedMessageReplyOptions) {
    options = {
        page: 1,
        time: 120000,
        allowedMentions: {
            repliedUser: false
        },
        ...options
    };

    if (typeof content === "string") return this.reply({
        content: content,
        ...options
    });

    if (typeof content === "object" && !content.pages && !Array.isArray(content)) {
        if (content.data) return this.reply({
            embeds: [content],
            allowedMentions: options.allowedMentions
        });

        return this.reply({
            ...content,
            allowedMentions: options.allowedMentions
        });
    }

    if (content.pages) {
        let pages = content.pages.map((page, index) => {
            Object.keys(content.data).forEach(key => {
                if (typeof key !== 'string' || key === 'pages') return;
                if (!page.data[key as keyof APIEmbed]) (page.data[key as keyof APIEmbed] as APIEmbed[keyof APIEmbed]) = content.data![key as keyof APIEmbed];
                if (key === 'author' && content.data![key] && content.data[key]!.icon_url && !page.data[key]!.icon_url) page.data[key]!.icon_url = content.data[key]!.icon_url;
                if (key === 'fields') page.data[key]!.unshift(...content.data[key]!);
            });

            if (content.data.footer) {
                const { text } = content.data.footer;
                if (text) {
                    page.setFooter({
                        ...content.data.footer,
                        text: `『 Page ${index + 1}/${content.pages!.length} 』${text}`
                    });
                }
            } else {
                page.setFooter({ text: `『 Page ${index + 1}/${content.pages!.length} 』` });
            }

            return page;
        });

        const sending = pages.map(page => ({
            embeds: [page],
            // files: content.files || [],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setEmoji('◀️')
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId('prev'),
                        new ButtonBuilder()
                            .setEmoji('▶️')
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId('next'),
                        new ButtonBuilder()
                            .setEmoji('⏹️')
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId('stop'),
                    )
            ],
            allowedMentions: {
                repliedUser: false
            }
        }));

        let { page, time } = options;

        const msg = await this.reply(sending[page! - 1] as MessageReplyOptions);

        if (sending.length === 1) return;

        const collector = msg.createMessageComponentCollector({
            filter: (interaction) => interaction.user.id === this.author.id,
            time: time
        });

        collector.on("collect", async (interaction) => {
            interaction.deferUpdate();

            switch (interaction.customId) {
                case "next":
                    page = page! < sending.length ? page! + 1 : 1;
                    break;
                case "prev":
                    page = page! > 1 ? page! - 1 : sending.length;
                    break;
                case "stop":
                    collector.stop();
                    return;
            }

            (sending[page! - 1] as BaseMessageOptions).content = (sending[page! - 1] as BaseMessageOptions).content || "\u200b";
            msg.edit(sending[page! - 1] as MessageEditOptions);
        });

        collector.on("end", _ => {
            sending[page! - 1].components = [];
            msg.edit(sending[page! - 1] as MessageEditOptions);
        });
    }
};

function isMessageOptionsObject(object: any): object is ExtendedMessageReplyOptions {
    return 'pages' in object;
}

interface ExtendedMessageReplyOptions extends MessageReplyOptions {
    page?: number,
    pages?: EmbedBuilder[];
    time?: number,
}
