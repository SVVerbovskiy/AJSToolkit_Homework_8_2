/* eslint-disable no-console */
export default class ChatControl {
  constructor(chatDOM, chatWS, chatAPI) {
    this.chatDOM = chatDOM; /* класс который управляет DOM */
    this.chatWS = chatWS; /* класс который управляет WS */
    this.chatAPI = chatAPI; /* класс который управляет API */
    this.login = ''; /* переменная для логина */
  }

  /*
    *  инициализация класса
    *  отрисовывает DOM
    *  прослушивает callback-и методов из других классов
    *  и проверяет заботоспособность сервера
    */
  init() {
    this.chatDOM.drawUI();

    this.chatDOM.addOnLoginListeners(this.onLogin.bind(this));
    this.chatDOM.addGetMessageListeners(this.onSendMessage.bind(this));
    this.chatWS.addMessageListeners(this.onLoadMessage.bind(this));

    this.backendLoading();
  }

  /*
    *  метод для авторизации
    *  вызывается автоматически из класса chatDOM
    *  проверяет свободен ли логин и авторизовывает или нет
    */
  async onLogin(login) {
    /* если длина имени 0, то просит ввести имя */
    if (login.length === 0) {
      this.chatDOM.errorInputAdd('popUpLogin', 'Введите имя');
      return;
    }

    /* если длина имени меньше трёх, то пишет короткое имя */
    if (login.length < 3) {
      this.chatDOM.errorInputAdd('popUpLogin', 'Короткое имя');
      return;
    }

    /* посылает API запрос на авторизацию и записывает результат в result */
    const result = await this.chatAPI.logining({ login });

    /*
      *  если результат есть и статус истина,
      *  то инициализирует WebSocket соединение
      *  сохраняет логин в переменную
      */
    if (result && result.status === true) {
      this.chatWS.init(login);
      this.chatDOM.popupClose();
      this.login = login;
    }

    /*
      *  если результат есть и статус ложь,
      *  то выводит ошибку, что это имя уже используется
      */
    if (result && result.status === false) {
      console.log(result);
      this.chatDOM.errorInputAdd('popUpLogin', 'Это имя уже есть в чате');
    }
  }

  /*
    *  метод отправляет сообщение в WebSocket с типом message
    *  вызывается при клике по кнопке
    */
  onSendMessage(message) {
    const newMessage = JSON.stringify({ message, type: 'message' });
    this.chatWS.ws.send(newMessage);
  }

  /*
    *  метод отрисовывает сообщение в DOM
    *  вызывается при получении сообщения от WebSocket
    */
  onLoadMessage(message) {
    const messageEdit = message;

    /*
      *  Если тип сообщения message,
      *  то сообщение загружается в чат
      */
    if (message.type === 'message') {
      /*
        *  если имя автора совпадает с именем пользователя,
        *  то в сообщение вместо имени отрисовывается You
        *  и сообщение отображается справа
        */
      if (message.name === this.login) {
        messageEdit.classEl = 'message-right';
        messageEdit.name = 'You';
        this.chatDOM.loadMessage(messageEdit);
        return true;
      }

      /*
        *  если имя автора НЕ совпадает с именем пользователя,
        *  то в сообщение отрисовывается имя автора сообщения
        *  и сообщение отображается слева
        */
      if (message.name !== this.login) {
        messageEdit.classEl = 'message-left';
        this.chatDOM.loadMessage(messageEdit);
        return true;
      }
      return true;
    }

    /*
      *  Если тип сообщения user,
      *  то список участинков чата обновляется
      */
    if (message.type === 'user') {
      this.chatDOM.loadUser(message.names, this.login);
      return true;
    }

    return false;
  }

  async backendLoading() {
    /* посылает API запрос на сервер и записывает результат в result */
    const result = await this.chatAPI.checkServer();

    if (result && result.status === true) {
      this.chatDOM.backendLoaded();
    }
  }
}
