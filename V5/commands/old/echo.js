module.exports = {
    name: "echo",
    description: "[Perms required] Deletes the message sent by the user and sends that message from the bot",
    execute(msg) {
        var { isAuth } = require("../../index.js");
        userAuth = isAuth(msg);
        try{
            let args = msg.content.split(" ");
            args.shift();
            let msgReply = args.join(" ");; 
            msg.delete();
            msg.channel.send(msgReply);
            console.log(`[ECHO REQUEST] {${msg.author.username}}: ${msg.content}`);
        } catch(error) {
            console.error(error);
            console.log(`[ECHO] -  !!ERROR!! \n {${msg.author.username}}: ${msg.content} \n ^ ${msg.guild.name} -> ${msg.channel.name} ^ \n ${msg.url}`);
        };
    }, 
}