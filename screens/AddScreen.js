import { Feather } from "@expo/vector-icons";
import { Formik } from "formik";
import { Content, Tab, Tabs } from "native-base";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Button, HelperText, Menu, Title } from "react-native-paper";
import styled from "styled-components";
import uuid from "uuid";
import * as Yup from "yup";
import MoneyInput from "../components/MoneyInput";
import { withFirebase } from "../shared/FirebaseContext";
import Typography from "../typeography";

class AddFunds extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      visible: false,
      currentCategory: null
    };
  }

  addFunds = () => {};

  openMenu = () => this.setState({ visible: true });

  closeMenu = () => this.setState({ visible: false });

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
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

const AddCategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Category must be at least 3 characters")
    .required("This field is required")
});

const AddCategory = ({ firebase, navigation }) => {
  const addCategory = (name, budget) => {
    const id = uuid.v4();
    const category = {
      id,
      name,
      budget,
      transactions: []
    };
    firebase.category(firebase.auth.currentUser.uid, id).set(category, () => {
      navigation.navigate("Home");
    });
  };

  return (
    <RootContainer>
      <Container>
        <Content>
          <Title>Set category name</Title>
          <Formik
            onSubmit={(values, actions) => {
              addCategory(values.name, values.budget);
              actions.resetForm();
            }}
            initialValues={{ name: "", budget: 0 }}
            validationSchema={AddCategorySchema}
          >
            {({ values, handleChange, handleSubmit, errors }) => (
              <React.Fragment>
                <Input
                  type="text"
                  placeholder="Category name"
                  value={values.name}
                  onChangeText={handleChange("name")}
                />
                <HelperText type="error" visible={errors.name}>
                  {errors.name}
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
        </Content>
      </Container>
    </RootContainer>
  );
};

class AddScreen extends React.Component {
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
          <AddCategory
            firebase={this.props.firebase}
            navigation={this.props.navigation}
          />
        </Tab>
        <Tab heading="Add Funds">
          <AddFunds
            firebase={this.props.firebase}
            navigation={this.props.navigation}
          />
        </Tab>
      </Tabs>
    );
  }
}

const WrappedComponent = withFirebase(AddScreen);

WrappedComponent.navigationOptions = ({ navigation }) => ({
  headerTitle: () => <Text>Plutus</Text>,
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 8 }}
    >
      <Feather name="arrow-left" size={24} />
    </TouchableOpacity>
  )
});

export default WrappedComponent;

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
