import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import render from './render.js';
import textResourses from './textResourses.js';

const app = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init(textResourses).then((t) => {
    // M(state)
    const state = {
      isValid: '',
      errorOrSuccessReport: '',
      urls: [],
    };
    const elements = {
      form: document.querySelector('.rss-form'),
      feedback: document.querySelector('.feedback'),
      urlInput: document.querySelector('#url-input'),
    };

    // V(render on-change)
    const watchedState = onChange(state, (path, value) => {
      switch (path) {
        case 'isValid':
          render(watchedState, elements, value, t);
          break;
        default:
          break;
      }
    });

    // Controller (события ---> state);
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const inputValueUrl = data.get('url');

      const schema = yup.object().shape({
        inputValueUrl: yup
          .string()
          .required()
          .url('notValidError')
          .notOneOf(watchedState.urls, 'alreadyExistsError'),
      });

      schema
        .validate({ inputValueUrl })
        .then((value) => {
          // if here will be 'push' -> onClick will not see changes...
          watchedState.urls = [...watchedState.urls, value.inputValueUrl];
          watchedState.errorOrSuccessReport = 'sucсess';
          watchedState.isValid = true;
        })
        .catch((err) => {
          watchedState.errorOrSuccessReport = err.message;
          watchedState.isValid = false;
        });
    });
  });
};

export default app;
