import { H1 } from "native-base";
import React from "react";
import { SafeAreaView, Text } from "react-native";
import { Button } from "react-native-paper";
import styled from "styled-components";

class SignUpScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    email: "",
    password: "",
    isSubbmitting: false
  };

  onSignUp = () => {
    // FirebaseService.createUserWithEmail(this.state.email, this.state.password).then(
    //   () => {
    this.props.navigation.navigate("Root");
    //   }
    // );
  };

  render() {
    return (
      <Container>
        <RootContainer>
          <SafeAreaView>
            <H1 style={{ textAlign: "center" }}>Plutus</H1>
            <Input
              placeholder="Email"
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
              onPress={this.onSignUp}
              mode="contained"
            >
              Sign Up
            </Button>
            <Text style={{ marginTop: 16 }}>Already have an account?</Text>
            <Button
              style={{ marginTop: 8 }}
              onPress={() => this.props.navigation.navigate("Login")}
            >
              Log in
            </Button>
          </SafeAreaView>
        </RootContainer>
      </Container>
    );
  }
}

export default SignUpScreen;

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
