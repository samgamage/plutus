import { Feather } from "@expo/vector-icons";
import accounting from "accounting";
import { H1, H3 } from "native-base";
import React from "react";
import { AsyncStorage, FlatList, SafeAreaView, Text } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Modal, Portal, ProgressBar, Title } from "react-native-paper";
import styled from "styled-components";
import Container from "../components/Container";
import MoneyInput from "../components/MoneyInput";
import * as UserActions from "../redux/actions/UserActions";
import * as FirebaseService from "../shared/FirebaseService";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories,
      selectedStartDate: null,
      visible: false,
      totalBalance: 0
    };

    // this.props.store.dispatch(UserActions.getUser(''));
  }

  static navigationOptions = {
    headerTitle: () => <Text>Plutus</Text>
  };

  testLogin = () => {
    UserActions.dispatch();
  };

  async componentDidMount() {
    const isNewUser = await this.isNewUser();
    if (isNewUser === "unseen" || isNewUser === null) {
      this.showModal();
    }
  }

  componentDidUpdate() {}

  onPressAddCategory = () => {
    this.props.navigation.navigate("Add");
  };

  onPressCategory = id => {
    this.props.navigation.navigate("Category", {
      id
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
    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : "";

    return (
      <React.Fragment>
        <RootView>
          <Container>
            <SafeAreaView>
              <RootContainer>
                <Button
                  onPress={() => {
                    FirebaseService.signOut();
                    this.props.navigation.navigate("AuthLoading");
                  }}
                >
                  Sign out
                </Button>
                <CalendarPicker
                  selectedDayColor="#00a86b"
                  selectedDayTextColor="white"
                  onDateChange={this.onDateChange}
                />
                <SpaceBetween>
                  <H1 style={{ marginBottom: 16 }}>Categories</H1>
                  <TouchableOpacity
                    onPress={this.onPressAddCategory}
                    style={{
                      margin: "auto",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <Feather name="plus-circle" size={24} />
                  </TouchableOpacity>
                </SpaceBetween>
                <FlatList
                  data={this.state.categories}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => this.onPressCategory(item.id)}
                    >
                      <Item>
                        <Title>{item.name}</Title>
                        <Text>
                          {accounting.formatMoney(item.currentAmount)} /{" "}
                          {accounting.formatMoney(item.totalAmount)}
                        </Text>
                        <ProgressBar
                          progress={item.currentAmount / item.totalAmount}
                          color="#00a86b"
                          style={{ marginTop: 8 }}
                        />
                      </Item>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.id}
                />
              </RootContainer>
            </SafeAreaView>
            <Portal>
              <Modal visible={this.state.visible} dismissable={true}>
                <ModalContainer>
                  <H1>Thanks for joing Plutus!</H1>
                  <Text style={{ marginBottom: 8 }}>
                    Before we let you free, we need some more information to get
                    started.
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
          </Container>
        </RootView>
      </React.Fragment>
    );
  }
}

export default HomeScreen;

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
