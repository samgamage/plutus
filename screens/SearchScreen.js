import React from "react";
import { Animated, SafeAreaView, Text } from "react-native";
import { Searchbar } from "react-native-paper";
import styled from "styled-components";
import uuid from "uuid";
import { withFirebase } from "../shared/FirebaseContext";

class SearchScreen extends React.Component {
  state = {
    query: ""
  };

  componentDidMount() {}

  render() {
    return (
      <RootView>
        <Container>
          <Searchbar
            placeholder="Search"
            onChangeText={query => {
              this.setState({ query });
            }}
            value={this.state.query}
          />
          <SafeAreaView>
            <InnerContainer>
              <Text>Search results</Text>
            </InnerContainer>
          </SafeAreaView>
        </Container>
      </RootView>
    );
  }
}

const WrappedComponent = withFirebase(SearchScreen);

WrappedComponent.navigationOptions = {
  headerTitle: () => <Text>Plutus</Text>
};

export default WrappedComponent;

const RootView = styled.View`
  background: white;
  flex: 1;
`;

const Subtitle = styled.Text`
  color: #b8bece;
  font-weight: 600;
  font-size: 15px;
  margin-left: 20px;
  margin-top: 10px;
  text-transform: uppercase;
`;

const InnerContainer = styled.View`
  flex: 1;
  padding-top: 16px;
`;

const Container = styled.View`
  flex: 1;
  background-color: #f0f3f5;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 16px;
`;

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const Title = styled.Text`
  font-size: 16px;
  color: #b8bece;
  font-weight: 500;
`;

const Name = styled.Text`
  font-size: 20px;
  color: #00a86b;
  font-weight: bold;
`;

const TitleBar = styled.View`
  width: 100%;
  margin-top: 50px;
  padding-left: 80px;
`;

const category = {
  Food: {
    name: "Food",
    id: uuid.v4(),
    currentAmount: 1200,
    totalAmount: 2000,
    timestamps: {
      "2019-10-13": 20,
      "2019-10-14": 50,
      "2019-10-15": 120,
      "2019-10-16": 120
    }
  }
};
