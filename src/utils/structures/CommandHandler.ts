import { Client, Message } from "discord.js";

// Add new Category and change display names here
export enum Category {
    developer = "Developer",
    misc = "Miscellaneous",
    info = "Information"
}

export default class {
    name: string;
    description?: string;
    aliases?: string[];
    devOnly?: boolean;
    usage?: string;
    example?: string;
    category?: keyof typeof Category;
    channels?: ChannelsOptions;
    access?: string[];

    constructor(options: CommandOptions) {
        const { name, ...rest } = options;

        this.name = name.toLowerCase();

        Object.assign(this, {
            description: "",
            aliases: undefined,
            devOnly: false,
            usage: "",
            example: "",
            category: Category.misc,
            channels: {
                blacklist: []
            },
            access: [],
            ...rest
        });

        Object.assign(this, options);

        this.aliases = this.aliases?.map(c => c.toLowerCase());
    }

    async run(client: Client<true>, message: Message<true>, args: string[]): Promise<any> {

    }
}

interface CommandOptions {
    name: string;
    description?: string;
    aliases?: string[];
    devOnly?: boolean;
    usage?: string;
    example?: string;
    category?: Category;
    channels?: ChannelsOptions;
    access?: string[];
}

interface ChannelsOptions {
    blacklist?: string[];
    whitelist?: string[];
}