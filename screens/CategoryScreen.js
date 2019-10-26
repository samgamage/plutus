import { Feather } from "@expo/vector-icons";
import { H1 } from "native-base";
import React from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity
} from "react-native";
import { BarChart, ContributionGraph } from "react-native-chart-kit";
import { connect } from "react-redux";
import styled from "styled-components";
import uuid from "uuid";

function mapStateToProps(state) {
  return { action: state.action, name: state.name };
}

function mapDispatchToProps(dispatch) {
  return {
    // openMenu: () =>
    //   dispatch({
    //     type: "OPEN_MENU"
    //   })
  };
}

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
    category,
    labels: [],
    data: [],
    heatmap: []
  };

  componentDidMount() {
    console.log(this.props.navigation.state.params.id);
    const labels = Object.keys(category.Food.timestamps);
    const data = Object.values(category.Food.timestamps);
    const array = [];
    Object.keys(category.Food.timestamps).forEach(key => {
      array.push({ key, value: category.Food.timestamps[key] });
    });
    const heatmap = array.reduce((acc, curr, i) => {
      if (typeof acc[curr.key] == "undefined") {
        acc[i] = { date: curr.key, count: 1 };
      } else {
        acc[i] = { date: curr.key, count: acc[i].count + 1 };
      }

      return acc;
    }, []);
    this.setState({ labels, data, heatmap });
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
          <SafeAreaView>
            <H1 style={{ textAlign: "center", marginBottom: 8 }}>
              {category.Food.name}
            </H1>
            <BarChart
              data={data}
              width={Dimensions.get("window").width - 20}
              height={220}
              chartConfig={chartConfig}
              style={{ marginBottom: 8 }}
            />
            <H1 style={{ textAlign: "center", marginBottom: 8 }}>
              Your Activity for {category.Food.name}
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
        </Container>
      </RootView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryScreen);

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

const category = {
  Food: {
    name: "Food",
    id: uuid.v4(),
    currentAmount: 1200,
    totalAmount: 2000,
    timestamps: {
      "2019-10-13": 20,
      "2019-10-14": 50,
      "2019-10-15": 120,
      "2019-10-16": 120
    }
  }
};
