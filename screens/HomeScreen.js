import { Feather } from "@expo/vector-icons";
import moment from "moment";
import { H1, H3, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { AsyncStorage, SafeAreaView, ScrollView } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Button,
  Modal,
  Portal,
  ProgressBar,
  Title
} from "react-native-paper";
import styled from "styled-components";
import BudgetStatusBar from "../components/BudgetStatusBar";
import Container from "../components/Container";
import MoneyInput from "../components/MoneyInput";
import VoiceRecognition from "../components/VoiceRecognition";
import { withFirebase } from "../shared/FirebaseContext";

const dateFormat = "YYYY-M-D";

const StatusBar = ({ firebase, uid }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const asyncFunc = async () => {
      await firebase.user(uid).on("value", snapshot => {
        const user = snapshot.val();
        setUser(Object.values(user)[0]);
      });
      setLoading(false);
    };
    asyncFunc();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <React.Fragment>
      <H1>Your balance: {user && user.balance ? user.balance : "$0"}</H1>
      <Title>Your budget: $0</Title>
      <ProgressBar progress={0} style={{ marginTop: 8 }} color="#00a86b" />
    </React.Fragment>
  );
};

class HomeScreen extends React.Component {
  state = {
    loading: true,
    categories: null,
    selectedStartDate: new Date(),
    visible: false,
    currentTransactions: null,
    totalBalance: 0,
    totalBudget: 0,
    uid: ""
  };

  async componentDidMount() {
    const isNewUser = await this.isNewUser();
    if (isNewUser === "unseen" || !isNewUser) {
      this.showModal();
    }

    const uid = await this.props.firebase.getCurrentUser();
    await this.props.firebase.categories(uid).on("value", snapshot => {
      const categoriesObj = snapshot.val();
      let categoriesArray = [];
      if (categoriesObj) {
        categoriesArray = this.props.firebase.transformObjectToArray(
          categoriesObj
        );
      }
      // calculate budget from categories
      let totalBudget = 0;
      categoriesArray.forEach(category => {
        if (category && category.budget) {
          totalBudget += category.budget;
        }
      });
      this.setState({
        uid,
        totalBudget,
        loading: false,
        categories: categoriesArray
      });
    });
    // const categories = JSON.parse(JSON.stringify(c)) || [];

    // console.log(categories);
    // let parsedCategories = categories;

    // if (
    //   categories &&
    //   typeof categories === "array" &&
    //   categories.length > 0 &&
    //   typeof categories[0].timestamps === "object"
    // ) {
    //   parsedCategories = categories.map(c => {
    //     const timestamps = [];
    //     if (!c || !c.timestamps) {
    //       return;
    //     }
    //     Object.keys(c.timestamps).map(key => {
    //       const [amount] = Object.values(c.timestamps[key]);
    //       const [date] = Object.keys(c.timestamps[key]);
    //       timestamps.push({ date, amount });
    //     });
    //     return { ...c, timestamps };
    //   });
    // }

    // const categoriesWithCurrentDateTransactions = parsedCategories.map(c => ({
    //   ...c,
    //   timestamps: c.timestamps.filter(
    //     t => t.date === moment().format(dateFormat)
    //   )
    // }));

    // parsedCategories.forEach(c =>
    //   c.timestamps.forEach(t => (totalBudget += Number(t.amount)))
    // );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedStartDate !== this.state.selectedStartDate) {
      // if (this.state.categories.length > 0) {
      //   const categoriesWithCurrentDateTransactions = this.state.categories.map(
      //     c => ({
      //       ...c,
      //       timestamps: c.timestamps.filter(
      //         t =>
      //           t.date ===
      //           moment(this.state.selectedStartDate).format(dateFormat)
      //       )
      //     })
      //   );
      //   this.setState({
      //     currentTransactions: categoriesWithCurrentDateTransactions
      //   });
      // }
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
    const uid = await this.props.firebase.getCurrentUser();
    this.props.firebase
      .user(uid)
      .update({ balance: this.state.totalBalance }, () => {
        this.setUserStatusToSeen();
        this.hideModal();
      });
  };

  render() {
    const { selectedStartDate, loading, totalBudget } = this.state;

    if (loading) {
      return (
        <RootView>
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
        </RootView>
      );
    }

    const startDate = selectedStartDate ? selectedStartDate.toString() : "";

    return (
      <React.Fragment>
        <ScrollView>
          <RootView>
            <Container>
              <SafeAreaView>
                <RootContainer>
                  <BudgetStatusBar
                    totalBudget={totalBudget}
                    uid={this.state.uid}
                  />
                  <CalendarPicker
                    selectedDayColor="#00a86b"
                    selectedDayTextColor="white"
                    onDateChange={this.onDateChange}
                    maxDate={new Date()}
                  />
                  <SpaceBetween>
                    <H1>Your Transactions</H1>
                    <TouchableOpacity
                      onPress={this.onPressAddCategory}
                      style={{
                        margin: "auto",
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Feather name="plus-circle" size={24} />
                    </TouchableOpacity>
                  </SpaceBetween>
                  <Title style={{ marginBottom: 8 }}>
                    For{" "}
                    {moment(this.state.selectedStartDate).format(dateFormat)}
                  </Title>
                  <ScrollView>
                    {this.state.categories ? (
                      <FlatList
                        style={{ flex: 1, marginBottom: 64 }}
                        data={this.state.categories}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => this.onPressCategory(item)}
                          >
                            <Item>
                              <Title>{item.name}</Title>
                              {/* <FlatList
                              data={item.timestamps}
                              renderItem={({ item }) => (
                                <SpaceBetween>
                                  <Text>{item.date}</Text>
                                  <Text>
                                    {accounting.formatMoney(item.amount)}
                                  </Text>
                                </SpaceBetween>
                              )}
                              keyExtractor={(item, i) => item.date + i}
                            /> */}
                            </Item>
                          </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id}
                      />
                    ) : (
                      <Text>No categories found</Text>
                    )}
                  </ScrollView>
                </RootContainer>
                {/* User prompt modal */}
                <Portal>
                  <Modal visible={this.state.visible} dismissable={true}>
                    <ModalContainer>
                      <H1>Thanks for joing Plutus!</H1>
                      <Text style={{ marginBottom: 8 }}>
                        Before we let you free, we need some more information to
                        get started.
                      </Text>
                      <H3 style={{ marginBottom: 8 }}>
                        How much do money do you currently have in your checking
                        account?
                      </H3>
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
              </SafeAreaView>
            </Container>
          </RootView>
        </ScrollView>
        <VoiceRecognition />
      </React.Fragment>
    );
  }
}

const WrappedComponent = withFirebase(HomeScreen);

WrappedComponent.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: () => <Text>Plutus</Text>,
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
