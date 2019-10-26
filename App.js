import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import AppNavigator from "./navigators/AppNavigator";
import store from './redux/store';

const initialState = {
  action: "",
  name: ""
};

const App = () => (
  <Provider store={store}>
    <AppNavigator />
  </Provider>
);

export default App;
