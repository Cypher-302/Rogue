module.exports = {
    name: "refreshAmt",
    description: "Dynamically grabs the amt of msgs from the command, then refreshes that amt of messages",
     async execute(msg) {

        var { msgHandler } = require("../index.js");
        let args = msg.content.split(" ");
        args.shift()
        let msgAmt = args[0];

        console.log(`[REFRESH AMT] - (${msgAmt} msgs): [${msg.author.username}] `);
        await msg.channel.messages.fetch({limit: ++msgAmt}).then(messages => {
            messages.reverse();
            try {

                messages.forEach(element => {
                    if (element.content.includes("!ref")) {
                        return;
                    }
                    msgHandler(element);
                });

            } catch(error) {
                console.error(error);
                console.log(`[REFRESH AMT] -  !!ERROR!! \n {${msg.author.username}}: ${msg.content} \n ^ ${msg.guild.name} -> ${msg.channel.name} ^ \n ${msg.url}`);
            };
        });
    }, 
}