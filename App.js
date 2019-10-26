import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import AppNavigator from "./navigators/AppNavigator";
import store from './redux/store';

const initialState = {
  action: "",
  name: ""
};

// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     // define actions here e.g.,
//     // case "OPEN_MENU":
//     //   return { action: "openMenu" };
//     default:
//       return state;
//   }
// };

// const store = createStore(reducer);

const App = () => (
  <Provider store={store}>
    <AppNavigator />
  </Provider>
);

export default App;
