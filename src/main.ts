import type { House, Wizard, SpellCastEvent } from "./types";
import { WizardRepository, SpellRepository } from "./repository";
import { Cache } from "./decorators";

//  ajouter un sorcier
console.log("\n=== Exercice 1 : ajouter un sorcier ===");
const wizards = new WizardRepository();
console.log(wizards.addWizard({ name: "Harry Potter", house: "Gryffindor" }));
wizards.addWizard({ name: "Hermione Granger", house: "Gryffindor" });
wizards.addWizard({ name: "Draco Malfoy", house: "Slytherin" });
wizards.addWizard({ name: "Luna Lovegood", house: "Ravenclaw" });

// filtrer par maison 
console.log("\n=== Exercice 2 : filtrer par maison ===");
console.log("Gryffindor :", wizards.findByHouse("Gryffindor"));
console.log("Slytherin :", wizards.findByHouse("Slytherin"));

// Extract 
console.log("\n=== Exercice 3 : Extract ===");
function handleSpellCast(event: SpellCastEvent): void {
  console.log(`Wizard ${event.wizardId} cast ${event.spellName}`);
}

handleSpellCast({
  type: "spell-cast",
  wizardId: 1,
  spellName: "Expelliarmus"
});

//  : ValidateSpellPower
console.log("\n=== Exercice 4 : ValidateSpellPower ===");
const spells = new SpellRepository();

spells.add({ id: 102, name: "Protego", category: "defense", power: 50 });

try {
  spells.add({ id: 103, name: "Invalid Spell", category: "attack", power: -10 });
} catch (error) {
  console.log("Erreur attendue :", (error as Error).message);
}

console.log("Sorts enregistrés :", spells.getAll());

//  décorateur Cache 
console.log("\n=== Exercice 5 : Cache ===");
class SpellCalculator {
  @Cache
  calculatePower(basePower: number, multiplier: number): number {
    console.log("Calculating...");
    return basePower * multiplier;
  }
}

const calculator = new SpellCalculator();

console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(5, 2));

//  Type Guard strict 
console.log("\n=== Exercice 6 : Type Guard ===");
const validHouses: readonly House[] = [
  "Gryffindor",
  "Slytherin",
  "Ravenclaw",
  "Hufflepuff"
];

function isHouse(value: unknown): value is House {
  return (
    typeof value === "string" &&
    validHouses.some(house => house === value)
  );
}

function isWizard(value: unknown): value is Wizard {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    isHouse(candidate.house)
  );
}

const validData: unknown = {
  id: 1,
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true
};

const invalidData: unknown = {
  id: 2,
  name: "Viktor",
  house: "Durmstrang",
  level: 5,
  active: true
};

console.log(isWizard(validData));   // true
console.log(isWizard(invalidData)); // false