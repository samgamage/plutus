import React from "react";
import styled from "styled-components";

class AddScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <Container>
        <Text>Add Screen</Text>
      </Container>
    );
  }
}

export default AddScreen;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text``;
