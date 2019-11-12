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
    currentCategory: null
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
        transactions: this.state.currentCategory.transactions
          ? [...this.state.currentCategory.transactions, transaction]
          : [transaction]
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
      const transaction = {
        id: uuid.v4(),
        amount: accounting.unformat(this.state.amount),
        category: this.state.currentCategory.id,
        date: moment().format("YYYY-M-D")
      };

      // find category

      // if we can't find category then cancel add

      const newCategory = {
        ...this.state.currentCategory,
        transactions: this.state.currentCategory.transactions
          ? [...this.state.currentCategory.transactions, transaction]
          : [transaction]
      };
      this.props.firebase
        .categories(this.props.firebase.auth.currentUser.uid)
        .on("value", snapshot => {
          const categoriesObj = snapshot.val();
          let categoriesArray = [];
          if (categoriesObj) {
            categoriesArray = this.props.firebase.transformObjectToArray(
              categoriesObj
            );
          }
          console.log(categoriesArray);
          const existingCategory = categoriesArray.find(
            c => c.name === categoryName
          );
          if (!existingCategory) {
            const id = uuid.v4();
            const category = {
              id,
              name,
              budget: accounting.unformat(budget),
              transactions: []
            };
          }
        });
      // this.props.firebase
      //   .transaction(this.state.uid, transaction.id)
      //   .set(transaction, () => {
      //     this.props.firebase
      //       .category(this.state.uid, this.state.currentCategory.id)
      //       .set(newCategory, () => {
      //         this.props.navigation.navigate("Home");
      //       });
      //   });
    }
  };

  addCategory = (name, budget) => {
    const id = uuid.v4();
    const category = {
      id,
      name,
      budget: accounting.unformat(budget),
      transactions: []
    };
    this.props.firebase
      .category(this.props.firebase.auth.currentUser.uid, id)
      .set(category, () => {
        this.props.navigation.navigate("Home");
      });
  };

  setCurrentCategory = category => {
    this.setState({ currentCategory: category });
  };

  render() {
    // this.addFundsWithAmountAndCategory(20, "Retail");
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
