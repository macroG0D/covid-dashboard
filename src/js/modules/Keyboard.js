import Search from './Search';
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
export default class Keyboard {
  constructor() {
    this.value = '';
  }

  elements = {
    main: null,
    keysContainer: null,
    keys: [],
  }

  eventHandlers = {
    oninput: null,
    onclose: null,
  }

  properties = {
    value: '',
    capsLock: false,
  }

  init() {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    // Setup main elements
    this.elements.main.classList.add('keyboard', 'keyboardHidden');
    this.elements.main.id = 'keyboard';
    this.elements.keysContainer.classList.add('keyboardKeys');
    this.elements.keysContainer.appendChild(this.createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboardKey');

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    const searchInput = document.querySelector('.searchBar');
    this.value = searchInput.value;
    // Automatically use keyboard for elements with .use-keyboard-input
    const keyboardButton = document.querySelector('.keyboardTrigger');
    keyboardButton.addEventListener('click', () => {
      this.open(this.value, (currentValue) => {
        this.value = currentValue;
        searchInput.value = currentValue;
        Search.livesearch();
      });
    });

    searchInput.addEventListener('change', () => {
      this.value = searchInput.value;
    });

    // onclose event handler
    document.addEventListener('click', (e) => {
      if (!e.target.classList.contains('keyboardKeys') && !e.target.classList.contains('keyboardKey')
      && !e.target.classList.contains('keyboardTrigger')
      && !e.target.classList.contains('material-icons')) {
        // add class keyboardHidden to elements with class keyboard
        document.getElementById('keyboard').classList.add('keyboardHidden');
      }
    });
  }

  createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'backspace',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
      'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm',
      'space',
    ];

    // Creates HTML for an icon
    const createIconHTML = (iconName) => `<i class="material-icons">${iconName}</i>`;

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', 'l', 'm'].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboardKey');

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboardKeyWide');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this.triggerEvent('oninput');
          });

          break;

        case 'space':
          keyElement.classList.add('keyboardKeyExtraWide');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            this.properties.value += ' ';
            this.triggerEvent('oninput');
          });

          break;

        case 'done':
          keyElement.classList.add('keyboardKeyWide', 'keyboardKeyDark');
          keyElement.innerHTML = createIconHTML('check_circle');

          keyElement.addEventListener('click', () => {
            this.close();
            this.triggerEvent('oninput');
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            this.properties.value += this.properties.capsLock ? key.toLocaleUpperCase() : key.toLowerCase();
            this.triggerEvent('oninput');
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  }

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  }

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboardHidden');
  }

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboardHidden');
  }
}
