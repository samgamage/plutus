import * as JsSearch from "js-search";
import { stemmer } from "porter-stemmer";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Animated, SafeAreaView, Text } from "react-native";
import { Searchbar } from "react-native-paper";
import styled from "styled-components";
import uuid from "uuid";
import { withFirebase } from "../shared/FirebaseContext";
import * as FirebaseService from "../shared/FirebaseService";

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState("");
  const [categories, setCategories] = useState("");
  const Search = new JsSearch.Search("id");
  Search.tokenizer = new JsSearch.StemmingTokenizer(
    stemmer,
    new JsSearch.SimpleTokenizer()
  );
  Search.sanitizer = new JsSearch.LowerCaseSanitizer();
  Search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

  useEffect(() => {
    const asyncFunc = async () => {
      const c = await FirebaseService.getAllCategories();
      const categories = JSON.parse(JSON.stringify(c));

      let parsedCategories = categories;

      if (typeof categories[0].timestamps === "object") {
        parsedCategories = categories.map(c => {
          const timestamps = [];
          Object.keys(c.timestamps).map(key => {
            const [amount] = Object.values(c.timestamps[key]);
            const [date] = Object.keys(c.timestamps[key]);
            timestamps.push({ date, amount });
          });
          return { ...c, timestamps };
        });
        setCategories(parsedCategories);
        setLoading(false);
      }
    };
    asyncFunc();
  }, []);

  const initializeSearch = () => {
    Search.addIndex("name");
    Search.addIndex("CurrentAmount");
    Search.addDocuments(categories);
  };

  // const search = (q = query) => {
  //   initializeSearch();
  //   if (q.length === 0) {
  //     setSearchResults(categories);
  //   }
  // };

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

  return (
    <RootView>
      <Container>
        <Searchbar
          placeholder="Search"
          onChangeText={query => {
            setQuery(query);
          }}
          value={query}
        />
        <SafeAreaView>
          <InnerContainer>
            <Text>Search results</Text>
          </InnerContainer>
        </SafeAreaView>
      </Container>
    </RootView>
  );
};

const WrappedComponent = withFirebase(SearchScreen);

WrappedComponent.navigationOptions = {
  headerTitle: () => <Text>Plutus</Text>
};

export default WrappedComponent;

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

const InnerContainer = styled.View`
  flex: 1;
  padding-top: 16px;
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
