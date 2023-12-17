/* eslint-disable no-console */
import ChatDOM from './ChatDOM';
import ChatControl from './ChatControl';
import ChatWS from './ChatWS';
import ChatAPI from './ChatAPI';

/* домен сервера */
const domainUrl = 'ajstoolkit-homework-8-1.onrender.com';
// const domainUrl = 'localhost:7070';

/* элемент блока div в DOM */
const hw = document.querySelector('#hw');

/*
*  создание класса отвечающего за DOM
*  и присвоение ему div элемента
*/
const chatDOM = new ChatDOM();
chatDOM.bindToDOM(hw);

/*
*  создание классов отвечающих за вебсокет и за API
*/
const chatWS = new ChatWS(domainUrl);
const chatAPI = new ChatAPI(domainUrl);

/*
* создание класса отвечающего за контрольт и инициализация класса
*/
const chatControl = new ChatControl(chatDOM, chatWS, chatAPI);
chatControl.init();

console.log('app started');
