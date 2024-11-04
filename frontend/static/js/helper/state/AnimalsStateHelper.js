const ANIMALS_KEY = "animals";

class AnimalsStateHelper {
  static setAnimals(animals) {
    localStorage.setItem(ANIMALS_KEY, JSON.stringify(animals));
  }

  static getAnimals() {
    const animals = localStorage.getItem(ANIMALS_KEY);
    return animals ? JSON.parse(animals) : [];
  }

  static deleteAnimals() {
    localStorage.removeItem(ANIMALS_KEY);
  }
}

export default AnimalsStateHelper;
