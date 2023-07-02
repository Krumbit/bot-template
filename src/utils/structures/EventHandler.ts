import { Events } from "discord.js";

export default class {
    event: Events;
    constructor(options: IEventOptions) {
        this.event = options.event;
    }

    onEvent(...args: any[]): void | Promise<any> {
        return console.log("Not implemented.");
    }
}

interface IEventOptions {
    event: Events;
}