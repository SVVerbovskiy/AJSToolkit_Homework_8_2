export default class chatDOM {
  constructor() {
    this.container = null; // for container
    this.onLoginListeners = []; /* массив для  callback-а функции onLogin */
    this.getMessageListeners = []; /* массив для  callback-а функции onSendMessage */
  }

  // присваиваем классу контейнер
  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  // проверка на наличие контейнера
  checkBinding() {
    if (this.container === null) {
      throw new Error('ListEditPlay not bind to DOM');
    }
  }

  // отрисовка HTML
  drawUI() {
    this.checkBinding();

    this.container.innerHTML = `
        <header class="header">
          <p>Домашнее задание к занятию "8. EventSource, Websockets"</p>
          <p>Чат</p>
        </header>
        <div class="container">
          <div class="chat"></div>
          <div class="users"></div>
          <div class="chat-control">
            <input class="chat-message"/>
            <button class="chat-send">Отправить</button>
          </div>
        </div>
        <div class="popup">
          <div class="loading">Backend Loading...</div>
          <form class="popup-container close">
            <div class="popup-header">Выберите псевдоним</div>
            <input name="name" type="text" class="popup-login"/>
            <button class="popup-button">Продолжить</button>
          </form>
        </div>
      `;

    this.chat = this.container.querySelector('.chat');
    this.users = this.container.querySelector('.users');
    this.chatMessage = this.container.querySelector('.chat-message');
    this.chatSend = this.container.querySelector('.chat-send');
    this.popUp = this.container.querySelector('.popup');
    this.popUpSubmit = this.container.querySelector('.popup-container');
    this.loading = this.container.querySelector('.loading');
    this.popUpLogin = this.container.querySelector('.popup-login');

    this.popUpSubmit.addEventListener('submit', (event) => this.onLogin(event));
    this.chatSend.addEventListener('click', (event) => this.onSendMessage(event));
    this.popUpLogin.addEventListener('focus', () => this.onFocusClear('popUpLogin'));
  }

  /* callback метода onLogin для автоматического вызова в классе ChatControl */
  addOnLoginListeners(callback) { this.onLoginListeners.push(callback); }

  /*
    *  метод для авторизации
    *  передаёт значение введёного логина
    *  в метод onLogin класса ChatControl
    */
  onLogin(e) {
    e.preventDefault();
    const login = this.popUpLogin.value;
    this.popUpLogin.value = '';

    this.onLoginListeners.forEach((o) => o.call(null, login));
  }

  /* callback метода onSendMessage для автоматического вызова в классе ChatControl */
  addGetMessageListeners(callback) { this.getMessageListeners.push(callback); }

  /*
    *  метод для отправки сообщения
    *  передаёт введённое сообщение
    *  в метод onSendMessage класса ChatControl
    */
  onSendMessage(e) {
    e.preventDefault();

    const message = String(this.chatMessage.value);
    if (!message) { return; }
    this.chatMessage.value = '';

    this.getMessageListeners.forEach((o) => o.call(null, message));
  }

  /*
    *  метод для отрисовки сообщения
    *  получает объект сообщения с name, text, date, class
    *  вставляет сообщение в чат и прокручивает его вниз
    */
  loadMessage(message) {
    const {
      name,
      text,
      date,
      classEl,
    } = message;

    const messageEl = document.createElement('div');
    messageEl.classList.add('message-container');
    messageEl.classList.add(classEl);
    messageEl.innerHTML = `
        <div class="message">
          <div class="message-author">${name}, ${date}</div>
          <div class="message-text">${text}</div>
        </div>
      `;
    this.chat.appendChild(messageEl);
    this.chat.scrollTo(0, 9999);
  }

  /*
    *  метод для закрытия попапа
    */
  popupClose() {
    this.popUp.classList.add('close');
  }

  /*
    *  метод для вывода сообщения в placeholder внутри input
    *  используется для вывода ошибки
    *  принимает имя переменной и текст
    */
  message(input, text) {
    this[input].placeholder = text;
  }

  /*
    *  метод для удаления текста ошибки и класса ошибки у инпута
    *  срабатывает автоматически при фокусировке инпута
    */
  onFocusClear(input) {
    this.message(input, '');
    this[input].classList.remove('error-add');
  }

  /*
    *  метод добавляет текст ошибки и класс ошибки инпута
    */
  errorInputAdd(input, text) {
    this[input].value = '';
    this.message(input, text);
    this[input].classList.add('error-add');
  }

  /*
    *  метод для отрисовки участников чата
    */
  loadUser(users, login) {
    this.users.innerHTML = ''; /* изанчально очищается список участников */

    /* обход по массиву списка участников */
    for (let i = 0; i < users.length; i += 1) {
      const userEl = document.createElement('div');
      userEl.classList.add('user');

      /* заменя имени участника на You, если участник это ВЫ */
      if (users[i] === login) {
        userEl.textContent = 'You';
      }

      /* если участник не ВЫ, то используется имя участника */
      if (users[i] !== login) {
        userEl.textContent = users[i];
      }

      this.users.appendChild(userEl);
    }
  }

  /*
    *  метод для удаления плашки загрузки и отображения попапа авторизации
    *  запускается когда есть положительный ответ от сервера
    */
  backendLoaded() {
    this.loading.classList.add('close');
    this.popUpSubmit.classList.remove('close');
  }
}
