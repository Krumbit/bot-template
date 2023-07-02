import { Client, Interaction, InteractionType, SlashCommandBuilder } from "discord.js";

export default class {
    name: string;
    type: InteractionType;
    description: string;
    data: SlashCommandBuilder;

    constructor(options: IOptions) {
        this.name = options.name.toLowerCase();
        this.type = options.type;
        this.description = options.description;

        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description);

        this.data = this.build(builder);
    }

    build(builder: SlashCommandBuilder) {
        return builder;
    }

    async run(client: Client, interaction: Interaction): Promise<any> {

    }
}

interface IOptions {
    name: string;
    type: InteractionType;
    description: string;
}