const startingCounter = 5;
let counter = startingCounter;
let deleteAmt = 0;

const updateCounter = (msg) => {
    counter -= 1; //subtracts 1 from counter

    if (deleteAmt == 0) {
        msg.edit(`Deleting messages in: ${counter}`);
    } else {
        msg.edit(`Deleting ${deleteAmt-1} messages in: ${counter}`);
    }

    if (counter <= 0) {
        if (deleteAmt > 0) {
            msg.channel.bulkDelete(deleteAmt);  
            return;
        } else {
            counter = startingCounter;
        }
    }

    setTimeout(()=>{
        updateCounter(msg);
    }, 1000); //calls updateCounter every 1000 miliseconds
}

module.exports = {
    name: "deleteFrom",
    description: "[Limited to past 100 messages] Dynamically grabs the amt of msgs from the msg replied -> current msg and deletes them",
     async execute(msg) {
        try {
            if (msg.fetchReference() === null) {
                msg.reply('Replied message not found.');
                return;
            } else {
                temp = await msg.fetchReference();
            }
            repliedMessageId = temp.id;

            deleteAmt = 0;
            counter = startingCounter;
            const msgRef = await msg.reply(`Deleting messages in: ${counter}`);
            updateCounter(msgRef);

            await msg.channel.messages.fetch({limit: 100}).then(messages => {
                const repliedMessage = messages.get(repliedMessageId);
                

                const messagesAfterReplied = messages.filter(message => message.createdTimestamp >= repliedMessage.createdTimestamp);
                deleteAmt = messagesAfterReplied.size;
                console.log(`[DELETE FROM] {${msg.author.username}} (${deleteAmt})`);
            });
        } catch(error) {
            console.error(error);
            console.log(`[DELETE FROM] !!ERROR!! \n {${msg.author.username}}: ${msg.content} \n ^ ${msg.guild.name} -> ${msg.channel.name} ^ \n ${msg.url}`);
        };
    }, 
}