import { Feather } from "@expo/vector-icons";
import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import AddScreen from "../screens/AddScreen";
import CategoryScreen from "../screens/CategoryScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import Typography from "../typography";

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Category: CategoryScreen
});

HomeStack.navigationOptions = ({ navigation }) => {
  var tabBarVisible = true;
  const routeName = navigation.state.routes[navigation.state.index].routeName;

  // define which views show navigation bar based on route name

  return {
    tabBarVisible,
    tabBarLabel: "Home",
    tabBarIcon: ({ focused }) => (
      <Feather
        name="grid"
        size={26}
        color={focused ? Typography.activeColor : Typography.inactiveColor}
      />
    )
  };
};

const AddStack = createStackNavigator({
  Courses: AddScreen
});

AddStack.navigationOptions = {
  tabBarLabel: "Add",
  headerTitle: () => (
    <View>
      <Text>Plutus</Text>
    </View>
  ),
  tabBarIcon: ({ focused }) => (
    <Feather
      name="plus-circle"
      size={26}
      color={focused ? Typography.activeColor : Typography.inactiveColor}
    />
  )
};

const ProfileStack = createStackNavigator({
  Projects: ProfileScreen
});

ProfileStack.navigationOptions = {
  tabBarLabel: "User",
  tabBarIcon: ({ focused }) => (
    <Feather
      name="user"
      size={26}
      color={focused ? Typography.activeColor : Typography.inactiveColor}
    />
  )
};

const TabNavigator = createBottomTabNavigator(
  {
    HomeStack,
    AddStack,
    ProfileStack
  },
  {
    tabBarPosition: "bottom",
    animationEnabled: true,
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      showIndicator: false,
      titleStyle: {
        justifyContent: "center",
        alignItems: "center"
      },
      style: {
        borderWidth: 0,
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "white",
        borderColor: "rgb(27, 42, 51)",
        shadowColor: "red",
        elevation: 2
      },
      activeBackgroundColor: "white",
      inactiveBackgroundColor: "white",
      labelStyle: {
        fontSize: 14,
        color: "#fff",
        position: "relative",
        alignSelf: "center"
      },
      iconStyle: {
        marginBottom: 5,
        marginTop: 5
      },
      tabStyle: {
        justifyContent: "center",
        alignItems: "center"
      },
      indicatorStyle: {
        backgroundColor: "transparent"
      }
    }
  }
);

const RootStack = createStackNavigator(
  {
    Tab: TabNavigator,
    Home: HomeScreen,
    Category: CategoryScreen
  },
  {
    defaultNavigationOptions: () => {
      return { header: null };
    }
  }
);

export default RootStack;
