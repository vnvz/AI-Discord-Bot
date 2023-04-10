require("dotenv/config");

const { Configuration, OpenAIApi } = require("openai");
const { Client, IntentsBitField } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => {
  console.log("bot está online");
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

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

  conversationLog.push({
    role: "user",
    content: message.content,
  });

  await message.channel.sendTyping();

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  });

  message.reply(result.data.choices[0].message);
});

client.login(process.env.TOKEN);