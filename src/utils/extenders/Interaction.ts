import * as fs from 'fs';
import path from 'path';
import { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ColorResolvable, AttachmentData, Interaction, InteractionReplyOptions, APIEmbed, ButtonStyle, BaseMessageOptions, ChatInputCommandInteraction } from 'discord.js';

import { colors } from '@config/config.json';
import assets from '@config/assets.json';

declare module 'discord.js' {
    interface ChatInputCommandInteraction {
        error(description: string, image?: string): Promise<InteractionResponse<boolean> | undefined>;
        post(content: string | EmbedBuilder, options?: ExtendedInteractionReplyOptions): Promise<InteractionResponse<boolean> | undefined>;
    }
}

ChatInputCommandInteraction.prototype.error = async function (description: string, image?: string) {
    const embed = new EmbedBuilder()
        .setDescription(description)
        .setColor(colors.warning as ColorResolvable)
        .setThumbnail(assets.icons.error);

    if (image) {
        if (fs.existsSync(image)) {
            const attachment = new AttachmentBuilder(image, path.basename(image) as AttachmentData);
            embed.setImage(`attachment://${path.basename(image)}`);
        } else {
            embed.setImage(image);
        }
    }

    const payload = {
        content: "",
        embeds: [embed],
        components: [],
        allowedMentions: { repliedUser: false },
        ephemeral: true
    };

    if (this.replied) {
        this.fetchReply().then(m => {
            if (m.content) payload["content"] = "\u200b";
        });
        this.editReply(payload).catch(err => err);
    } else {
        return this.reply(payload).catch(err => err);
    }
};


ChatInputCommandInteraction.prototype.post = async function (content: string | EmbedBuilder, options?: ExtendedInteractionReplyOptions) {
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
            if (content.data.footer) {
                const { text } = content.data.footer;
                if (text) {
                    page.setFooter({
                        ...content.data.footer,
                        text: `『 Page ${index + 1}/${content.pages.length} 』${text}`
                    });
                }
            } else {
                page.setFooter({ text: `『 Page ${index + 1}/${content.pages.length} 』` });
            }

            Object.keys(content.data).forEach(key => {
                if (typeof key !== 'string' || key === 'pages') return;
                if (!page.data[key as keyof APIEmbed]) (page.data[key as keyof APIEmbed] as APIEmbed[keyof APIEmbed]) = content.data![key as keyof APIEmbed];
                if (key === 'author' && content.data[key] && content.data[key]!.icon_url && !page.data[key]!.icon_url) page.data[key]!.icon_url = content.data[key]!.icon_url;
                if (key === 'fields') page.data[key]!.unshift(...content.data[key]!);
            });

            return page;
        });

        const sending = pages.map(page => ({
            content: "",
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

        const msg = await this.reply(sending[page! - 1] as ExtendedInteractionReplyOptions);

        if (sending.length === 1) return;

        const collector = msg.createMessageComponentCollector({
            filter: (interaction: Interaction) => interaction.user.id === this.user.id,
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

            sending[page! - 1].content = sending[page! - 1].content || "\u200b";
            this.editReply(sending[page! - 1] as BaseMessageOptions);
        });

        collector.on("end", _ => {
            sending[page! - 1].components = [];
            this.editReply(sending[page! - 1] as BaseMessageOptions);
        });
    }
};


interface ExtendedInteractionReplyOptions extends InteractionReplyOptions {
    page?: number;
    pages?: EmbedBuilder[];
    time?: number;
}