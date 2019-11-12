import { Feather } from "@expo/vector-icons";
import accounting from "accounting";
import { H1, H2, H3, Text } from "native-base";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { ContributionGraph, LineChart } from "react-native-chart-kit";
import {
  ActivityIndicator,
  Button,
  Modal,
  Portal,
  Title
} from "react-native-paper";
import styled from "styled-components";
import Container from "../components/Container";
import MoneyInput from "../components/MoneyInput";
import { withFirebase } from "../shared/FirebaseContext";

class CategoryScreen extends React.Component {
  state = {
    category: null,
    labels: [],
    data: [],
    heatmap: [],
    loading: true,
    visible: false,
    noTransactions: false,
    currentBudget: 0
  };

  async componentDidMount() {
    const cid = this.props.navigation.state.params.category;
    const uid = await this.props.firebase.getCurrentUser();

    await this.props.firebase.category(uid, cid).on("value", snapshot => {
      const categoryObj = snapshot.val();

      if (!categoryObj || !categoryObj.transactions) {
        this.setState({ loading: false, noTransactions: true });
        return;
      }
      const category = {
        ...categoryObj,
        transactions: Object.keys(categoryObj.transactions).map(
          key => categoryObj.transactions[key]
        )
      };
      // calculate budget from categories
      let labels = category.transactions.map(t => t.date);
      labels.length = labels.length < 4 ? labels.length : 4;
      let data = category.transactions.map(t => t.amount);
      console.log(data);
      data.length = data.length < 4 ? data.length : 4;
      const array = [];
      category.transactions.forEach(t => {
        array.push({ key: t.date, value: t.amount });
      });
      const heatmap = array.reduce((acc, curr, i) => {
        if (typeof acc[curr.key] == "undefined") {
          acc[i] = { date: curr.key, count: 1 };
        } else {
          acc[i] = { date: curr.key, count: acc[i].count + 1 };
        }

        return acc;
      }, []);
      this.setState({
        loading: false,
        currentBudget: category.budget,
        labels,
        data,
        heatmap,
        category
      });
    });
  }

  showModal = () => this.setState({ visible: true });

  hideModal = () => this.setState({ visible: false });

  onModalFormSubmit = async () => {
    if (this.state.totalBalance != 0) {
      const uid = await this.props.firebase.getCurrentUser();
      const cid = this.props.navigation.state.params.category;
      this.props.firebase
        .category(uid, cid)
        .update(
          { budget: accounting.unformat(this.state.currentBudget) },
          () => {
            this.hideModal();
          }
        );
    }
  };

  render() {
    if (this.state.loading) {
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

    if (this.state.noTransactions) {
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
              <Title style={{ textAlign: "center" }}>No transaction data</Title>
            </SafeAreaView>
          </Container>
        </Root>
      );
    }

    const data = {
      labels: this.state.labels,
      datasets: [
        {
          data: this.state.data
        }
      ]
    };

    const chartConfig = {
      backgroundGradientFrom: "#fff",
      backgroundGradientTo: "#fff",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5
    };

    const lineChartOptions = {
      low: 0,
      showArea: true
    };

    return (
      <Root>
        <ScrollView
          style={{ flex: 1, height: Dimensions.get("window").height }}
        >
          <Container>
            <H1 style={{ textAlign: "center", marginBottom: 8 }}>
              {this.state.category.name}
            </H1>
            <Flex>
              <H2 style={{ textAlign: "center", marginBottom: 8 }}>
                Budget: {accounting.formatMoney(this.state.category.budget)}
              </H2>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ visible: true });
                }}
                style={{}}
              >
                <Feather
                  name="edit-2"
                  size={24}
                  style={{ marginLeft: 8, color: "gray" }}
                />
              </TouchableOpacity>
            </Flex>
            <LineChart
              data={data}
              width={Dimensions.get("window").width - 32} // from react-native
              height={220}
              yAxisLabel={"$"}
              fromZero
              verticalLabelRotation={-45}
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ddd"
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 8
              }}
            />
            <H3 style={{ textAlign: "center", marginTop: 8 }}>
              Your Financial Activity for {this.state.category.name}
            </H3>
            <ContributionGraph
              values={this.state.heatmap}
              endDate={new Date()}
              numDays={84}
              width={Dimensions.get("window").width - 36}
              height={220}
              chartConfig={chartConfig}
              style={{
                borderRadius: 8,
                marginVertical: 8
              }}
            />
          </Container>
          <Portal>
            <Modal
              visible={this.state.visible}
              onDismiss={() => this.setState({ visible: false })}
              dismissable={true}
            >
              <ModalContainer>
                <H3 style={{ marginBottom: 8 }}>
                  Set budget for {this.state.category.name}
                </H3>
                <MoneyInput
                  value={this.state.currentBudget}
                  onChangeText={text => {
                    this.setState({ currentBudget: text });
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
        </ScrollView>
      </Root>
    );
  }
}

const WrappedComponent = withFirebase(CategoryScreen);

WrappedComponent.navigationOptions = ({ navigation }) => ({
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 8 }}
    >
      <Feather name="arrow-left" size={24} />
    </TouchableOpacity>
  ),
  headerTitle: () => <Text>Plutus</Text>
});

export default WrappedComponent;

const Root = styled.View`
  flex: 1;
  background: #f0f3f5;
  margin-bottom: 60px;
`;

const Subtitle = styled.Text`
  color: #b8bece;
  font-weight: 600;
  font-size: 15px;
  margin-left: 20px;
  margin-top: 10px;
  text-transform: uppercase;
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
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

const Flex = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
`;
