import { Formik } from "formik";
import { H1 } from "native-base";
import React from "react";
import { AsyncStorage, SafeAreaView, Text } from "react-native";
import { Button, HelperText } from "react-native-paper";
import styled from "styled-components";
import * as Yup from "yup";
import * as FirebaseService from "../shared/FirebaseService";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("This field is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("This field is required")
});

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  onLogin = async (email, password) => {
    FirebaseService.signInWithEmail(email, password).then(user => {
      console.log(user);
      if (user) {
        AsyncStorage.setItem("userToken", JSON.stringify(user.uid));
        this.props.navigation.navigate("AuthLoading");
      }
    });
  };

  render() {
    return (
      <Container>
        <RootContainer>
          <SafeAreaView>
            <H1 style={{ textAlign: "center" }}>Plutus</H1>
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={values => this.onLogin(values.email, values.password)}
              // validationSchema={LoginSchema}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <React.Fragment>
                  <Input
                    placeholder="Email"
                    autoCompleteType="email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                  />
                  <HelperText type="error" visible={errors.email}>
                    {errors.email}
                  </HelperText>
                  <Input
                    autoCompleteType="password"
                    value={values.password}
                    placeholder="Password"
                    onChangeText={handleChange("password")}
                    secureTextEntry={true}
                    onBlur={handleBlur("password")}
                  />
                  <HelperText type="error" visible={errors.password}>
                    {errors.password}
                  </HelperText>
                  <Button
                    style={{ marginTop: 16 }}
                    onPress={handleSubmit}
                    mode="contained"
                  >
                    Log In
                  </Button>
                </React.Fragment>
              )}
            </Formik>
            <Text style={{ marginTop: 16 }}>Don't have an account?</Text>
            <Button
              style={{ marginTop: 8 }}
              onPress={() => this.props.navigation.navigate("SignUp")}
            >
              Sign Up
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
