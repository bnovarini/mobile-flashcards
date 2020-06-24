import React, { Component } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { white } from "../utils/colors";
import { getDecks } from "../utils/api";
import { TouchableOpacity } from "react-native-gesture-handler";
import { receiveDecks } from "../actions";
import { connect } from "react-redux";

class DeckList extends Component {
  state = {
    ready: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    getDecks()
      .then((decks) => dispatch(receiveDecks(decks)))
      .then(() => this.setState(() => ({ ready: true })));
  }

  render() {
    const { decks } = this.props;
    return (
      <View>
        <Text style={styles.title}>My Decks</Text>
        <FlatList
          data={Object.keys(decks)}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("Deck", {
                    title: item,
                  })
                }
              >
                <Text style={styles.deckHeader}>{item}</Text>
                <Text style={styles.deckSubHeader}>
                  {decks[item] && decks[item].questions
                    ? decks[item].questions.length === 1
                      ? `${decks[item].questions.length} card`
                      : `${decks[item].questions.length} cards`
                    : 0}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(title) => title}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === "ios" ? 16 : 2,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: "center",
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: "rgba(0, 0, 0, 0.24)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  title: {
    fontSize: 48,
    textAlign: "center",
  },
  deckHeader: {
    fontSize: 24,
    textAlign: "center",
  },
  deckSubHeader: {
    fontSize: 16,
    textAlign: "center",
  },
});

function mapStateToProps(decks) {
  return {
    decks,
  };
}

export default connect(mapStateToProps)(DeckList);
