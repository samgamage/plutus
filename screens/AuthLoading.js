import React from "react";
import { AsyncStorage, StatusBar, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { withFirebase } from "../shared/FirebaseContext";

class AuthLoadingScreen extends React.Component {
  async componentDidMount() {
    const userTokenFromStorage = await AsyncStorage.getItem("userToken");
    const parsedTokenFromStorage = JSON.parse(userTokenFromStorage);
    if (parsedTokenFromStorage && parsedTokenFromStorage.length > 0) {
      this.props.navigation.navigate("Root");
      return;
    }
    const user = this.props.firebase.auth().currentUser;
    console.log("Firebase auth user:");
    console.log(user);

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(user ? "Root" : "Login");
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default withFirebase(AuthLoadingScreen);
