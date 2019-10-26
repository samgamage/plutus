import { Feather } from "@expo/vector-icons";
import React from "react";
import { Animated, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import styled from "styled-components";

function mapStateToProps(state) {
  return { action: state.action, name: state.name };
}

function mapDispatchToProps(dispatch) {
  return {
    openMenu: () =>
      dispatch({
        type: "OPEN_MENU"
      })
  };
}

class CategoryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 8 }}
        >
          <Feather name="arrow-left" size={24} />
        </TouchableOpacity>
      ),
      headerTitle: () => <Text>Plutus</Text>
    };
  };

  state = {};

  componentDidMount() {}

  componentDidUpdate() {}

  render() {
    return (
      <RootView>
        <Container>
          <SafeAreaView>
            <Text>Category</Text>
          </SafeAreaView>
        </Container>
      </RootView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryScreen);

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

const Container = styled.View`
  flex: 1;
  background-color: #f0f3f5;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const Title = styled.Text`
  font-size: 16px;
  color: #b8bece;
  font-weight: 500;
`;

const Name = styled.Text`
  font-size: 20px;
  color: #3c4560;
  font-weight: bold;
`;

const TitleBar = styled.View`
  width: 100%;
  margin-top: 50px;
  padding-left: 80px;
`;
