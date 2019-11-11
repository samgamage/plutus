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
      isLoading: true,
      user: null,
      uid: ""
    };
  }

  async componentDidMount() {
    const uid = await this.props.firebase.getCurrentUser();
    await this.props.firebase.user(uid).on("value", snapshot => {
      const user = snapshot.val();
      this.setState({ uid, user, isLoading: false });
    });
  }

  render() {
    if (this.state.isLoading) {
      return <Text>Loading</Text>;
    }

    console.log(this.state.user);
    return (
      <Container>
        <RootContainer>
          {this.state.isEditing ? (
            <FieldItem>
              <TextInput
                placeholder={this.state.user.email || "Email"}
                value={this.state.user.email}
                onChangeText={email =>
                  this.setState({ user: { ...this.state.user, email } })
                }
                style={{ width: "100%" }}
              />
            </FieldItem>
          ) : (
            <FieldItem>
              <Title>Email</Title>
              <Text>{this.state.user.email}</Text>
            </FieldItem>
          )}
          {this.state.isEditing ? (
            <FieldItem>
              <TextInput
                placeholder={this.state.user.username}
                value={this.state.user.username}
                onChangeText={username =>
                  this.setState({ user: { ...this.state.user, username } })
                }
                style={{ width: "100%" }}
              />
            </FieldItem>
          ) : (
            <FieldItem>
              <Title>Username</Title>
              <Text>{this.state.user.username}</Text>
            </FieldItem>
          )}
          {this.state.isEditing && (
            <Button
              onPress={async () => {
                await this.props.firebase.auth.currentUser.updateEmail(
                  this.state.user.email
                );
                await this.props.firebase
                  .user(this.state.uid)
                  .update(this.state.user, () => {
                    console.log("Update profile success");
                    this.setState({ isEditing: false });
                  });
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
          <Button
            onPress={async () => {
              await this.props.firebase.signOut();
              this.props.navigation.navigate("AuthLoading");
            }}
            color="#00a86b"
            mode="contained"
            style={{ marginTop: 16, color: "white" }}
          >
            Sign out
          </Button>
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
