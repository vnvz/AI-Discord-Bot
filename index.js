require("dotenv/config"); // adicionando requerimento das variáveis de ambiente

const { Configuration, OpenAIApi } = require("openai");
const { Client, IntentsBitField } = require("discord.js");
// importando as apis de discord.js e openai

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => {
  console.log("bot está online");
}); //checagem que o bot está online

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

// método abaixo define como a AI responderá mensagens, quem ela é e como pegar o contexto de mensagens anteriores 
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== process.env.CHANNEL_ID);
  if (message.content.startsWith("!")) return;

  let conversationLog = [
    {
      role: "system",
      content:
        "Você é um chatbot feito para simular a personalidade de Tohru Adachi do jogo Persona 4 Golden. Seja bastante sarcástico com o que você fala.",
    },
  ];

  await message.channel.sendTyping();

  let prevMessages = await message.channel.messages.fetch({ limit: 15 });
  prevMessages.reverse();

  prevMessages.forEach((msg) => {
    if (message.content.startsWith("!")) return;
    if (msg.author.id !== client.user.id && message.author.bot) return;
    if (msg.author.id !== message.author.id) return;

    conversationLog.push({
      role: "user",
      contet: msg.content,
    });
  });

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  });

  message.reply(result.data.choices[0].message);
});

client.login(process.env.TOKEN); // fazer o bot ficar online de vez
