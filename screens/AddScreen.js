import { Feather } from "@expo/vector-icons";
import { Formik } from "formik";
import { Content, Form, Tab, Tabs } from "native-base";
import React, { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Button, HelperText, Menu, Title } from "react-native-paper";
import styled from "styled-components";
import * as Yup from "yup";
import MoneyInput from "../components/MoneyInput";
import * as FirebaseService from "../shared/FirebaseService";
import Typography from "../typeography";

const AddCategorySchema = Yup.object().shape({
  categories: Yup.string()
    .min(3, "Category must be at least 3 characters")
    .required("This field is required")
});

class AddFunds extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      visible: false,
      currentCategory: null
    };
    FirebaseService.getAllCategories();
    this.getCategories();
  }
  state = {
    amount: 0,
    visible: false,
    currentCategory: null
  };

  getCategories = async () => {
    let categories = await FirebaseService.getAllCategories();
    console.log("The Kool Catz: " + JSON.stringify(categories));
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
            <Title>Set amount to be added</Title>
            <MoneyInput
              value={this.state.amount}
              onChangeText={text => {
                this.setState({ amount: text });
              }}
            />
            <Title>Choose category to add to</Title>
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
      console.log("TEST: " + category);
      FirebaseService.addCategoryType(category, totalBudget)
        .then(response => {
          console.log("Added Funds to Category: " + response);
        })
        .catch(e => {
          console.log("Error adding funds to category: " + e);
        });
    } else {
      Alert.alert("Please fill out all fields :)");
    }
  };

  return (
    <RootContainer>
      <Container>
        <Content>
          <Form>
            <Title>Set category name</Title>
            <Formik
              onSubmit={() => addCategory()}
              initialValues={{ categories: "", budget: 0 }}
              validationSchema={AddCategorySchema}
            >
              {({ values, handleChange, handleSubmit, handleBlur, errors }) => (
                <React.Fragment>
                  <Input
                    type="text"
                    placeholder="Category name"
                    value={category}
                    handleBlur={handleBlur}
                    onChangeText={handleChange("categories")}
                  />
                  <HelperText type="error" visible={errors.categories}>
                    {errors.categories}
                  </HelperText>
                  <Title>Set budget</Title>
                  <MoneyInput
                    value={values.budget}
                    onChangeText={handleChange("budget")}
                  />
                  <Button
                    onPress={handleSubmit}
                    style={{ marginTop: 16 }}
                    color="#00a86b"
                    mode="contained"
                  >
                    Submit
                  </Button>
                </React.Fragment>
              )}
            </Formik>
          </Form>
        </Content>
      </Container>
    </RootContainer>
  );
};

export default class AddScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text>Plutus</Text>,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 8 }}
        >
          <Feather name="arrow-left" size={24} />
        </TouchableOpacity>
      )
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
  padding-top: 16px;
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
