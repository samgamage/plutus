import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import AppNavigator from "./navigators/AppNavigator";
import store from "./redux/store";
import Typeography from "./typeography";

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

const App = () => (
  <PaperProvider theme={theme}>
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  </PaperProvider>
);

export default App;
