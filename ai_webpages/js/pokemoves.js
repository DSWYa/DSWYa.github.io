const pokemonMoves = {
    Gen1: {
        Bulbasaur: {
            base: ['Tackle', 'Growl', 'Vine Whip'],
            firstEvolution: ['Razor Leaf', 'Poisonpowder', 'Sleep Powder', 'Take Down'],
            finalEvolution: ['Solar Beam', 'Synthesis', 'Growth', 'Earthquake']
        },
        Charmander: {
            base: ['Scratch', 'Growl', 'Ember'],
            firstEvolution: ['Flame Burst', 'Dragon Rage', 'Fire Fang', 'Smokescreen'],
            finalEvolution: ['Flamethrower', 'Dragon Claw', 'Fire Blast', 'Blast Burn']
        },
        Squirtle: {
            base: ['Tackle', 'Tail Whip', 'Water Gun'],
            firstEvolution: ['Bubble Beam', 'Withdraw', 'Water Pulse', 'Bite'],
            finalEvolution: ['Hydro Pump', 'Ice Beam', 'Skull Bash', 'Rain Dance']
        }
    },
    Gen2: {
        Chikorita: {
            base: ['Tackle', 'Growl', 'Razor Leaf'],
            firstEvolution: ['Poisonpowder', 'Synthesis', 'Magical Leaf', 'Body Slam'],
            finalEvolution: ['Solar Beam', 'Petal Dance', 'Light Screen', 'Leaf Storm']
        },
        Cyndaquil: {
            base: ['Tackle', 'Leer', 'Ember'],
            firstEvolution: ['Swift', 'Flame Wheel', 'Quick Attack', 'Smokescreen'],
            finalEvolution: ['Flamethrower', 'Eruption', 'Focus Blast', 'Wild Charge']
        },
        Totodile: {
            base: ['Scratch', 'Leer', 'Water Gun'],
            firstEvolution: ['Bite', 'Ice Punch', 'Water Pulse', 'Slash'],
            finalEvolution: ['Hydro Pump', 'Crunch', 'Dragon Dance', 'Aqua Tail']
        }
    },
    Gen3: {
        Treecko: {
            base: ['Pound', 'Leer', 'Absorb'],
            firstEvolution: ['Mega Drain', 'Quick Attack', 'Pursuit', 'Leaf Blade'],
            finalEvolution: ['Leaf Storm', 'Dragon Pulse', 'Focus Blast', 'Solar Beam']
        },
        Torchic: {
            base: ['Scratch', 'Growl', 'Ember'],
            firstEvolution: ['Flame Charge', 'Focus Energy', 'Peck', 'Fight'],
            finalEvolution: ['Blaze Kick', 'Brave Bird', 'Flare Blitz', 'Close Combat']
        },
        Mudkip: {
            base: ['Tackle', 'Growl', 'Water Gun'],
            firstEvolution: ['Mud Shot', 'Ice Punch', 'Water Pulse', 'Protect'],
            finalEvolution: ['Hydro Pump', 'Earthquake', 'Waterfall', 'Rock Slide']
        }
    },
    Gen4: {
        Turtwig: {
            base: ['Tackle', 'Growl', 'Absorb'],
            firstEvolution: ['Razor Leaf', 'Bite', 'Curse', 'Synthesis'],
            finalEvolution: ['Leaf Storm', 'Wood Hammer', 'Earthquake', 'Stone Edge']
        },
        Chimchar: {
            base: ['Scratch', 'Leer', 'Ember'],
            firstEvolution: ['Flame Wheel', 'Mach Punch', 'Power-Up Punch', 'Fury Swipes'],
            finalEvolution: ['Flare Blitz', 'Close Combat', 'Thunder Punch', 'Blast Burn']
        },
        Piplup: {
            base: ['Pound', 'Growl', 'Water Gun'],
            firstEvolution: ['Bubble Beam', 'Metal Claw', 'Wing Attack', 'Fury Attack'],
            finalEvolution: ['Hydro Pump', 'Ice Beam', 'Drill Peck', 'Flash Cannon']
        }
    },
    Gen5: {
        Snivy: {
            base: ['Tackle', 'Leer', 'Vine Whip'],
            firstEvolution: ['Leaf Tornado', 'Slam', 'Leaf Blade', 'Aerial Ace'],
            finalEvolution: ['Leaf Storm', 'Coil', 'Giga Drain', 'Dragon Pulse']
        },
        Tepig: {
            base: ['Tackle', 'Tail Whip', 'Ember'],
            firstEvolution: ['Flame Charge', 'Arm Thrust', 'Take Down', 'Defense Curl'],
            finalEvolution: ['Flare Blitz', 'Head Smash', 'Wild Charge', 'Heat Crash']
        },
        Oshawott: {
            base: ['Tackle', 'Tail Whip', 'Water Gun'],
            firstEvolution: ['Water Pulse', 'Razor Shell', 'Fury Cutter', 'Focus Energy'],
            finalEvolution: ['Hydro Pump', 'Razor Shell', 'Megahorn', 'Retaliate']
        }
    },
    Gen6: {
        Chespin: {
            base: ['Tackle', 'Growl', 'Vine Whip'],
            firstEvolution: ['Needle Arm', 'Bite', 'Take Down', 'Pin Missile'],
            finalEvolution: ['Wood Hammer', 'Spiky Shield', 'Brick Break', 'Stone Edge']
        },
        Fennekin: {
            base: ['Scratch', 'Tail Whip', 'Ember'],
            firstEvolution: ['Flame Charge', 'Psybeam', 'Light Screen', 'Fire Spin'],
            finalEvolution: ['Flamethrower', 'Psychic', 'Mystical Fire', 'Focus Blast']
        },
        Froakie: {
            base: ['Pound', 'Growl', 'Water Gun'],
            firstEvolution: ['Water Pulse', 'Quick Attack', 'Double Team', 'Cut'],
            finalEvolution: ['Hydro Pump', 'Night Slash', 'Dark Pulse', 'Mat Block']
        }
    },
    Gen7: {
        Rowlet: {
            base: ['Tackle', 'Growl', 'Peck'],
            firstEvolution: ['Razor Leaf', 'Leaf Blade', 'Air Slash', 'Shadow Sneak'],
            finalEvolution: ['Spirit Shackle', 'Brave Bird', 'Leaf Blade', 'Solar Blade']
        },
        Litten: {
            base: ['Scratch', 'Growl', 'Ember'],
            firstEvolution: ['Fire Fang', 'Fury Swipes', 'Bite', 'Double Kick'],
            finalEvolution: ['Darkest Lariat', 'Throat Chop', 'Flare Blitz', 'Fire Punch']
        },
        Popplio: {
            base: ['Pound', 'Growl', 'Water Gun'],
            firstEvolution: ['Disarming Voice', 'Aqua Jet', 'Baby-Doll Eyes', 'Double Slap'],
            finalEvolution: ['Hydro Pump', 'Moonblast', 'Ice Beam', 'Hyper Voice']
        }
    },
    Gen8: {
        Grookey: {
            base: ['Pound', 'Growl', 'Branch Poke'],
            firstEvolution: ['Razor Leaf', 'Knock Off', 'Rillaboom Drum Beating', 'Seed Bomb'],
            finalEvolution: ['Wood Hammer', 'Grassy Glide', 'Superpower', 'U-turn']
        },
        Scorbunny: {
            base: ['Tackle', 'Growl', 'Quick Attack'],
            firstEvolution: ['Flame Charge', 'Double Kick', 'Counter', 'Low Kick'],
            finalEvolution: ['Pyro Ball', 'Blaze Kick', 'Close Combat', 'Electro Ball']
        },
        Sobble: {
            base: ['Pound', 'Growl', 'Water Gun'],
            firstEvolution: ['Water Pulse', 'Leaf Storm', 'Snipe Shot', 'Draining Kiss'],
            finalEvolution: ['Hydro Pump', 'Liquidation', 'Dark Pulse', 'Air Slash']
        }
    }
};
document.addEventListener('DOMContentLoaded', () => {
    const generationTabs = document.querySelectorAll('.generation-tabs button');
    const starterButtons = document.getElementById('starterButtons');

    // Default to Gen 1 on load
    loadStarters('Gen1');
    generationTabs[0].classList.add('active');

    // Generation tab click event
    generationTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            generationTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Load starters for selected generation
            loadStarters(`Gen${this.dataset.gen}`);
        });
    });

    // Dynamically load starters for a generation
    function loadStarters(generation) {
        // Clear previous starter buttons
        starterButtons.innerHTML = '';

        // Get starters for the selected generation
        const starters = Object.keys(pokemonMoves[generation]);

        // Create buttons for each starter
        starters.forEach(starter => {
            const button = document.createElement('button');
            button.textContent = starter;
            button.addEventListener('click', () => displayMoves(generation, starter));
            starterButtons.appendChild(button);
        });
    }

    function displayMoves(generation, pokemon) {
        document.getElementById('pokemon-name').textContent = `${pokemon}'s Best Moves`;
        
        const baseMovesList = document.getElementById('base-moves');
        const firstEvolutionMovesList = document.getElementById('first-evolution-moves');
        const finalEvolutionMovesList = document.getElementById('final-evolution-moves');
        
        // Clear previous moves
        [baseMovesList, firstEvolutionMovesList, finalEvolutionMovesList].forEach(list => {
            list.innerHTML = '';
        });
        
        // Get moves for the selected pokemon
        const pokemonMoveset = pokemonMoves[generation][pokemon];
        
        // Add new moves
        pokemonMoveset.base.forEach(move => {
            const li = document.createElement('li');
            li.textContent = move;
            baseMovesList.appendChild(li);
        });
        
        pokemonMoveset.firstEvolution.forEach(move => {
            const li = document.createElement('li');
            li.textContent = move;
            firstEvolutionMovesList.appendChild(li);
        });
        
        pokemonMoveset.finalEvolution.forEach(move => {
            const li = document.createElement('li');
            li.textContent = move;
            finalEvolutionMovesList.appendChild(li);
        });
    }
});