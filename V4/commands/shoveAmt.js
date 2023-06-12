module.exports = {
    name: "shoveAmt",
    description: "Dynamically grabs the [specified] amt of msgs from the chat and 'shoves' them into the specified channel",
     async execute(msg) {

        const {client} = require("../index.js");

        let args = msg.content.split(" ");
        args.shift()
        let msgAmt = args[0];

        console.log(`[SHOVE AMT] - (${msgAmt} msgs): [${msg.author.username}] `);
        await msg.channel.messages.fetch({limit: ++msgAmt}).then(messages => {
            messages.reverse();
            try {

                messages.forEach(element => {
                    if (element.content.includes("!shove")) {
                        return;
                    }
                    let {content} = element;
                    client.channels.cache.get('1084070542082064414').send(content);
                });
                msg.reply('[SHOVE AMT] successful');

            } catch(error) {
                console.error(error);
                console.log(`[SHOVE] - (MULTIPLE) !!ERROR!! \n {${msg.author.username}}: ${msg.content} \n ^ ${msg.guild.name} -> ${msg.channel.name} ^ \n ${msg.url}`);
            };
        });
    }, 
}