import { Text } from "native-base";
import React from "react";
import { Button, TextInput, Title } from "react-native-paper";
import styled from "styled-components";

class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text>Profile</Text>
    };
  };

  state = {
    isEditing: false,
    isSubmitting: false,
    firstName: "",
    lastName: "",
    email: ""
  };

  render() {
    return (
      <Container>
        <RootContainer>
          {this.state.isEditing ? (
            <FieldItem>
              <TextInput
                placeholder={
                  this.state.firstName.length
                    ? this.state.firstName
                    : "First name"
                }
                value={this.state.firstName}
                onChangeText={text => this.setState({ firstName: text })}
                style={{ width: "100%" }}
              />
            </FieldItem>
          ) : (
            <FieldItem>
              <Title>First name</Title>
              <Text>first</Text>
            </FieldItem>
          )}
          {this.state.isEditing ? (
            <FieldItem>
              <TextInput
                placeholder={
                  this.state.lastName.length ? this.state.lastName : "Last name"
                }
                value={this.state.lastName}
                onChangeText={text => this.setState({ lastName: text })}
                style={{ width: "100%" }}
              />
            </FieldItem>
          ) : (
            <FieldItem>
              <Title>Last name</Title>
              <Text>last</Text>
            </FieldItem>
          )}

          <FieldItem>
            <Title>Email</Title>
            <Text>email</Text>
          </FieldItem>
          {this.state.isEditing && (
            <Button
              onPress={() => {
                // dispatch save action
                this.setState({ isEditing: false });
              }}
              color="#3c4560"
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
              color="#3c4560"
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

export default ProfileScreen;

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
