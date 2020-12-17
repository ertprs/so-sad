const { create, Client } = require('@open-wa/wa-automate');

// or
// import { create, Client } from '@open-wa/wa-automate';


function start(client) {
  client.onMessage(async message => {
    if (message.body === 'Hi') {
      await client.sendText(message.from, '👋 Hello!');
    }
  });
}

create().then(start);
