import { Feather } from "@expo/vector-icons";
import accounting from "accounting";
import { H1, H3 } from "native-base";
import React from "react";
import {
  AsyncStorage,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Modal, Portal, ProgressBar, Title } from "react-native-paper";
import styled from "styled-components";
import Container from "../components/Container";
import MoneyInput from "../components/MoneyInput";
import VoiceRecognition from "../components/VoiceRecognition";
import * as UserActions from "../redux/actions/UserActions";
import { withFirebase } from "../shared/FirebaseContext";
import * as FirebaseService from "../shared/FirebaseService";

class HomeScreen extends React.Component {
  state = {
    categories: [],
    selectedStartDate: null,
    visible: false,
    totalBalance: 0,
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
    const categories = await FirebaseService.getAllCategories();
    this.setState({ categories });
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
    console.log(this.state.categories);

    return (
      <React.Fragment>
        <ScrollView>
          <RootView>
            <Container>
              <SafeAreaView>
                <RootContainer>
                  <CalendarPicker
                    selectedDayColor="#00a86b"
                    selectedDayTextColor="white"
                    onDateChange={this.onDateChange}
                    selectedStartDate={new Date()}
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
                  <ScrollView>
                    <FlatList
                      style={{ flex: 1, marginBottom: 64 }}
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
