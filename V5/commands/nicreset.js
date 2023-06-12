const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
  .setName("nicreset")
  .setDescription("Resets the target's nicname"),
  execute(msg) {
    if (isAuth) {
    const target = msg.mentions.users.first() || msg.author;
    const memberID = msg.guild.members.cache.get(target.id);
    var memberName = memberID.nickname;
    if (!memberName) {
      memberName = target.username;
    }

    if (!memberID) return msg.reply('Please specify a member!');
    memberID.setNickname(null)
    .then(() => {
      msg.reply(`Display name of "${memberName}" successfully reset`);
      console.log(`[NIC-RESET] "${memberName}" reset`);
    })
    .catch(error => {
      msg.reply(`${msg.author.toString()} Rogue was not able to reset ${memberName}'s nickname, due to Rogue's role/permissions being insufficient.`);
      console.error;
    });

  } else {
    msg.reply('You are not authorised to perform that command!');
  }
},
}