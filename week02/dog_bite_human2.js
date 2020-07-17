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
	getDamage(attacker) {
		if (attacker.damage >= this.health) {
			this.alive = false;
			console.log(`this human was killed by a ${attacker.species}!`)
		} else {
			this.health -= attacker.damage;
			console.log(`this human was attacked by a ${attacker.species}, his health was ${this.health} now.`)
		}
	}
}

class Dog extends Animal {
	constructor(species, health, damage) {
		super(species, health);
		this.damage = damage;
	}
	bite () {
		return {
			species: this.species,
			damage: this.damage
		}
	}
}

let human = new Human("person", 70, true);
let dog = new Dog("dog", 100, 80);
human.getDamage(dog.bite())
human.health = 100, human.alive = true;
human.getDamage(dog.bite())
