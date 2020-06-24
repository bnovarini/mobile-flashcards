import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { purple } from "../utils/colors";
import { addCardToDeck } from "../utils/api";
import { connect } from "react-redux";
import { addQuestion } from "../actions";

class NewQuestion extends Component {
  state = {
    question: "",
    answer: "",
  };

  handleQuestionChange = (text) =>
    this.setState(() => ({
      question: text,
    }));

  handleAnswerChange = (text) =>
    this.setState(() => ({
      answer: text,
    }));

  handleAddQuestion = () => {
    const { question, answer } = this.state;
    const { deck, dispatch } = this.props;
    const card = {
      question: question,
      answer: answer,
    };

    dispatch(addQuestion(deck.title, card));

    addCardToDeck(deck.title, card);

    this.props.navigation.navigate("Deck", {
      title: this.props.deck.title,
    });

    this.setState(() => ({
      question: "",
      answer: "",
    }));
  };

  render() {
    const { question, answer } = this.state;
    this.props.navigation.setOptions({
      title: "New Question",
    });

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
      >
        <TextInput
          style={styles.input}
          placeholder="Insert question"
          value={question}
          onChangeText={this.handleQuestionChange}
        />
        <TextInput
          style={styles.input}
          placeholder="Insert answer"
          value={answer}
          onChangeText={this.handleAnswerChange}
        />
        <TouchableOpacity
          style={[
            styles.submitButton,
            { opacity: question === "" || answer === "" ? 0.5 : 1 },
          ]}
          onPress={() => this.handleAddQuestion()}
          disabled={question === "" || answer === ""}
        >
          <Text style={styles.submitButtonText}> Submit </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
  input: {
    margin: 15,
    height: 40,
    width: 300,
    borderColor: purple,
    borderWidth: 1,
    borderRadius: 4,
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
    color: "white",
    textAlign: "center",
  },
});

function mapStateToProps(decks, { route }) {
  const { title } = route.params;

  return {
    deck: decks[title],
  };
}

export default connect(mapStateToProps)(NewQuestion);
