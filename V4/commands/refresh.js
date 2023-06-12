module.exports = {
    name: "refresh",
    description: "Re-runs the bot's code for this message (mostly used to re-run msgs that were sent while the bot was offline)",
    async execute(msg) {
        try{
            var { msgHandler } = require("../index.js");
            msg = await msg.fetchReference();
            console.log(`[REFRESH] - (REPLY): {${msg.author.username}}`);
            msgHandler(msg);

        } catch(error) {
            console.error(error);
            console.log(`[REFRESH] !!ERROR!! \n {${msg.author.username}}: ${msg.content} \n ^ ${msg.guild.name} -> ${msg.channel.name} ^ \n ${msg.url}`);
        };
    },
}