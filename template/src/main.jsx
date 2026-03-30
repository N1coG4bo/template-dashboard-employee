import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './i18n';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <BrowserRouter basename="/demo/purple-react-free/template/preview">
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorker.unregister();
