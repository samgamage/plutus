import React from "react";
import { Button } from "react-native";
import styled from "styled-components";
import Container from "../components/Container";

class ProfileScreen extends React.Component {
  state = {
    isEditing: false,
    firstName: "",
    lastName: "",
    email: ""
  };

  render() {
    return (
      <Container>
        <Text>Profile Screen</Text>
        <Button
          onPress={() =>
            this.setState(prevState => ({ isEditing: !prevState.isEditing }))
          }
          title="Edit profile"
        />
        {this.state.isEditing ? (
          <Input
            placeholder={
              this.state.firstName.length ? this.state.firstName : "First name"
            }
            value={this.state.lastName}
          />
        ) : (
          <Text>First name</Text>
        )}
        {this.state.isEditing ? (
          <Input placeholder="Text" value={this.state.firstName} />
        ) : (
          <Text>Last name</Text>
        )}
        {this.state.isEditing && (
          <Button
            onPress={() => {
              // dispatch save action
              this.setState({ isEditing: false });
            }}
            title="Save"
          />
        )}
      </Container>
    );
  }
}

export default ProfileScreen;

const Input = styled.TextInput`
  border-radius: 5px;
  border: 1px solid gray;
  padding: 10px;
  width: 200px;
`;

const Text = styled.Text``;
