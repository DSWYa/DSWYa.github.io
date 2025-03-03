document.addEventListener('DOMContentLoaded', function() {
    // All Pokémon types
    const types = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
        'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];

    // Type effectiveness chart (defender weaknesses)
    // This chart shows which types the defender is weak against
    // For example: normal: { fighting: 2 } means Normal-type is weak to Fighting
    const typeChart = {
        normal: { fighting: 2, ghost: 0 },
        fire: { water: 2, ground: 2, rock: 2 },
        water: { electric: 2, grass: 2 },
        electric: { ground: 2 },
        grass: { fire: 2, ice: 2, poison: 2, flying: 2, bug: 2 },
        ice: { fire: 2, fighting: 2, rock: 2, steel: 2 },
        fighting: { flying: 2, psychic: 2, fairy: 2 },
        poison: { ground: 2, psychic: 2 },
        ground: { water: 2, grass: 2, ice: 2, electric: 0 },
        flying: { electric: 2, ice: 2, rock: 2, ground: 0 },
        psychic: { bug: 2, ghost: 2, dark: 2 },
        bug: { fire: 2, flying: 2, rock: 2 },
        rock: { water: 2, grass: 2, fighting: 2, ground: 2, steel: 2 },
        ghost: { ghost: 2, dark: 2, normal: 0, fighting: 0 },
        dragon: { ice: 2, dragon: 2, fairy: 2 },
        dark: { fighting: 2, bug: 2, fairy: 2, psychic: 0 },
        steel: { fire: 2, fighting: 2, ground: 2, poison: 0 },
        fairy: { poison: 2, steel: 2, dragon: 0 }
    };

    // Resistance chart (defender resistances)
    // This chart shows which types the defender is resistant to
    const resistanceChart = {
        normal: {},
        fire: { fire: 0.5, grass: 0.5, ice: 0.5, bug: 0.5, steel: 0.5, fairy: 0.5 },
        water: { fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
        electric: { electric: 0.5, flying: 0.5, steel: 0.5 },
        grass: { water: 0.5, electric: 0.5, grass: 0.5, ground: 0.5 },
        ice: { ice: 0.5 },
        fighting: { bug: 0.5, rock: 0.5, dark: 0.5 },
        poison: { grass: 0.5, fighting: 0.5, poison: 0.5, bug: 0.5, fairy: 0.5 },
        ground: { poison: 0.5, rock: 0.5 },
        flying: { grass: 0.5, fighting: 0.5, bug: 0.5 },
        psychic: { fighting: 0.5, psychic: 0.5 },
        bug: { grass: 0.5, fighting: 0.5, ground: 0.5 },
        rock: { normal: 0.5, fire: 0.5, poison: 0.5, flying: 0.5 },
        ghost: { poison: 0.5, bug: 0.5 },
        dragon: { fire: 0.5, water: 0.5, electric: 0.5, grass: 0.5 },
        dark: { ghost: 0.5, dark: 0.5 },
        steel: { normal: 0.5, grass: 0.5, ice: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 0.5, dragon: 0.5, steel: 0.5, fairy: 0.5 },
        fairy: { fighting: 0.5, bug: 0.5, dark: 0.5 }
    };

    // DOM elements
    const typeSelection = document.getElementById('typeSelection');
    const selectedTypesElement = document.getElementById('selectedTypes');
    const veryWeakElement = document.getElementById('veryWeak');
    const weakElement = document.getElementById('weak');
    const resistantElement = document.getElementById('resistant');
    const veryResistantElement = document.getElementById('veryResistant');
    const immuneElement = document.getElementById('immune');
    const resetButton = document.getElementById('resetButton');

    // Selected types (maximum 2)
    let selectedTypes = [];

    // Create type selection checkboxes
    types.forEach(type => {
        const typeContainer = document.createElement('div');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = type;
        checkbox.className = 'type-checkbox';
        checkbox.value = type;
        
        const label = document.createElement('label');
        label.htmlFor = type;
        label.className = `type-label ${type}`;
        label.textContent = capitalizeFirstLetter(type);
        
        checkbox.addEventListener('change', function() {
            handleTypeSelection(this);
        });
        
        typeContainer.appendChild(checkbox);
        typeContainer.appendChild(label);
        typeSelection.appendChild(typeContainer);
    });

    // Handle type selection
    function handleTypeSelection(checkbox) {
        const type = checkbox.value;
        
        if (checkbox.checked) {
            if (selectedTypes.length < 2) {
                selectedTypes.push(type);
            } else {
                // Uncheck the checkbox if already 2 types are selected
                checkbox.checked = false;
                return;
            }
        } else {
            selectedTypes = selectedTypes.filter(t => t !== type);
        }
        
        updateWeaknessDisplay();
    }

    // Calculate type effectiveness
    function calculateEffectiveness() {
        // Initialize with neutral effectiveness (1) for all types
        let effectiveness = {};
        types.forEach(type => {
            effectiveness[type] = 1;
        });
        
        // Loop through each selected defending type
        selectedTypes.forEach(defenderType => {
            // Apply weaknesses
            if (typeChart[defenderType]) {
                Object.keys(typeChart[defenderType]).forEach(attackerType => {
                    effectiveness[attackerType] *= typeChart[defenderType][attackerType];
                });
            }
            
            // Apply resistances
            if (resistanceChart[defenderType]) {
                Object.keys(resistanceChart[defenderType]).forEach(attackerType => {
                    effectiveness[attackerType] *= resistanceChart[defenderType][attackerType];
                });
            }
        });
        
        return effectiveness;
    }

    // Update the weakness display
    function updateWeaknessDisplay() {
        // Update selected types display
        if (selectedTypes.length === 0) {
            selectedTypesElement.innerHTML = '<p>No types selected</p>';
        } else {
            selectedTypesElement.innerHTML = '';
            selectedTypes.forEach(type => {
                const typeElement = document.createElement('div');
                typeElement.className = `selected-type ${type}`;
                typeElement.textContent = capitalizeFirstLetter(type);
                selectedTypesElement.appendChild(typeElement);
            });
        }
        
        // Calculate weaknesses if types are selected
        if (selectedTypes.length > 0) {
            const effectiveness = calculateEffectiveness();
            
            // Clear previous results
            veryWeakElement.innerHTML = '';
            weakElement.innerHTML = '';
            resistantElement.innerHTML = '';
            veryResistantElement.innerHTML = '';
            immuneElement.innerHTML = '';
            
            // Group types by effectiveness
            types.forEach(type => {
                const value = effectiveness[type];
                if (value === 0 || value === 0.25 || value === 0.5 || value === 2 || value === 4) {
                    const typeElement = document.createElement('div');
                    typeElement.className = `type-badge ${type}`;
                    typeElement.textContent = capitalizeFirstLetter(type);
                    
                    if (value === 4) {
                        veryWeakElement.appendChild(typeElement);
                    } else if (value === 2) {
                        weakElement.appendChild(typeElement);
                    } else if (value === 0.5) {
                        resistantElement.appendChild(typeElement);
                    } else if (value === 0.25) {
                        veryResistantElement.appendChild(typeElement);
                    } else if (value === 0) {
                        immuneElement.appendChild(typeElement);
                    }
                }
            });
            
            // Add placeholder text if no types in a category
            if (veryWeakElement.children.length === 0) {
                veryWeakElement.innerHTML = '<p>None</p>';
            }
            if (weakElement.children.length === 0) {
                weakElement.innerHTML = '<p>None</p>';
            }
            if (resistantElement.children.length === 0) {
                resistantElement.innerHTML = '<p>None</p>';
            }
            if (veryResistantElement.children.length === 0) {
                veryResistantElement.innerHTML = '<p>None</p>';
            }
            if (immuneElement.children.length === 0) {
                immuneElement.innerHTML = '<p>None</p>';
            }
        } else {
            // Reset all categories
            veryWeakElement.innerHTML = '<p>Select a type</p>';
            weakElement.innerHTML = '<p>Select a type</p>';
            resistantElement.innerHTML = '<p>Select a type</p>';
            veryResistantElement.innerHTML = '<p>Select a type</p>';
            immuneElement.innerHTML = '<p>Select a type</p>';
        }
    }

    // Reset button functionality
    resetButton.addEventListener('click', function() {
        // Uncheck all checkboxes
        document.querySelectorAll('.type-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear selected types
        selectedTypes = [];
        
        // Update display
        updateWeaknessDisplay();
    });

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Initialize display
    updateWeaknessDisplay();
});