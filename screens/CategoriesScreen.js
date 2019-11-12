import * as JsSearch from "js-search";
import { Text } from "native-base";
import { stemmer } from "porter-stemmer";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, TouchableOpacity } from "react-native";
import { ActivityIndicator, Card, Searchbar, Title } from "react-native-paper";
import styled from "styled-components";
import { withFirebase } from "../shared/FirebaseContext";

const CategoriesScreen = ({ navigation, firebase }) => {
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
    const asyncFunc = async () => {
      const uid = await firebase.getCurrentUser();
      await firebase.categories(uid).on("value", snapshot => {
        const categoriesObj = snapshot.val();
        if (categoriesObj) {
          setCategories(firebase.transformObjectToArray(categoriesObj));
          setSearchResults(firebase.transformObjectToArray(categoriesObj));
        }
      });
    };
    asyncFunc();
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

  return (
    <RootView>
      <Container>
        <Searchbar
          placeholder="Search categories..."
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
              <TouchableOpacity onPress={() => onPressCategory(item.id)}>
                <Card style={{ marginBottom: 16 }}>
                  <Card.Content>
                    <Title>{item.name}</Title>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </InnerContainer>
      </Container>
    </RootView>
  );
};

const WrappedComponent = withFirebase(CategoriesScreen);

WrappedComponent.navigationOptions = {
  headerTitle: () => <Text>Categories</Text>
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
