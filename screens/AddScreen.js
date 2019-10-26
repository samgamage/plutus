import { Content, Form, H1, Tab, Tabs } from "native-base";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { Button, Menu } from "react-native-paper";
import styled from "styled-components";
import Typography from "../typography";

class AddFunds extends React.Component {
  state = {
    amount: 0,
    visible: false,
    currentCategory: null
  };

  addFunds = () => {};

  openMenu = () => this.setState({ visible: true });

  closeMenu = () => this.setState({ visible: false });

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    console.log(this.state.currentCategory);
    return (
      <RootContainer>
        <Container>
          <Content>
            <H1>Funds</H1>
            <TextInputMask
              type={"money"}
              value={this.state.amount}
              options={{
                precision: 2,
                separator: ".",
                delimiter: ".",
                unit: "$",
                suffixUnit: ""
              }}
              onChangeText={text => {
                this.setState({ amount: text });
              }}
              style={{
                padding: 8,
                backgroundColor: "white",
                marginTop: 8,
                borderRadius: 8
              }}
            />
            <H1 style={{ marginTop: 16 }}>Category</H1>
            <Menu
              visible={this.state.visible}
              onDismiss={this.closeMenu}
              anchor={
                <View>
                  {this.state.currentCategory && (
                    <Text>Current category: {this.state.currentCategory}</Text>
                  )}
                  <Button
                    onPress={this.openMenu}
                    style={{ marginTop: 8 }}
                    mode="contained"
                  >
                    Choose category
                  </Button>
                </View>
              }
            >
              <FlatList
                data={categories}
                renderItem={({ item }) => (
                  <Menu.Item
                    onPress={() => {
                      this.setState({ currentCategory: item.name });
                      this.closeMenu();
                    }}
                    title={item.name}
                  />
                )}
                keyExtractor={item => item.id}
              ></FlatList>
            </Menu>
            <Button
              onPress={this.addFunds}
              style={{ marginTop: 16 }}
              color="#3c4560"
              mode="contained"
            >
              Submit
            </Button>
          </Content>
        </Container>
      </RootContainer>
    );
  }
}

const AddCategory = () => {
  const [category, setCategory] = useState(null);

  const addCategory = () => {};

  return (
    <RootContainer>
      <Container>
        <Content>
          <Form>
            <H1>Category</H1>
            <Input
              type="text"
              value={category}
              onChangeText={text => setCategory(text)}
            />
            <Button
              onPress={addCategory}
              style={{ marginTop: 16 }}
              color="#3c4560"
              mode="contained"
            >
              Submit
            </Button>
          </Form>
        </Content>
      </Container>
    </RootContainer>
  );
};

export default class AddScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text>Plutus</Text>
    };
  };

  state = {
    index: 0,
    routes: [
      { key: "funds", title: "Add Funds" },
      { key: "category", title: "Add Category" }
    ]
  };

  render() {
    return (
      <Tabs
        tabBarActiveTextColor={Typography.activeColor}
        tabBarInactiveTextColor={Typography.inactiveColor}
        tabBarUnderlineStyle={{ backgroundColor: Typography.activeColor }}
      >
        <Tab heading="Add Category">
          <AddCategory />
        </Tab>
        <Tab heading="Add Funds">
          <AddFunds />
        </Tab>
      </Tabs>
    );
  }
}

const Input = styled.TextInput`
  border-radius: 5px;
  border: 1px solid gray;
  padding: 10px;
  width: 100%;
  margin-top: 8px;
`;

const Container = styled.View`
  padding: 8px;
  background-color: #f0f3f5;
  height: 100%;
`;

const RootContainer = styled.View`
  padding-top: 32px;
  padding-bottom: 16px;
  background-color: #f0f3f5;
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
