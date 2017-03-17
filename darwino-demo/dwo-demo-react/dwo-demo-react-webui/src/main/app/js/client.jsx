import React from "react";
import ReactDOM from "react-dom";

import Container from "./Container.jsx";

import 'babel-polyfill';
import 'jquery';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const app = document.getElementById('app');
ReactDOM.render(<Container></Container>, app);