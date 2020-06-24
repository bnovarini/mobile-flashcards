import React, { Component } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { purple, white } from "../utils/colors";
import { removeDeck } from "../utils/api";
import { removeDeckAction } from "../actions";
import { connect } from "react-redux";

class Deck extends Component {
  setTitle = (title) => {
    if (!title) return;

    this.props.navigation.setOptions({
      title: title,
    });
  };

  handleAddCardButton = () => {
    this.props.navigation.navigate("NewQuestion", {
      title: this.props.deck.title,
    });
  };

  handleQuizButton = () => {
    this.props.navigation.navigate("Quiz", {
      title: this.props.deck.title,
    });
  };

  handleRemoveDeck = () => {
    const { dispatch, deck } = this.props;

    dispatch(removeDeckAction(deck.title));
    removeDeck(deck.title);

    this.props.navigation.navigate("Home");
  };

  render() {
    const { deck } = this.props;
    this.setTitle(deck !== null ? deck.title : "My Deck");

    return (
      <View behavior="padding" style={styles.container}>
        <Text style={styles.title}>{deck !== null && deck.title}</Text>
        <Text style={styles.subtitle}>
          {deck !== null && deck.questions ? deck.questions.length : 0} cards
        </Text>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={this.handleAddCardButton}
        >
          <Text style={styles.submitButtonText}> Add Card </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quizButton}
          onPress={this.handleQuizButton}
        >
          <Text style={styles.quizButtonText}> Start Quiz </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingTop: 40 }}
          onPress={this.handleRemoveDeck}
        >
          <Text style={styles.quizButtonText}> Remove Deck </Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 48,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: purple,
    padding: 10,
    margin: 15,
    height: 40,
    width: 150,
    borderRadius: 4,
  },
  submitButtonText: {
    color: white,
    textAlign: "center",
  },
  quizButton: {
    backgroundColor: white,
    padding: 10,
    margin: 15,
    height: 40,
    width: 150,
    borderRadius: 4,
  },
  quizButtonText: {
    color: purple,
    textAlign: "center",
  },
});

function mapStateToProps(decks, { route }) {
  const { title } = route.params;

  return {
    deck: typeof decks[title] === "undefined" ? null : decks[title],
  };
}

export default connect(mapStateToProps)(Deck);
