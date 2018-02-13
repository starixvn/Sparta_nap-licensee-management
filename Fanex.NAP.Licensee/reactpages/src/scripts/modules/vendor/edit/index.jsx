import React from 'react'
import ReactDOM from 'react-dom';
import EditForm from './EditForm'
import { Provider } from 'react-redux'
import reducer from './reducer'
import Store from '../../../lib/store'

const defaultState = Object.assign({}, window.initialState);
const store = Store.createStore(reducer, defaultState);

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <EditForm />
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app-container"));