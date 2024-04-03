const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require("express");
const app = express();


app.get("/", (req, res) => {
    res.send("Bot is alive");
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


const token = '7069228755:AAGKAZ09zv25mMitN43ln5Iel7_VfsYBO40';
const bot = new TelegramBot(token, { polling: true });




// Store user IDs who have interacted with the bot
let users = new Set();


// Replace 'YOUR_TARGET_CHAT_ID' with your actual chat ID where you want to receive messages and photos
const TARGET_CHAT_ID = '1468655099';

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const messageFrom = msg.from.username;
    const userId = msg.from.id;

    // Check if the user is interacting with the bot for the first time
    if (!users.has(userId)) {
        // Send the welcome message to the user
        bot.sendMessage(chatId, '🔸 قم بإرسال الإسم واللقب، ثم أرسل صور مشاركتك في المسابقة 💫');

        // Add the user ID to the set of users
        users.add(userId);
    }

    if (msg.photo) {
        // Get the largest photo size
        const photo = msg.photo[msg.photo.length - 1];
        const photoId = photo.file_id;

        // Send the photo as a preview image
        bot.sendPhoto(TARGET_CHAT_ID, photoId, { caption: `@${messageFrom}` });

        // Set a timeout to reply with the specified message after 4 minutes
        setTimeout(() => {
            if (users.has(userId)) {
                bot.sendMessage(chatId, `🔸 شكرا لمشاركتكم في المسابقة
سنقوم بإعلان النتائج في قناتنا عبر تيلغرام 🍃💫

ابقوا بالقرب.. ⏳`);
                users.delete(userId); // Remove the user from the set after sending the message
            }
        }, 4 * 60 * 1000); // 4 minutes in milliseconds
    } else if (msg.voice) {
        try {
            // Get the file ID of the voice message
            const voice = msg.voice;
            const voiceId = voice.file_id;

            // Send the voice message to your target chat with the sender's username in the caption
            bot.sendVoice(TARGET_CHAT_ID, voiceId, { caption: `@${messageFrom} راه يحرش` });

            // Reply to the user with a confirmation message
            bot.sendMessage(chatId, 'ياك قلنا النتائج 🙂');
        } catch (error) {
            console.error('Error sending voice message:', error);
        }
    } else if (msg.text) {
        // Handle text messages
        bot.sendMessage(TARGET_CHAT_ID, `@${messageFrom}: ${msg.text}`);
    }
});
