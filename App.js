import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { createStore } from "redux";
import AppNavigator from "./navigators/AppNavigator";
import Typeography from "./typography";

const initialState = {
  action: "",
  name: ""
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Typeography.darkBlue,
    accent: Typeography.lightGray
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // define actions here e.g.,
    // case "OPEN_MENU":
    //   return { action: "openMenu" };
    default:
      return state;
  }
};

const store = createStore(reducer);

const App = () => (
  <PaperProvider theme={theme}>
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  </PaperProvider>
);

export default App;
