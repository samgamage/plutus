import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import AppNavigator from "./navigators/AppNavigator";
import FirebaseContext from "./shared/FirebaseContext";
import { firebaseInstance } from "./shared/FirebaseService";
import Typeography from "./typeography";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Typeography.darkBlue,
    accent: Typeography.lightGray
  }
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <FirebaseContext.Provider value={firebaseInstance}>
        <AppNavigator />
      </FirebaseContext.Provider>
    </PaperProvider>
  );
};

export default App;
