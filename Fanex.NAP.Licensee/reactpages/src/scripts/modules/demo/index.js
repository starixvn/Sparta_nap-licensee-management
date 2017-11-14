import React from 'react';
import ReactDOM from 'react-dom';

const div = document.createElement('dev');

document.body.appendChild(div);
ReactDOM.render((<h1 className="welcome">Helloworld</h1>), div);