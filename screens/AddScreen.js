import { Content, Form, H1, Tab, Tabs } from "native-base";
import React, { useState } from "react";
import { FlatList, Text, View, Alert } from "react-native";
import { Button, Menu, Title } from "react-native-paper";
import styled from "styled-components";
import MoneyInput from "../components/MoneyInput";
import * as FirebaseService from "../shared/FirebaseService";
import Typography from "../typeography";

class AddFunds extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      visible: false,
      currentCategory: null
    }
  }
  state = {
    amount: 0,
    visible: false,
    currentCategory: null
  };

  addFunds = () => { };

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
            <MoneyInput
              value={this.state.amount}
              onChangeText={text => {
                this.setState({ amount: text });
              }}
            />
            <H1 style={{ marginTop: 16 }}>Category</H1>
            <Menu
              visible={this.state.visible}
              onDismiss={this.closeMenu}
              anchor={
                <View>
                  {this.state.currentCategory && (
                    <Text>Category chosen: {this.state.currentCategory}</Text>
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
              color="#00a86b"
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
  const [totalBudget, setTotalBudget] = useState(0);


  // if (this.state.currentCategory != null && this.state.amount) {
  //   FirebaseService
  //     .addCategory(this.state.currentCategory, this.state.amount, "120")
  //     .then((response) => {
  //       console.log("Added Funds to Category: " + response)
  //     })
  //     .catch((e) => {
  //       console.log("Error adding funds to category: " + e);
  //     });
  // }
  // else {
  //   Alert.alert("Please fill out all fields :)");
  // }
  const addCategory = () => {
    if (category && totalBudget) {
      console.log("TEST: " + category)
      FirebaseService
        .addCategoryType(category, totalBudget)
        .then((response) => {
          console.log("Added Funds to Category: " + response)
        })
        .catch((e) => {
          console.log("Error adding funds to category: " + e);
        });
    }
    else {
        Alert.alert("Please fill out all fields :)");
      }
  };

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
            <Title>Set budget</Title>
            <MoneyInput
              value={totalBudget}
              onChangeText={text => {
                setTotalBudget(text);
              }}
            />
            <Button
              onPress={addCategory}
              style={{ marginTop: 16 }}
              color="#00a86b"
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
  background-color: white;
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
