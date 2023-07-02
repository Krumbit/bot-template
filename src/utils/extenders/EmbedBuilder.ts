import { APIEmbedField, EmbedBuilder } from "discord.js";

import { handleValue } from '@utils/misc';

declare module 'discord.js' {
    //@ts-ignore
    interface EmbedBuilder {
        pages: EmbedBuilder[];
        addPage(page: EmbedBuilder): this;
        addPages(...pages: EmbedBuilder[]): this;
        addField(field: Field): this;
        addFields(...fields: Field[]): this;
    }
}

EmbedBuilder.prototype.addField = function (field: Field) {
    this.data.fields = this.data.fields || [];

    const options = {
        bullet: '\`•\`',
        bulletName: (n: string) => `**${n}**`,
        bulletValue: (n: string) => `\`${n}\``,
        markdown: false,
        inline: false,
        blank: false,
        ...field.options,
    };

    const inline = typeof field.inline === 'boolean' ? field.inline : options.inline;

    let value = handleValue(field.value, options);
    if (field.bullets) {
        value = field.bullets
            .filter(i => i)
            .map((bullet) => {
                const { name, value } = bullet;
                const bulletOptions = {
                    ...options,
                    ...bullet.options
                };

                if (bulletOptions.blank) return ``;
                if (bulletOptions.title) return `${bulletOptions.bulletName(name!)}`;
                return `${bulletOptions.bullet} ${bulletOptions.bulletName(name!)}: ${bulletOptions.bulletValue(handleValue(value, bulletOptions))}`;
            })
            .join('\n') || "\u200b";
    }

    if (field.list) {
        value = field.list
            .filter(i => i)
            .map(item => {
                const itemOptions = {
                    ...options
                };

                if (itemOptions.blank) return ``;
                return `${itemOptions.bullet} ${item}`;
            })
            .join('\n') || "\u200b";
    }

    const obj = {
        name: field.name || "\u200b",
        value,
        inline: typeof inline === "boolean" ? inline : true
    };

    const fields = this.data.fields ?? [];
    this.data.fields = [...fields, obj];

    return this;
};


EmbedBuilder.prototype.addFields = function (...fields: Field[]) {
    fields
        .filter(field => field)
        .forEach(field => this.addField(field));

    return this;
};

EmbedBuilder.prototype.addPage = function (page: EmbedBuilder) {
    this.pages = this.pages || [];
    this.pages.push(page);

    return this;
};


EmbedBuilder.prototype.addPages = function (...pages: EmbedBuilder[]) {
    this.pages = this.pages || [];
    pages.forEach(page => this.pages.push(page));

    return this;
};

interface Bullet {
    name?: string;
    value?: string;
    options?: {
        title?: boolean;
        blank?: boolean;
    };
}

interface Field extends Omit<APIEmbedField, 'value'> {
    value?: APIEmbedField['value'] | undefined;
    bullets?: Bullet[];
    list?: string[];
    options?: {
        inline?: boolean;
        markdown?: boolean,
        bullet?: Bullet,
    };
}