import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { purple, white, gray } from "../utils/colors";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { clearLocalNotification, setLocalNotification } from "../utils/helpers";

class Quiz extends Component {
  state = {
    hasQuestions: false,
    correctAnswers: 0,
    answered: 0,
    shuffledQuestions: [],
    answer: false,
  };

  componentDidMount() {
    const { deck } = this.props;
    const hasQuestions =
      typeof deck !== undefined &&
      deck &&
      deck.questions &&
      deck.questions.length > 0;

    this.setState(() => ({
      hasQuestions,
    }));

    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    if (hasQuestions) {
      const shuffledQuestions = deck.questions
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);

      this.setState(() => ({
        shuffledQuestions,
      }));

      this.state.answered.length === this.state.shuffledQuestions.length &&
        clearLocalNotification().then(setLocalNotification);
    }
  }

  handleQuizToggle = () => {
    this.setState((currenState) => ({
      answer: !currenState.answer,
    }));
  };

  handleCorrectAnswer = () => {
    this.setState((currentState) => ({
      correctAnswers: currentState.correctAnswers + 1,
      answered: currentState.answered + 1,
      answer: false,
    }));
  };

  handleIncorrectAnswer = () => {
    this.setState((currentState) => ({
      answered: currentState.answered + 1,
      answer: false,
    }));
  };

  renderQuiz = ({ correctAnswers, answered, shuffledQuestions, answer }) => (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Answered questions: {answered}/{shuffledQuestions.length}
      </Text>
      <Text style={styles.subtitle}>
        Correctly answered: {correctAnswers}/{answered} (
        {answered === 0 ? 0 : (correctAnswers / answered) * 100}%)
      </Text>
      <TouchableOpacity onPress={this.handleQuizToggle}>
        <View style={[styles.container, styles.item]}>
          <Text
            style={[
              styles.cardInfo,
              {
                flex: 10,
                color: answer ? gray : purple,
              },
            ]}
          >
            {answer
              ? shuffledQuestions[answered].answer
              : shuffledQuestions[answered].question}
          </Text>
          <Text
            style={[
              styles.quizButtonText,
              { flex: 1, color: answer ? purple : gray },
            ]}
          >
            Click on card to view {answer ? "question" : "answer"}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={this.handleCorrectAnswer}
      >
        <Text style={styles.submitButtonText}> Correct </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.quizButton}
        onPress={this.handleIncorrectAnswer}
      >
        <Text style={styles.quizButtonText}> Incorrect </Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    const {
      hasQuestions,
      correctAnswers,
      answered,
      shuffledQuestions,
    } = this.state;

    if (hasQuestions) {
      if (hasQuestions && answered === shuffledQuestions.length) {
        return (
          <View style={styles.container}>
            <Text style={styles.title}>
              You have finished the quiz. You got {correctAnswers}{" "}
              {correctAnswers === 1 ? "answer" : "answers"} right out of{" "}
              {answered} ({(correctAnswers / answered) * 100}%)
            </Text>
          </View>
        );
      } else {
        return this.renderQuiz(this.state);
      }
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>
            This deck has no questions. Please add questions to start a quiz.
          </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    flex: 2,
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
    maxHeight: 300,
    width: 300,
  },
  title: {
    fontSize: 48,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    textAlign: "center",
    textAlignVertical: "center",
  },
  cardInfo: {
    fontSize: 24,
    textAlign: "center",
    textAlignVertical: "center",
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

export default connect(mapStateToProps)(Quiz);
