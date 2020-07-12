class Animal {
    constructor(species, health) {
        this.species = species;
        this.health = health;
    }
}

class Human extends Animal {
    constructor(species, health, alive) {
        super(species, health);
        this.alive = alive;
    }
}

class Dog extends Animal {
    constructor(species, health, damage) {
        super(species, health);
        this.damage = damage;
    }
    bite (obj) {
        if (this.damage >= obj.health) {
            obj.alive = false;
            console.log("dog killed this person!")
        } else {
            obj.health -= this.damage;
            console.log("dog bite this person, this person's health reduce to ${obj.health}")
        }
    }
}

let human = new Human("person", 70, true);
let dog = new Dog("dog", 100, 80);
dog.bite(human)
human.health = 100, human.alive = true;
dog.bite(human);
