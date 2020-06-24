import { AsyncStorage } from "react-native";

const DECK_STORAGE_KEY = "MobileFlashcards:decks";

export function newDeckObject(title) {
  return {
    title: title,
    questions: [],
  };
}

export function clearAll() {
  return AsyncStorage.clear()
    .then(() => console.log("Done"))
    .catch((e) => console.warn("Error clearing AsyncStorage", e));
}

export function getDecks() {
  return AsyncStorage.getItem(DECK_STORAGE_KEY).then((data) =>
    data != null ? JSON.parse(data) : null
  );
}

export function getDeck(title) {
  return AsyncStorage.getItem(DECK_STORAGE_KEY).then((data) =>
    JSON.parse(data)[title] != null ? JSON.parse(data)[title] : null
  );
}

export function saveDeckTitle(title) {
  return AsyncStorage.mergeItem(
    DECK_STORAGE_KEY,
    JSON.stringify({ [title]: newDeckObject(title) })
  );
}

export function removeDeck(title) {
  return AsyncStorage.getItem(DECK_STORAGE_KEY).then((data) => {
    const dataJSON = JSON.parse(data);
    dataJSON[title] = undefined;
    delete dataJSON[title];
    AsyncStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(dataJSON));
  });
}

export function addCardToDeck(title, card) {
  return AsyncStorage.getItem(DECK_STORAGE_KEY).then((data) =>
    AsyncStorage.setItem(
      DECK_STORAGE_KEY,
      JSON.stringify(
        JSON.parse(data)[title] != null
          ? {
              ...JSON.parse(data),
              [title]: {
                ...JSON.parse(data)[title],
                questions: JSON.parse(data)[title].questions.concat(card),
              },
            }
          : JSON.parse(data)
      )
    )
  );
}
