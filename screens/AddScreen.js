import { Feather } from "@expo/vector-icons";
import accounting from "accounting";
import { Formik } from "formik";
import moment from "moment";
import { Content, Tab, Tabs } from "native-base";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Button, HelperText, Menu, Title } from "react-native-paper";
import styled from "styled-components";
import uuid from "uuid";
import * as Yup from "yup";
import MoneyInput from "../components/MoneyInput";
import VoiceRecognition from "../components/VoiceRecognition";
import { withFirebase } from "../shared/FirebaseContext";
import Typography from "../typeography";

class AddFunds extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: "",
      amount: 0,
      visible: false,
      categories: [],
      loading: true
    };
  }

  async componentDidMount() {
    const uid = await this.props.firebase.getCurrentUser();
    await this.props.firebase.categories(uid).on("value", snapshot => {
      const categoriesObj = snapshot.val();
      let categoriesArray = [];
      if (categoriesObj) {
        categoriesArray = this.props.firebase.transformObjectToArray(
          categoriesObj
        );
      }
      this.setState({ categories: categoriesArray });
    });
    this.setState({ loading: false, uid });
  }

  openMenu = () => this.setState({ visible: true });

  closeMenu = () => this.setState({ visible: false });

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    if (this.state.loading) {
      return null;
    }

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
                  {this.props.currentCategory && (
                    <Text>
                      Category chosen: {this.props.currentCategory.name}
                    </Text>
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
                data={this.state.categories}
                renderItem={({ item }) => (
                  <Menu.Item
                    onPress={() => {
                      this.props.setCurrentCategory(item);
                      this.closeMenu();
                    }}
                    title={item.name}
                  />
                )}
                keyExtractor={item => item.id}
              ></FlatList>
            </Menu>
            <Button
              onPress={() => this.props.addFundsWithAmount(this.state.amount)}
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

const AddCategory = ({
  firebase,
  navigation,
  addCategory,
  currentCategory
}) => (
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

class AddScreen extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: "funds", title: "Add Transactions" },
      { key: "category", title: "Add Category" }
    ],
    currentCategory: null,
    commandResponse: null
  };

  addFundsWithAmount = async amount => {
    const uid = await this.props.firebase.getCurrentUser();
    if (this.state.currentCategory) {
      const transaction = {
        id: uuid.v4(),
        amount: accounting.unformat(amount),
        category: this.state.currentCategory.id,
        date: moment().format("YYYY-M-D")
      };
      const newCategory = {
        ...this.state.currentCategory,
        transactions: {
          ...this.state.currentCategory.transactions,
          [transaction.id]: transaction
        }
      };
      this.props.firebase
        .transaction(uid, transaction.id)
        .set(transaction, () => {
          this.props.firebase
            .category(uid, this.state.currentCategory.id)
            .set(newCategory, () => {
              this.props.navigation.navigate("Home");
            });
        });
    }
  };

  addFundsWithAmountAndCategory = (amount, categoryName) => {
    if (this.state.currentCategory) {
      const uid = this.props.firebase.auth.currentUser.uid;

      // find category
      this.props.firebase.categories(uid).on("value", async snapshot => {
        const categoriesObj = snapshot.val();
        let categoriesArray = [];
        if (categoriesObj) {
          categoriesArray = this.props.firebase.transformObjectToArray(
            categoriesObj
          );
        }
        const existingCategory = categoriesArray.find(
          c => c.name === categoryName
        );
        if (!existingCategory) {
          console.log("No existing category");
          const category = await this.addCategory(categoryName, amount * 2);
          const transaction = {
            id: uuid.v4(),
            amount: accounting.unformat(amount),
            category: category.id,
            date: moment().format("YYYY-M-D")
          };
          const transactionRef = this.props.firebase.transaction(uid, tid);
          await transactionRef.set(transaction);
          this.setState({
            commandResponse: {
              ok: true,
              message: `Created category ${
                category.name
              } and added ${accounting.formatMoney(amount)} to it`
            }
          });
        } else {
          console.log("Category already exists");
          console.log(existingCategory);
          const tid = uuid.v4();
          const newCategoryTransactionRef = this.props.firebase
            .categoryTransactions(uid, existingCategory.id)
            .push();
          const transaction = {
            id: newCategoryTransactionRef.key,
            amount: accounting.unformat(amount),
            category: existingCategory.id,
            date: moment().format("YYYY-M-D")
          };
          newCategoryTransactionRef.set(transaction);

          this.props.firebase.transaction(uid, tid).set(transaction, () => {
            this.setState({
              commandResponse: {
                ok: true,
                message: `Added ${accounting.formatMoney(amount)} to ${
                  existingCategory.name
                }`
              }
            });
          });
        }
      });
    }
  };

  addCategory = async (name, budget) => {
    const id = uuid.v4();
    const category = {
      id,
      name,
      budget: accounting.unformat(budget),
      transactions: []
    };
    const categoryRef = this.props.firebase.category(
      this.props.firebase.auth.currentUser.uid,
      id
    );
    await categoryRef.set(category);
    this.props.navigation.navigate("Home");
    return category;
  };

  setCurrentCategory = async category => {
    this.setState({ currentCategory: category });
    this.addFundsWithAmountAndCategory(20, "Retail");
    console.log(this.state.commandResponse);
  };

  render() {
    return (
      <React.Fragment>
        <Tabs
          tabBarActiveTextColor={Typography.activeColor}
          tabBarInactiveTextColor={Typography.inactiveColor}
          tabBarUnderlineStyle={{ backgroundColor: Typography.activeColor }}
          style={{ height: "100%" }}
        >
          <Tab
            heading="Add Category"
            tabStyle={{ backgroundColor: "white" }}
            activeTabStyle={{ backgroundColor: "white" }}
          >
            <AddCategory
              firebase={this.props.firebase}
              navigation={this.props.navigation}
              addCategory={this.addCategory}
              currentCategory={this.state.currentCategory}
            />
          </Tab>
          <Tab
            heading="Add Transactions"
            tabStyle={{ backgroundColor: "white" }}
            activeTabStyle={{ backgroundColor: "white" }}
          >
            <AddFunds
              firebase={this.props.firebase}
              navigation={this.props.navigation}
              addFundsWithAmount={this.addFundsWithAmount}
              setCurrentCategory={this.setCurrentCategory}
              currentCategory={this.state.currentCategory}
            />
          </Tab>
        </Tabs>
        <VoiceRecognition />
      </React.Fragment>
    );
  }
}

const WrappedComponent = withFirebase(AddScreen);

WrappedComponent.navigationOptions = ({ navigation }) => ({
  headerMode: "screen",
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
