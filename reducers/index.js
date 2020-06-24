import { RECEIVE_DECKS, ADD_DECK, ADD_QUESTION, REMOVE_DECK } from "../actions";

function decks(state = {}, action) {
  switch (action.type) {
    case RECEIVE_DECKS:
      return {
        ...state,
        ...action.decks,
      };
    case ADD_DECK:
      return {
        ...state,
        ...action.deck,
      };
    case ADD_QUESTION:
      return {
        ...state,
        [action.title]: {
          ...state[action.title],
          questions: state[action.title].questions.concat(action.card),
        },
      };
    case REMOVE_DECK:
      delete state[action.title];
      return {
        ...state,
      };
    default:
      return state;
  }
}

export default decks;
