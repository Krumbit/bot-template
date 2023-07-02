# TypeScript Discord Bot Template
![discord.js](https://img.shields.io/github/package-json/dependency-version/Krumbit/bot-template/discord.js)
![License](https://img.shields.io/badge/license-MIT-blue)

This fork is a TypeScript rewrite of imconnorngl's [JavaScript bot template](https://github.com/imconnorngl/bot-template).

## Getting Started
### Requirements
* `git` command line ([Windows](https://git-scm.com/download/win) | [Linux](https://git-scm.com/download/linux) | [MacOS](https://git-scm.com/download/mac)) installed.
* `node` [Version 16.9.x](https://nodejs.org) or higher.
* `pnpm` [package manager](https://pnpm.io/installation) installed.

### Create your bot
* Go to the [Discord Application Page](https://discord.com/developers/applications).
* Create a **New Application**.
* Click **Bot**, **Add Bot**, then click **Yes, do it**.
* Visit `https://discord.com/oauth2/authorize?client_id=APP_ID&permissions=8&scope=bot%20applications.commands`, replacing **APP_ID** with the **Application ID** from the app page, to add the bot to your server.
* Copy your bot's **Token** and keep it for later.

### Intents
* Visit the same bot page where you got your token from.
* Under **Privileged Gateway Intents**, enable **Presence Intent**, **Server Members Intent**, and **Message Content Intent**.
* Click **Save Changes** at the bottom.

### Setup
* Create a local folder to store your bot's source code in.
* Run `git clone https://github.com/Krumbit/bot-template.git .` in the folder directory.
* Run `pnpm install` to install all required packages.
* Rename the `.env.example` file to `.env` and paste your bot's token after the equals sign.
* Read [the next section](#run-scripts) for information on how to run the bot

### Running
#### TypeScript
> These scripts use the `ts-node` CLI to run the TypeScript version of the bot, without transpiling to JavaScript. Use these only during development, as they are not as preformant as the transpiled JavaScript version.
* `pnpm run dev`
  * Runs the bot once
* `pnpm run dev:watch`
  * Uses `nodemon` to automatically restart the bot after any file changes
  
 #### JavaScript
 > These scrips manage the transpiled JavaScript version of the bot, ideally, in a production environment. These are more optimized and less resource intensive than the `ts-node` counterpart.
 * `pnpm run build`
    * Deletes the `dist/` directory (if exists) and transpiles the TypeScript project to JavaScript
* `pnpm run start`
    * Starts the JavaScript version of the bot from the `dist/` directory
    *  **Requires `pnpm run build` to be ran previously**
* `pnpm run build:start`
    * Combination of the previous two scripts - transpiles to JavaScript and starts the dist bot automatically

## Notes (important)
* When changing types or adding new items to the config JSON files, update the interfaces in the [`src/utils/types`](./src/utils//types/) directory. You can use an [interface generator](https://transform.tools/json-to-typescript) to simplify the process.
* When updating command categories, be sure to update the `Category` enum in [`src/utils/structures/CommandHandler.ts`](./src/utils/structures/CommandHandler.ts) as well. The value of the enum is the display name in the command help embeds.