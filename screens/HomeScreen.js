import { Feather } from "@expo/vector-icons";
import accounting from "accounting";
import moment from "moment";
import { H1, H3, Text } from "native-base";
import React from "react";
import { AsyncStorage, SafeAreaView, ScrollView } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Button,
  Card,
  Modal,
  Portal,
  Title
} from "react-native-paper";
import { SvgXml } from "react-native-svg";
import styled from "styled-components";
import icon from "../assets/icon.svg";
import BudgetStatusBar from "../components/BudgetStatusBar";
import Container from "../components/Container";
import MoneyInput from "../components/MoneyInput";
import { withFirebase } from "../shared/FirebaseContext";

const dateFormat = "YYYY-M-D";

class HomeScreen extends React.PureComponent {
  state = {
    loading: true,
    categories: null,
    selectedStartDate: new Date(),
    visible: false,
    currentTransactions: null,
    totalBalance: 0,
    totalBudget: 0,
    totalSpent: 0,
    uid: ""
  };

  async componentDidMount() {
    const isNewUser = await this.isNewUser();
    if (isNewUser === "unseen" || !isNewUser) {
      this.showModal();
    }

    const uid = await this.props.firebase.getCurrentUser();
    let categoriesArray = [],
      transactionArray = [];
    let totalBudget = 0,
      totalSpent = 0,
      currentBalance = 0;

    await this.props.firebase.user(uid).on("value", snapshot => {
      const userObj = snapshot.val();
      currentBalance = userObj.balance;
      this.setState({
        totalBalance: currentBalance
      });
    });
    await this.props.firebase.categories(uid).on("value", snapshot => {
      const categoriesObj = snapshot.val();
      if (categoriesObj) {
        categoriesArray = this.props.firebase.transformObjectToArray(
          categoriesObj
        );
      }
      // calculate budget from categories
      categoriesArray.forEach(category => {
        if (category && category.budget) {
          totalBudget += category.budget;
        }
      });
      this.setState({
        totalBudget,
        categories: categoriesArray
      });
    });

    await this.props.firebase.transactions(uid).on("value", snapshot => {
      const transactionsObj = snapshot.val();
      if (transactionsObj) {
        transactionArray = this.props.firebase.transformObjectToArray(
          transactionsObj
        );
      }
      // calculate budget from categories
      transactionArray.forEach(async transaction => {
        if (transaction && transaction.amount) {
          totalSpent += transaction.amount;
        }
        await this.props.firebase
          .category(uid, transaction.category)
          .on("value", snapshot => {
            transaction.category = snapshot.val();
          });
      });
      transactionArray.sort((a, b) =>
        moment(a.timestamp).isAfter(b.timestamp) ? -1 : 1
      );
      this.setState({
        totalSpent,
        currentTransactions: transactionArray.filter(
          t =>
            t.date === moment(this.state.selectedStartDate).format(dateFormat)
        )
      });
    });
    this.setState({
      uid,
      loading: false
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedStartDate !== this.state.selectedStartDate) {
      const uid = this.state.uid;
      let totalSpent = 0;
      await this.props.firebase.transactions(uid).on("value", snapshot => {
        const transactionsObj = snapshot.val();
        if (transactionsObj) {
          transactionArray = this.props.firebase.transformObjectToArray(
            transactionsObj
          );
        }
        // calculate budget from categories
        transactionArray.forEach(async transaction => {
          if (transaction && transaction.amount) {
            totalSpent += transaction.amount;
          }
          await this.props.firebase
            .category(uid, transaction.category)
            .on("value", snapshot => {
              transaction.category = snapshot.val();
            });
        });

        transactionArray.sort((a, b) =>
          moment(a.timestamp).isAfter(b.timestamp) ? -1 : 1
        );
        this.setState({
          totalSpent,
          currentTransactions: transactionArray.filter(
            t =>
              t.date === moment(this.state.selectedStartDate).format(dateFormat)
          )
        });
      });
    }
  }

  onPressAddCategory = () => {
    this.props.navigation.navigate("Add");
  };

  onPressCategory = category => {
    this.props.navigation.navigate("Category", {
      category
    });
  };

  onDateChange = date => {
    this.setState({
      selectedStartDate: date
    });
  };

  setUserStatusToSeen = async () => {
    try {
      await AsyncStorage.setItem("newUser", "seen");
    } catch (e) {}
  };

  isNewUser = async () => {
    try {
      const res = await AsyncStorage.getItem("newUser");
      return res;
    } catch (e) {}
  };

  showModal = () => this.setState({ visible: true });

  hideModal = () => this.setState({ visible: false });

  onModalFormSubmit = async () => {
    if (this.state.totalBalance != 0) {
      const uid = await this.props.firebase.getCurrentUser();
      this.props.firebase
        .user(uid)
        .update(
          { balance: accounting.unformat(this.state.totalBalance) },
          () => {
            this.setUserStatusToSeen();
            this.hideModal();
          }
        );
    }
  };

  render() {
    const { selectedStartDate, loading, totalBudget } = this.state;

    if (loading) {
      return (
        <Root>
          <Container>
            <SafeAreaView
              style={{
                flex: 1,
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              <ActivityIndicator />
            </SafeAreaView>
          </Container>
        </Root>
      );
    }

    const startDate = selectedStartDate ? selectedStartDate.toString() : "";

    return (
      <React.Fragment>
        <Root>
          <ScrollView>
            <Container>
              <RootContainer>
                <BudgetStatusBar
                  totalBudget={totalBudget}
                  uid={this.state.uid}
                  showModal={this.showModal}
                  hideModal={this.hideModal}
                />
                <CalendarPicker
                  selectedDayColor="#00a86b"
                  selectedDayTextColor="white"
                  onDateChange={this.onDateChange}
                  maxDate={new Date()}
                />
                <H1 style={{ marginBottom: 8 }}>Transactions</H1>
                <ScrollView>
                  {this.state.currentTransactions &&
                  this.state.currentTransactions.length ? (
                    <FlatList
                      style={{ flex: 1, marginBottom: 64 }}
                      data={this.state.currentTransactions}
                      renderItem={({ item }) => (
                        <Card style={{ marginBottom: 16 }}>
                          <Card.Content>
                            <Title>{accounting.formatMoney(item.amount)}</Title>
                            <Text>{item.category.name}</Text>
                          </Card.Content>
                        </Card>
                      )}
                      keyExtractor={item => item.id}
                    />
                  ) : (
                    <Text>No transactions found</Text>
                  )}
                </ScrollView>
              </RootContainer>
              <Portal>
                <Modal
                  visible={this.state.visible}
                  onDismiss={() => this.setState({ visible: false })}
                  dismissable={true}
                >
                  <ModalContainer>
                    <H3 style={{ marginBottom: 8 }}>Set Balance</H3>
                    <MoneyInput
                      value={this.state.totalBalance}
                      onChangeText={text => {
                        this.setState({ totalBalance: text });
                      }}
                    />
                    <Button
                      style={{ marginTop: 16 }}
                      onPress={this.onModalFormSubmit}
                      mode="contained"
                    >
                      Submit
                    </Button>
                  </ModalContainer>
                </Modal>
              </Portal>
            </Container>
          </ScrollView>
        </Root>
      </React.Fragment>
    );
  }
}

const WrappedComponent = withFirebase(HomeScreen);

WrappedComponent.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: () => <SvgXml width="24" height="24" xml={icon} />,
    headerRight: () => (
      <TouchableOpacity
        onPress={async () => {
          navigation.navigate("Add");
        }}
        style={{ marginRight: 16 }}
      >
        <Feather name="plus-circle" size={24} />
      </TouchableOpacity>
    )
  };
};

export default WrappedComponent;

const Root = styled.View`
  flex: 1;
  background: #f0f3f5;
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
  margin-top: 16px;
  margin-bottom: 16px;
`;

const Item = styled.View`
  margin-bottom: 16px;
  background-color: white;
  padding: 16px;
  border-radius: 8px;
`;

const ModalContainer = styled.View`
  margin: 32px 48px;
  padding: 16px;
  border-radius: 8px;
  background-color: white;
`;

const SpaceBetween = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
