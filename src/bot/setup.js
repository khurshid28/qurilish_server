const TelegramBot = require('node-telegram-bot-api');

const path = require('path');
const fs = require('fs');
const token = process.env.BOT_TOKEN; // O'zingizning API tokeningizni qo'ying
const bot = new TelegramBot(token, { polling: true });

// Admin Telegram ID sini o'rnating
const adminId = 789670134; // Bu yerni o'zgartiring

// Videolar va ularning kodlarini saqlash uchun ob'ekt
const videoFilePath = path.join(__dirname, "videos.json");

// Bot /start komandasi bilan salomlashadi
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Admin uchun maxsus xabar
  if (chatId === adminId) {
    bot.sendMessage(chatId, 'Salom, Admin! Video yuklab, sarlavha sifatida kodni kiriting.');
    return;
  }

  // Foydalanuvchiga obuna bo'lishini so'rov
  bot.sendMessage(chatId, '✅Kanallarga obuna bo\'lishingiz kerak 🌍', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Kanal 1 ⬅️', url: 'https://t.me/Kinolarkanali21' },
        ],
        [
          { text: 'Kanal 2 ⬅️', url: 'https://t.me/khabibullaevdilmurod' },
        ],
        [
          { text: 'Kanal 3 ⬅️', url: 'https://t.me/BMW1kanali' },
        ],
        [
          { text: 'Kanal 4 ⬅️', url: 'https://t.me/kontroluz' },
        ],
        [
          { text: 'Kanal 5 ⬅️', url: 'https://www.instagram.com/kinolarkanali21/' },
        ],
        [
          { text: 'Kanal 6 ⬅️', url: 'https://www.instagram.com/kontroluz/' },
        ],
        [
          { text: 'Obuna bo\'ldim ✅', callback_data: 'subscribed' }
        ]
      ]
    }
  });
});

// Kanalga obuna bo'lganligini tekshirish
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === 'subscribed') {
    try {
      const userStatus = await bot.getChatMember('@Kinolarkanali21', chatId);
      const userStatus2 = await bot.getChatMember('@khabibullaevdilmurod', chatId);
      const userStatus3 = await bot.getChatMember('@BMW1kanali', chatId);
      const userStatus4 = await bot.getChatMember('@kontroluz', chatId);
      // const userStatus5 = await bot.getChatMember('@YOUR_NEW_CHANNEL_1', chatId);
      // const userStatus6 = await bot.getChatMember('@YOUR_NEW_CHANNEL_2', chatId);

      if (userStatus.status === 'member' && userStatus2.status === 'member' &&
          userStatus3.status === 'member' && userStatus4.status === 'member') {
        bot.sendMessage(chatId, `✅Siz kanallarga obuna bo\'lgansiz. Endi kodni yuboring: 🔍`);
      } else {
        bot.sendMessage(chatId, '❌ Siz barcha kanallarga obuna bo\'lmadingiz. Iltimos, avval barcha kanallarga obuna bo\'ling. /start');
        // Qayta obuna bo'lish uchun kanallarni chiqarish
        bot.sendMessage(chatId, '❌ Kanallarga obuna bo\'lish uchun quyidagi tugmalardan foydalaning:👇👇👇👇', {
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Kanal 1 ⬅️', url: 'https://t.me/Kinolarkanali21' },
              ],
              [
                { text: 'Kanal 2 ⬅️', url: 'https://t.me/khabibullaevdilmurod' },
              ],
              [
                { text: 'Kanal 3 ⬅️', url: 'https://t.me/BMW1kanali' },
              ],
              [
                { text: 'Kanal 4 ⬅️', url: 'https://t.me/kontroluz' },
              ],
              [
                { text: 'Kanal 5 ⬅️', url: 'https://www.instagram.com/kinolarkanali21/' },
              ],
              [
                { text: 'Kanal 6 ⬅️', url: 'https://www.instagram.com/kontroluz/' },
              ],
              [
                { text: 'Obuna bo\'ldim ✅', callback_data: 'subscribed' }
              ]
            ]
          }
        });
      }
    } catch (error) {
      bot.sendMessage(chatId, 'Obuna holatini tekshirishda xato yuz berdi.');
    }
  }
});

// Admin video yuklaydi va kodni belgilaydi
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // Foydalanuvchi obuna bo'lgandan so'ng xabar yuborishi kerak
  if (chatId !== adminId) {
    const userStatus = await bot.getChatMember('@Kinolarkanali21', chatId);
    const userStatus2 = await bot.getChatMember('@khabibullaevdilmurod', chatId);
    const userStatus3 = await bot.getChatMember('@BMW1kanali', chatId);
    const userStatus4 = await bot.getChatMember('@kontroluz', chatId);
    // const userStatus5 = await bot.getChatMember('@YOUR_NEW_CHANNEL_1', chatId);
    // const userStatus6 = await bot.getChatMember('@YOUR_NEW_CHANNEL_2', chatId);

    if (userStatus.status !== 'member' || userStatus2.status !== 'member' ||
        userStatus3.status !== 'member' || userStatus4.status !== 'member') {
      bot.sendMessage(chatId, 'Siz barcha kanallarga obuna bo\'lmadingiz. Iltimos, avval barcha kanallarga obuna bo\'ling. /start');
      return;
    }
  }

  let content;
  try {
    content = JSON.parse(fs.readFileSync(videoFilePath, "utf8"));
  } catch (err) {
    console.error(err);
    return;
  }
  console.log(content);

  // Agar xabar admin tomonidan yuborilgan bo'lsa va u video bo'lsa
  if (chatId === adminId && msg.video) {
    const caption = msg.caption; // Kodni sarlavha sifatida qabul qilamiz
    if (caption) {
      let code = caption.split("||")[0];
      let desc = caption.split("||")[1];
      content[code] = {
        file_id: msg.video.file_id,
        desc
      };
      fs.writeFileSync(videoFilePath, JSON.stringify(content), err => {
        if (err) {
          console.error(err);
        }
      });
      bot.sendMessage(chatId, `Video saqlandi! Kod: ${code}`);
    } else {
      bot.sendMessage(chatId, 'Iltimos, videoni sarlavha (caption) bilan yuboring, unda kodni yozing.');
    }
  }

  // Foydalanuvchi tomonidan yuborilgan kodni tekshirish
  else if (msg.text && content[msg.text.trim()]) {
    bot.sendVideo(chatId, content[msg.text.trim()].file_id, {
      caption: "KOD : " + msg.text.trim() + "\n" + content[msg.text.trim()].desc
    });
  }
});
