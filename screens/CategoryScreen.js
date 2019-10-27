import { Feather } from "@expo/vector-icons";
import { H1 } from "native-base";
import React from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity
} from "react-native";
import { BarChart, ContributionGraph } from "react-native-chart-kit";
import styled from "styled-components";

class CategoryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 8 }}
        >
          <Feather name="arrow-left" size={24} />
        </TouchableOpacity>
      ),
      headerTitle: () => <Text>Plutus</Text>
    };
  };

  state = {
    category: null,
    labels: [],
    data: [],
    heatmap: [],
    loading: true
  };

  async componentDidMount() {
    const category = this.props.navigation.state.params.category;
    const labels = category.timestamps.map(t => t.date);
    const data = category.timestamps.map(t => t.amount);
    const array = [];
    category.timestamps.forEach(t => {
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
    this.setState({ labels, data, heatmap, category });
  }

  componentDidUpdate() {}

  render() {
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
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#fff",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5
    };

    return (
      <RootView>
        <Container>
          <ScrollView>
            <SafeAreaView>
              <H1 style={{ textAlign: "center", marginBottom: 8 }}>
                {this.props.navigation.state.params.category.name}
              </H1>
              <BarChart
                data={data}
                width={Dimensions.get("window").width - 20}
                height={220}
                chartConfig={chartConfig}
                style={{ marginBottom: 8 }}
              />
              <H1 style={{ textAlign: "center", marginBottom: 8 }}>
                Your Financial Activity for{" "}
                {this.props.navigation.state.params.category.name}
              </H1>
              <ContributionGraph
                values={this.state.heatmap}
                endDate={new Date()}
                numDays={100}
                width={Dimensions.get("window").width - 20}
                height={220}
                chartConfig={chartConfig}
              />
            </SafeAreaView>
          </ScrollView>
        </Container>
      </RootView>
    );
  }
}

export default CategoryScreen;

const RootView = styled.View`
  background: white;
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

const Container = styled.View`
  flex: 1;
  background-color: #f0f3f5;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 16px;
`;

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const Title = styled.Text`
  font-size: 16px;
  color: #b8bece;
  font-weight: 500;
`;

const Name = styled.Text`
  font-size: 20px;
  color: #00a86b;
  font-weight: bold;
`;

const TitleBar = styled.View`
  width: 100%;
  margin-top: 50px;
  padding-left: 80px;
`;
