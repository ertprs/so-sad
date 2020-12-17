const { create, Client } = require('@open-wa/wa-automate');

function start(client) {
  client.onMessage(async message => {
    await sleep(60000);
    if (message.body === 'Hi') {
      await client.sendText(message.from, 'Hello!');
    }
  });
}

create().then(start);
