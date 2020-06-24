import React, { Component } from "react";
import "react-native-gesture-handler";
import { Platform, StyleSheet, Text, View, StatusBar } from "react-native";
import Constants from "expo-constants";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { createStore } from "redux";
import reducer from "../reducers";
import { Provider } from "react-redux";
import middleware from "../middleware";
import { getDecks } from "../utils/api";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { purple, white } from "../utils/colors";
import { setLocalNotification } from "../utils/helpers";
import NewQuestion from "./NewQuestion";
import NewDeck from "./NewDeck";
import Deck from "./Deck";
import DeckList from "./DeckList";
import Quiz from "./Quiz";

function MyStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}

const Tabs =
  Platform.OS === "ios"
    ? createBottomTabNavigator()
    : createMaterialTopTabNavigator();

const TabNav = () => (
  <Tabs.Navigator
    initialRouteName="DeckList"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let icon;
        if (route.name === "Decks") {
          icon = (
            <MaterialCommunityIcons name="cards" size={size} color={color} />
          );
        } else if (route.name === "Add Deck") {
          icon = <Feather name="plus-square" size={size} color={color} />;
        }
        return icon;
      },
    })}
    tabBarOptions={{
      header: null,
      activeTintColor: Platform.OS === "ios" ? purple : white,
      showIcon: true,
      style: {
        height: 80,
        backgroundColor: Platform.OS === "ios" ? white : purple,
        shadowColor: "rgba(0, 0, 0, 0.24)",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 6,
        shadowOpacity: 1,
      },
    }}
  >
    <Tabs.Screen name="Decks" component={DeckList} />
    <Tabs.Screen name="Add Deck" component={NewDeck} />
  </Tabs.Navigator>
);

const Stack = createStackNavigator();
const MainNav = () => (
  <Stack.Navigator headerMode="screen">
    <Stack.Screen
      name="Home"
      component={TabNav}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Deck"
      component={Deck}
      options={{
        headerTintColor: white,
        headerStyle: {
          backgroundColor: purple,
        },
      }}
    />
    <Stack.Screen
      name="NewQuestion"
      component={NewQuestion}
      options={{
        headerTintColor: white,
        headerStyle: {
          backgroundColor: purple,
        },
      }}
    />
    <Stack.Screen
      name="Quiz"
      component={Quiz}
      options={{
        headerTintColor: white,
        headerStyle: {
          backgroundColor: purple,
        },
      }}
    />
  </Stack.Navigator>
);

export default class App extends Component {
  componentDidMount() {
    setLocalNotification();
  }

  render() {
    return (
      <Provider store={createStore(reducer, middleware)}>
        <View style={{ flex: 1 }}>
          <NavigationContainer>
            <MyStatusBar backgroundColor={purple} barStyle="light-content" />
            <MainNav />
          </NavigationContainer>
        </View>
      </Provider>
    );
  }
}
