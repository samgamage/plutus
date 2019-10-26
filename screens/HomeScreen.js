import { Feather } from "@expo/vector-icons";
import accounting from "accounting";
import { H1 } from "native-base";
import React from "react";
import { Animated, FlatList, SafeAreaView, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ProgressBar, Title } from "react-native-paper";
import { connect } from "react-redux";
import styled from "styled-components";
import Container from "../components/Container";

function mapStateToProps(state) {
  return { action: state.action, name: state.name };
}

function mapDispatchToProps(dispatch) {
  return {
    // openMenu: () =>
    //   dispatch({
    //     type: "OPEN_MENU"
    //   })
  };
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: () => <Text>Plutus</Text>
  };

  state = {
    scale: new Animated.Value(1),
    opacity: new Animated.Value(1),
    categories
  };

  componentDidUpdate() {}

  onPressAddCategory = () => {
    this.props.navigation.navigate("Add");
  };

  onPressCategory = id => {
    this.props.navigation.navigate("Category", {
      id
    });
  };

  render() {
    return (
      <RootView>
        <Container>
          <SafeAreaView>
            <RootContainer>
              <SpaceBetween>
                <H1 style={{ marginBottom: 16 }}>Categories</H1>
                <TouchableOpacity
                  onPress={this.onPressAddCategory}
                  style={{
                    margin: "auto",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <Feather name="plus-circle" size={24} />
                </TouchableOpacity>
              </SpaceBetween>
              <FlatList
                data={this.state.categories}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => this.onPressCategory(item.id)}
                  >
                    <Item>
                      <Title>{item.name}</Title>
                      <Text>
                        {accounting.formatMoney(item.currentAmount)} /{" "}
                        {accounting.formatMoney(item.totalAmount)}
                      </Text>
                      <ProgressBar
                        progress={item.currentAmount / item.totalAmount}
                        color="#3c4560"
                        style={{ marginTop: 8 }}
                      />
                    </Item>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
              />
            </RootContainer>
          </SafeAreaView>
        </Container>
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

const RootContainer = styled.View`
  margin-top: 32px;
  margin-bottom: 16px;
`;

const Item = styled.View`
  margin-bottom: 16px;
  background-color: white;
  padding: 16px;
  border-radius: 8px;
`;

const SpaceBetween = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const categories = [
  {
    name: "Food",
    id: "123asdac",
    currentAmount: 1200,
    totalAmount: 2000
  },
  {
    name: "Rent",
    id: "123addac",
    currentAmount: 5000,
    totalAmount: 5000
  }
];
