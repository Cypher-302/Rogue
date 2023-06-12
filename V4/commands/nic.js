module.exports = {
  name: "nic",
  description: "Changes the target's nickname based on user input",
  execute(msg) {
    if (isAuth) {
      let args = msg.content.split(" ");
      const target = msg.mentions.users.first() || msg.author;
      const memberID = msg.guild.members.cache.get(target.id);
      var memberName = memberID.nickname || target.username;
      args.shift(); args.shift();
      nickname = args.join(" ");

      if (!memberID) return msg.reply('Please specify a member!')
      if (!nickname) return msg.reply('Please specify a nickname!')
      if (nickname.length > 32) return msg.reply('Please enter a nickname that is < 32 characters!')         
          
        memberID.setNickname(nickname)
        .then(() => {
          msg.reply(`Display name of "${memberName}" successfully changed to: "${nickname}"`)
        })
        .catch(error => {
          msg.reply(`${msg.author.toString()} Rouge was not able to change ${memberName}'s display name, due to Rouge's role/permissions being insufficient.`);
          console.error;
        });
            
  } else if (msg.content.startsWith('!nic') && !isAuth) {
    msg.reply('You are not authorised to perform that command!')
    }
  },
}