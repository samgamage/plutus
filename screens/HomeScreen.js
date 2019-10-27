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
  Modal,
  Portal,
  ProgressBar,
  Title
} from "react-native-paper";
import styled from "styled-components";
import Container from "../components/Container";
import MoneyInput from "../components/MoneyInput";
import VoiceRecognition from "../components/VoiceRecognition";
import * as UserActions from "../redux/actions/UserActions";
import { withFirebase } from "../shared/FirebaseContext";
import * as FirebaseService from "../shared/FirebaseService";

const dateFormat = "YYYY-M-D";

class HomeScreen extends React.Component {
  state = {
    loading: true,
    categories: [],
    selectedStartDate: new Date(),
    visible: false,
    currentTransactions: null,
    totalBalance: 0,
    totalBudget: 0,
    user: this.props.firebase.auth().currentUser
  };

  testLogin = () => {
    UserActions.dispatch();
  };

  async componentDidMount() {
    const isNewUser = await this.isNewUser();
    if (isNewUser === "unseen" || !isNewUser) {
      this.showModal();
    }
    const c = await FirebaseService.getAllCategories();
    const categories = JSON.parse(JSON.stringify(c)) || [];

    console.log(categories);
    let parsedCategories = categories;

    if (
      categories &&
      typeof categories === "array" &&
      categories.length > 0 &&
      typeof categories[0].timestamps === "object"
    ) {
      parsedCategories = categories.map(c => {
        const timestamps = [];
        if (!c || !c.timestamps) {
          return;
        }
        Object.keys(c.timestamps).map(key => {
          const [amount] = Object.values(c.timestamps[key]);
          const [date] = Object.keys(c.timestamps[key]);
          timestamps.push({ date, amount });
        });
        return { ...c, timestamps };
      });
    }

    const categoriesWithCurrentDateTransactions = parsedCategories.map(c => ({
      ...c,
      timestamps: c.timestamps.filter(
        t => t.date === moment().format(dateFormat)
      )
    }));

    let totalBudget = 0;
    parsedCategories.forEach(c =>
      c.timestamps.forEach(t => (totalBudget += Number(t.amount)))
    );

    this.setState({
      categories: parsedCategories,
      currentTransactions: categoriesWithCurrentDateTransactions,
      loading: false,
      totalBudget
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedStartDate !== this.state.selectedStartDate) {
      console.log(this.state.selectedStartDate);
      const categoriesWithCurrentDateTransactions = this.state.categories.map(
        c => ({
          ...c,
          timestamps: c.timestamps.filter(
            t =>
              t.date === moment(this.state.selectedStartDate).format(dateFormat)
          )
        })
      );

      this.setState({
        currentTransactions: categoriesWithCurrentDateTransactions
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

  onModalFormSubmit = () => {
    // update users total balance here
    this.setUserStatusToSeen();
    this.hideModal();
  };

  render() {
    const { selectedStartDate, loading, totalBudget } = this.state;
    console.log(selectedStartDate);

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
                  <H1>Your balance: $0</H1>
                  <Title>
                    Your budget: {accounting.formatMoney(totalBudget)}
                  </Title>
                  <ProgressBar
                    progress={0}
                    style={{ marginTop: 8 }}
                    color="#00a86b"
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
                    <FlatList
                      style={{ flex: 1, marginBottom: 64 }}
                      data={this.state.currentTransactions}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          onPress={() => this.onPressCategory(item)}
                        >
                          <Item>
                            <Title>{item.name}</Title>
                            <FlatList
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
                            />
                          </Item>
                        </TouchableOpacity>
                      )}
                      keyExtractor={item => item.name}
                    />
                  </ScrollView>
                </RootContainer>
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
    headerLeft: () => (
      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.setItem("userToken", "");
          await FirebaseService.signOut();
          navigation.navigate("AuthLoading");
        }}
        style={{ marginLeft: 16 }}
      >
        <Feather name="log-out" size={24} />
      </TouchableOpacity>
    ),
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
