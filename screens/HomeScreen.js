import React from "react";
import { Animated, SafeAreaView, ScrollView, Text, View, Button } from "react-native";
import { connect } from "react-redux";
import styled from "styled-components";
import Card from "../components/Card";
import Container from "../components/Container";
import * as FirebaseService from '../shared/FirebaseService';
import * as UserActions from '../redux/actions/UserActions';

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

// @connect((store) => {
//   return {
//       user: store.user.user
//   }
// })

class HomeScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1)
    };
    // this.checkAuth();
  }

  checkAuth() {
    FirebaseService.signInAnonymous()
      .then(user => {
        this.props.dispatch(UserActions.setUser(user));
        console.log("New user dispatched to Redux Store");
      })
      .catch((e) => {
        console.log("Error dispatching new user to Redux Store: " + e);
      });
  }

  static navigationOptions = {
    headerTitle: () => (
      <View>
        <Text>Plutus</Text>
      </View>
    )
  };



  testLogin() {
    UserActions.dispatch()
  }

  componentDidUpdate() { }

  render() {
    return (
      <RootView>
        <AnimatedContainer
          style={{
            transform: [{ scale: this.state.scale }],
            opacity: this.state.opacity
          }}
        >
          <SafeAreaView>
            <ScrollView style={{ height: "100%" }}>
              <Card navigation={this.props.navigation} caption="Category" />
            </ScrollView>
          </SafeAreaView>
        </AnimatedContainer>
      </RootView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);

const RootView = styled.View`
  background: black;
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
