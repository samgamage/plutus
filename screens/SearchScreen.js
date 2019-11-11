import accounting from "accounting";
import * as JsSearch from "js-search";
import { Text } from "native-base";
import { stemmer } from "porter-stemmer";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, TouchableOpacity } from "react-native";
import { ActivityIndicator, Searchbar, Title } from "react-native-paper";
import styled from "styled-components";
import { withFirebase } from "../shared/FirebaseContext";

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const Search = new JsSearch.Search("name");
  Search.tokenizer = new JsSearch.StemmingTokenizer(
    stemmer,
    new JsSearch.SimpleTokenizer()
  );
  Search.sanitizer = new JsSearch.LowerCaseSanitizer();
  Search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

  useEffect(() => {
    // const asyncFunc = async () => {
    //   if (
    //     categories &&
    //     typeof categories === "array" &&
    //     categories.length > 0 &&
    //     categories[0].timestamps &&
    //     typeof categories[0].timestamps === "object"
    //   ) {
    //     parsedCategories = categories.map(c => {
    //       const timestamps = [];
    //       Object.keys(c.timestamps).map(key => {
    //         const [amount] = Object.values(c.timestamps[key]);
    //         const [date] = Object.keys(c.timestamps[key]);
    //         timestamps.push({ date, amount });
    //       });
    //       return { ...c, timestamps };
    //     });
    //     setCategories(parsedCategories);
    //     setSearchResults(parsedCategories);
    //   }
    //   setLoading(false);
    // };
    // asyncFunc();
    setLoading(false);
  }, []);

  const initializeSearch = () => {
    Search.addIndex("name");
    Search.addDocuments(categories);
  };

  const search = (q = query) => {
    initializeSearch();
    if (q.length === 0 || !q) {
      setSearchResults(categories);
      return;
    }
    const results = Search.search(q);
    setSearchResults(results);
  };

  const onPressCategory = category => {
    navigation.navigate("Category", {
      category
    });
  };

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

  console.log(searchResults);

  return (
    <RootView>
      <Container>
        <Searchbar
          placeholder="Search"
          onChangeText={query => {
            setQuery(query);
            search(query);
          }}
          value={query}
        />
        <InnerContainer>
          <FlatList
            style={{ flex: 1, marginBottom: 64 }}
            data={searchResults}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onPressCategory(item)}>
                <Item>
                  <Title>{item.name}</Title>
                  <FlatList
                    data={item.timestamps}
                    renderItem={({ item }) => (
                      <SpaceBetween>
                        <Text>{item.date}</Text>
                        <Text>{accounting.formatMoney(item.amount)}</Text>
                      </SpaceBetween>
                    )}
                    keyExtractor={(item, i) => item.date + i}
                  />
                </Item>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.name}
          />
        </InnerContainer>
      </Container>
    </RootView>
  );
};

const WrappedComponent = withFirebase(SearchScreen);

WrappedComponent.navigationOptions = {
  headerTitle: () => <Text>Search</Text>
};

export default WrappedComponent;

const RootView = styled.View`
  background: white;
  flex: 1;
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

const SpaceBetween = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Item = styled.View`
  margin-bottom: 16px;
  background-color: white;
  padding: 16px;
  border-radius: 8px;
`;
