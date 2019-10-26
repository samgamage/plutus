import React from "react";
import { Dimensions, Text, View } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import styled from "styled-components";

const AddFunds = () => {
  return (
    <View>
      <Input type="number" placeholder="Amount" />
    </View>
  );
};

const AddCategory = () => (
  <View>
    <Text>Category</Text>
  </View>
);

export default class AddScreen extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: "funds", title: "Add Funds" },
      { key: "category", title: "Add Category" }
    ]
  };

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          funds: AddFunds,
          category: AddCategory
        })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "black" }}
            style={{ backgroundColor: "black", color: "white" }}
          />
        )}
      />
    );
  }
}

const Input = styled.TextInput`
  border-radius: 5px;
  border: 1px solid gray;
  padding: 10px;
  width: 200px;
`;
