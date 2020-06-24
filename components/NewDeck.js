import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { purple } from "../utils/colors";
import { saveDeckTitle, newDeckObject } from "../utils/api";
import { connect } from "react-redux";
import { addDeck } from "../actions";

class NewDeck extends Component {
  state = {
    title: "",
  };

  handleTitleChange = (text) =>
    this.setState(() => ({
      title: text,
    }));

  handleAddDeck = () => {
    const { title } = this.state;
    const { dispatch, decks } = this.props;

    if (!(title in decks)) {
      dispatch(addDeck({ [title]: newDeckObject(title) }));

      saveDeckTitle(title);

      this.props.navigation.navigate("Deck", {
        title: title,
      });

      this.setState(() => ({
        title: "",
      }));
    } else {
      alert("This deck title already exists. Try a different title.");
    }
  };

  render() {
    const { title } = this.state;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
      >
        <Text style={styles.title}>What is the title of your new deck?</Text>
        <TextInput
          style={styles.input}
          placeholder="Deck Title"
          value={title}
          onChangeText={this.handleTitleChange}
        />
        <TouchableOpacity
          style={[styles.submitButton, { opacity: title === "" ? 0.5 : 1 }]}
          onPress={this.handleAddDeck}
          disabled={title === ""}
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
  title: {
    fontSize: 32,
    textAlign: "center",
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

function mapStateToProps(decks) {
  return {
    decks,
  };
}

export default connect(mapStateToProps)(NewDeck);
