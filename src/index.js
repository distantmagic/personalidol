// @flow

import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/promise';
import 'core-js/es6/object';

import React from 'react';
import ReactDOM from 'react-dom';

import Main from './components/Main';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.render(<Main />, rootElement);
}
