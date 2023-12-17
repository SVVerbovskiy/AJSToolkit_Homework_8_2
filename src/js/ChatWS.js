/* eslint-disable no-console */

/*
*  Класс отвечает за работу WebSocket
*  отправляет и принимает сообщения
*/
export default class ChatWS {
  constructor(domainUrl) {
    this.ws = ''; /* переменная для WebSocket */
    this.url = `wss://${domainUrl}`; /* url для соединения WebSocket */
    this.messageListeners = []; /* массив для  callback-а метода onLoadMessage */
  }

  /*
    *  инициализация класса
    *  создаёт соединение WebSocket
    *  начинает прослушивать события openб close и error
    *  обрабатывает события message с помощью метода onLoadMessage
    */
  init(username) {
    this.ws = new WebSocket(`${this.url}/ws?login=${username}`);

    this.ws.addEventListener('open', (e) => {
      console.log(e);
      console.log('ws open');
    });

    this.ws.addEventListener('close', (e) => {
      console.log(e);
      console.log('ws close');
    });

    this.ws.addEventListener('error', (e) => {
      console.log(e);
      console.log('ws error');
    });

    this.ws.addEventListener('message', (event) => this.onLoadMessage(event));
  }

  /* callback метода onLoadMessage для автоматического вызова в классе ChatControl */
  addMessageListeners(callback) { this.messageListeners.push(callback); }

  /*
    *  вызывается при получении сообщения(message) от WS
    *  получает объект chat с массивом сообщений.
    *  отправляет каждое сообщение из массива
    *  в метод onLoadMessage класса ChatControl
    */
  onLoadMessage(e) {
    const data = JSON.parse(e.data);
    const { chat: messages } = data;

    messages.forEach((message) => {
      this.messageListeners.forEach((o) => o.call(null, message));
    });
  }
}
