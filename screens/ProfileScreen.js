import { Text } from "native-base";
import React from "react";
import { Button, TextInput, Title } from "react-native-paper";
import styled from "styled-components";
import { withFirebase } from "../shared/FirebaseContext";

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      isSubmitting: false,
      displayName: this.props.firebase.auth().currentUser.displayName || "",
      email: this.props.firebase.auth().currentUser.email
    };
    console.log(this.props.firebase.auth().currentUser.displayName);
    console.log(this.props.firebase.auth().currentUser.email);
  }

  render() {
    return (
      <Container>
        <RootContainer>
          {this.state.isEditing ? (
            <FieldItem>
              <TextInput
                placeholder={this.state.displayName || "Display name"}
                value={this.state.displayName}
                onChangeText={text => this.setState({ displayName: text })}
                style={{ width: "100%" }}
              />
            </FieldItem>
          ) : (
            <FieldItem>
              <Title>Display name</Title>
              <Text>{this.state.displayName}</Text>
            </FieldItem>
          )}
          {this.state.isEditing ? (
            <FieldItem>
              <TextInput
                placeholder={this.state.email}
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })}
                style={{ width: "100%" }}
              />
            </FieldItem>
          ) : (
            <FieldItem>
              <Title>Email</Title>
              <Text>{this.state.email}</Text>
            </FieldItem>
          )}
          {this.state.isEditing && (
            <Button
              onPress={async () => {
                await this.props.firebase.auth().currentUser.updateProfile({
                  displayName: this.state.displayName
                });
                await this.props.firebase
                  .auth()
                  .currentUser.updateEmail(this.state.email);
                console.log("Update profile success");
                this.setState({ isEditing: false });
              }}
              color="#00a86b"
              mode="contained"
              style={{ marginTop: 16, color: "white" }}
            >
              Save
            </Button>
          )}
          {!this.state.isEditing && (
            <Button
              onPress={() =>
                this.setState(prevState => ({
                  isEditing: !prevState.isEditing
                }))
              }
              color="#00a86b"
              mode="contained"
              style={{ marginTop: 16, color: "white" }}
            >
              Edit Profile
            </Button>
          )}
        </RootContainer>
      </Container>
    );
  }
}

const WrappedComponenent = withFirebase(ProfileScreen);

WrappedComponenent.navigationOptions = {
  headerTitle: () => <Text>Profile</Text>
};

export default WrappedComponenent;

const Input = styled.TextInput`
  border-radius: 5px;
  border: 1px solid gray;
  padding: 10px;
  width: 100%;
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
`;
