export default class ChatAPI {
  constructor(domainUrl) {
    this.baseURL = `https://${domainUrl}`; /* url для связи с API */
  }

  /* опции для запроса */
  static options(method, urlParam, body) {
    const value = {
      method,
      body: JSON.stringify(body),
      urlParam,
    };

    return value;
  }

  /* создание апи запроса */
  async createRequest(options) {
    const { method, urlParam, body } = options;

    const newUrl = `${this.baseURL}/${urlParam}`;

    const response = await fetch(newUrl, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body,
    });

    const result = await response.json();

    if (!result) { return false; }

    return result;
  }

  /*
    *  метод отправляет POST API запрос
    *  с параметром в строке method равному logining
    *  передаёт тело в котором логин
    */
  async logining(body) {
    // опции для запроса и запрос на сервер
    const options = this.constructor.options('POST', '?method=logining', body);
    const response = await this.createRequest(options);

    return response;
  }

  /*
    *  метод отправляет GET API запрос
    *  без параметров и без тела
    */
  async checkServer() {
    // опции для запроса и запрос на сервер
    const options = this.constructor.options('GET', '');
    const response = await this.createRequest(options);

    return response;
  }
}
