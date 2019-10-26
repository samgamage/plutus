import { H1 } from "native-base";
import React from "react";
import { SafeAreaView } from "react-native";
import { Button } from "react-native-paper";
import styled from "styled-components";

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    email: "",
    password: "",
    isSubbmitting: false
  };

  onLogin = () => {
    this.setState({ isSubbmitting: true });
    // FirebaseService.signInWithEmail(this.state.email, this.state.password);
    this.props.navigation.navigate("Root");
    this.setState({ isSubbmitting: false });
  };

  render() {
    return (
      <Container>
        <RootContainer>
          <SafeAreaView>
            <H1 style={{ textAlign: "center" }}>Plutus</H1>
            <Input
              autoCompleteType="email"
              value={this.state.email}
              onChangeText={text => this.setState({ email: text })}
            />
            <Input
              autoCompleteType="password"
              value={this.state.password}
              placeholder="Password"
              onChangeText={text => this.setState({ password: text })}
              secureTextEntry={true}
            />
            <Button
              style={{ marginTop: 16 }}
              onPress={this.onLogin}
              mode="contained"
            >
              Login
            </Button>
          </SafeAreaView>
        </RootContainer>
      </Container>
    );
  }
}

export default LoginScreen;

const Input = styled.TextInput`
  border-radius: 5px;
  border: 1px solid gray;
  padding: 10px;
  width: 100%;
  min-width: 300px;
  margin-top: 16px;
`;

const RootContainer = styled.View`
  margin-top: 32px;
  margin-bottom: 16px;
`;

const FieldItem = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Container = styled.View`
  padding: 8px;
  background-color: #f0f3f5;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
