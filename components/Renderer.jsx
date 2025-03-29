import { Link } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Linking, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Colors } from '../constants/Colors';
import { theme } from '../constants/Theme';

const SHORT_TO_LONG_ABILITIES = {
    "dex": "Dexterity",
    "str": "Strength",
    "wis": "Wisdom",
    "int": "Intelligence",
    "cha": "Charisma",
    "con": "Constitution"
}

const renderers = {
    section: RenderSection,
    quote: RenderQuote,
    list: RenderList,
    inset: RenderInset,
    entries: RenderEntries,
    inline: RenderInline,
    inlineBlock: RenderInlineBlock,
    link: RenderLink,
    options: RenderOptions,
    table: RenderTable,
    item: RenderItem,
    itemSub: RenderItem,
    bonus: RenderBonus,
    bonusSpeed: RenderBonus,
    dice: RenderDice,
    abilityDc: RenderAbilityDc,
    abilityAttackMod: RenderAbilityAttackMod,
    abilityGeneric: RenderAbilityGeneric,
    insetReadAloud: RenderInset,
    variant: RenderVariant,
    variantSub: RenderItem,
    image: RenderImage,
    statblockInline: RenderStatblockInline,
};

const embedRenderers = {
    b: RenderBold,
    bold: RenderBold,
    i: RenderItalic,
    italic: RenderItalic,
    u: RenderUnderline,
    underline: RenderUnderline,
    u2: RenderUnderline,
    underlineDouble: RenderUnderline,
    s: RenderStrikeThrough,
    strike: RenderStrikeThrough,
    s2: RenderStrikeThrough,
    strikeDouble: RenderStrikeThrough,
    color: RenderColor,
    highlight: RenderHighlight,
    sup: RenderSuperScript,
    sub: RenderSubScript,
    kbd: RenderKeyBoard,
    code: RenderCode,
    style: RenderStyle,
    font: RenderFont,
    note: RenderNote,
    tip: RenderTip,
    dice: RenderDiceEmbed,
    hit: RenderHit,
    damage: RenderDamage,
    d20: RenderD20,
    scaledamage: RenderScaleDamage,
    scaledice: RenderScaleDice,
    ability: RenderAbility,
    savingThrow: RenderSavingThrow,
    skillCheck: RenderSkillCheck,
    autodice: RenderAutoDice,
    chance: RenderChance,
    hitYourSpellAttack: RenderHitYourSpellAttack,
    dcYourSpellSave: RenderDcYourSpellSave,
    recharge: RenderRecharge,
    coinflip: RenderCoinFlip,
    skill: RenderSkill,
    sense: RenderSense,
    footnote: RenderFootnote,
    homebrew: RenderHomebrew,
    spell: RenderSpell,
    item: RenderEmbedItem,
    creature: RenderCreature,
    legroup: RenderLegendaryGroup,
    background: RenderBackground,
    race: RenderRace,
    optfeature: RenderOptionalFeature,
    class: RenderClass,
    subclass: RenderSubclass,
    classFeature: RenderClassFeature,
    subclassfeature: RenderSubclassFeature,
    condition: RenderCondition,
    disease: RenderDisease,
    reward: RenderReward,
    feat: RenderFeat,
    psionic: RenderPsionic,
    object: RenderObject,
    boon: RenderBoon,
    cult: RenderCult,
    trap: RenderTrap,
    hazard: RenderHazard,
    deity: RenderDeity,
    variantrule: RenderVariantRule,
    vehicle: RenderVehicle,
    vehupgrade: RenderVehicleUpgrade,
    table: RenderEmbedTable,
    action: RenderAction,
    language: RenderLanguage,
    charoption: RenderCharacterOption,
    recipe: RenderRecipe,
    deck: RenderDeck,
    card: RenderCard,
    link: RenderEmbedLink,
    filter: RenderFilter,
    adventure: RenderAdventure,
    book: RenderBook,
    quickref: RenderQuickRef,
    '5etools': Render5eTools,
    '5etoolsImg': Render5eToolsImage,
    atk: RenderBestiaryAttack,
    loader: RenderLoader,
    dc: RenderDc,
}

const listSeperators = [
    <View style={{ marginRight: 8 }}>
        <Text style={{ color: Colors[theme].text }}>
            {"\u2022"}
        </Text>
    </View>,
    <View style={{ marginRight: 8 }}>
        <Text style={{ color: Colors[theme].text }}>
            {"\u25e6"}
        </Text>
    </View>
];

const MAX_LEVEL = 3;

export function RenderDefaultEmbed({text, ...properties}) {
    return <Text style={{ color: Colors[theme].text }}>{text}</Text>;
}

export function RenderBold({text, ...properties}) {
    console.log(text);
    return <Text style={styles.bold}><RenderEmbeds text={text} {...properties} /></Text>;
}

export function RenderItalic({text, ...properties}) {
    return <Text style={styles.italic}><RenderEmbeds text={text} {...properties} /></Text>;
}

export function RenderUnderline({text, ...properties}) {
    return <Text style={styles.underline}><RenderEmbeds text={text} {...properties} /></Text>;
}

export function RenderStrikeThrough({text, ...properties}) {
    return <Text style={styles.strikethrough}><RenderEmbeds text={text} {...properties} /></Text>;
}

export function RenderColor({text, color, ...properties}) {
    return (
        <Text style={{ color: color || Colors[theme].text }}>
            <RenderEmbeds text={text} {...properties} />
        </Text>
    );
}

export function RenderHighlight({text, ...properties}) {
    return (
        <Text style={{ backgroundColor: Colors[theme].highlight, color: Colors[theme].text }}>
            <RenderEmbeds text={text} {...properties} />
        </Text>
    );
}

export function RenderSuperScript({text, ...properties}) {
    return (
        <Text style={{ fontSize: 12, lineHeight: 20, color: Colors[theme].text }}>
            <RenderEmbeds text={text} {...properties} />
        </Text>
    );
}

export function RenderSubScript({text, ...properties}) {
    return (
        <Text style={{ fontSize: 12, lineHeight: 20, color: Colors[theme].text }}>
            <RenderEmbeds text={text} {...properties} />
        </Text>
    );
}

export function RenderKeyBoard({text, ...properties}) {
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].card,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: Colors[theme].border,
            fontFamily: 'monospace'
        }}>
            <RenderEmbeds text={text} {...properties} />
        </Text>
    );
}

export function RenderCode({text, ...properties}) {
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].card,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: Colors[theme].border,
            fontFamily: 'monospace'
        }}>
            <RenderEmbeds text={text} {...properties} />
        </Text>
    );
}

export function RenderStyle({text, ...properties}) {
    const [actualText, style] = text.split('|');
    const styles = style.split(';').reduce((acc, curr) => {
        const [key, value] = curr.split(':');
        if (key && value) {
            acc[key.trim()] = value.trim();
        }
        return acc;
    }, {});

    return (
        <Text style={{ ...styles, color: Colors[theme].text }}>
            <RenderEmbeds text={actualText} {...properties} />
        </Text>
    );
}

export function RenderFont({text, font, ...properties}) {
    return (
        <Text style={{ fontFamily: font, color: Colors[theme].text }}>
            <RenderEmbeds text={text} {...properties} />
        </Text>
    );
}

export function RenderNote({text, ...properties}) {
    return (
        <View style={{ 
            backgroundColor: Colors[theme].note,
            padding: 8,
            borderRadius: 4,
            marginVertical: 4
        }}>
            <Text style={{ color: Colors[theme].text }}>
                <RenderEmbeds text={text} {...properties} />
            </Text>
        </View>
    );
}

export function RenderTip({text, ...properties}) {
    return (
        <View style={{ 
            backgroundColor: Colors[theme].tip,
            padding: 8,
            borderRadius: 4,
            marginVertical: 4
        }}>
            <Text style={{ color: Colors[theme].text }}>
                <RenderEmbeds text={text} {...properties} />
            </Text>
        </View>
    );
}

export function RenderDiceEmbed({text, ...properties}) {
    const [rollResult, setRollResult] = useState(null);
    const [individualRolls, setIndividualRolls] = useState([]);
    const [promptValue, setPromptValue] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [options, setOptions] = useState([]);
    
    const handleRoll = () => {
        const parts = text.split('|');
        const [diceString] = parts;
        
        // Check for multiple choice options (e.g., "1d6;2d6")
        if (diceString.includes(';')) {
            const optionParts = diceString.split(';');
            setOptions(optionParts);
            setShowOptions(true);
            return;
        }
        
        // Check if we need to prompt for a number
        if (diceString.includes('#$prompt_')) {
            if (promptValue === null) {
                setShowModal(true);
                return;
            }
            // Use the previously entered value
            calculateRoll(diceString.replace(/#\$prompt_.*?\$#/, promptValue.toString()));
        } else {
            calculateRoll(diceString);
        }
    };

    const handleInputSubmit = () => {
        const num = parseInt(inputValue);
        if (!isNaN(num)) {
            setPromptValue(num);
            setShowModal(false);
            const parts = text.split('|');
            const [diceString] = parts;
            calculateRoll(diceString.replace(/#\$prompt_.*?\$#/, num.toString()));
        }
    };

    const handleOptionSelect = (selectedOption) => {
        setShowOptions(false);
        calculateRoll(selectedOption);
    };

    const calculateRoll = (diceString) => {
        // Parse the dice string (e.g., "1d6+2" or "2d8-1")
        const diceParts = diceString.split(/([+-])/);
        let total = 0;
        let currentModifier = 1;
        let rolls = [];
        
        for (let i = 0; i < diceParts.length; i++) {
            const part = diceParts[i].trim();
            if (part === '+') {
                currentModifier = 1;
            } else if (part === '-') {
                currentModifier = -1;
            } else if (part.includes('d')) {
                const [numDice, numFaces] = part.split('d').map(Number);
                const diceRolls = [];
                for (let j = 0; j < numDice; j++) {
                    const roll = Math.floor(Math.random() * numFaces) + 1;
                    diceRolls.push(roll);
                    total += currentModifier * roll;
                }
                rolls.push({
                    type: 'dice',
                    count: numDice,
                    faces: numFaces,
                    modifier: currentModifier,
                    rolls: diceRolls
                });
            } else if (part) {
                const value = Number(part);
                if (!isNaN(value)) {
                    total += currentModifier * value;
                    rolls.push({
                        type: 'modifier',
                        value: currentModifier * value
                    });
                }
            }
        }
        
        setIndividualRolls(rolls);
        setRollResult(total);
    };

    const parts = text.split('|');
    const [data, displayText, rollerName] = parts;
    
    // Format the dice string for display
    const formatDiceString = (str) => {
        // Replace multiple choice prompts with (𝑛)
        str = str.replace(/#\$prompt_.*?\$#/g, '(𝑛)');
        // Format multiple choice options
        if (str.includes(';')) {
            return str.split(';')[0] + ' (choose)';
        }
        return str;
    };
    
    const renderRollResult = () => {
        if (rollResult === null) return null;
        
        return (
            <Text style={{ color: Colors[theme].text }}>
                {" = "}
                {individualRolls.map((roll, index) => {
                    if (roll.type === 'dice') {
                        return (
                            <Text key={index}>
                                {index > 0 && roll.modifier > 0 ? ' + ' : ''}
                                {roll.modifier < 0 ? ' - ' : ''}
                                {roll.rolls.length > 1 ? '(' : ''}
                                {roll.rolls.join(' + ')}
                                {roll.rolls.length > 1 ? ')' : ''}
                            </Text>
                        );
                    } else {
                        return (
                            <Text key={index}>
                                {roll.value > 0 ? ' + ' : ' - '}
                                {Math.abs(roll.value)}
                            </Text>
                        );
                    }
                })}
                {" = "}
                <Text style={{ fontWeight: 'bold' }}>{rollResult}</Text>
            </Text>
        );
    };
    
    return (
        <>
            <TouchableOpacity 
                onPress={handleRoll}
                style={{
                    backgroundColor: Colors[theme].dice,
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: Colors[theme].border,
                    shadowColor: Colors[theme].shadow,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 1,
                    elevation: 2,
                }}
            >
                <Text style={{ 
                    color: Colors[theme].text,
                    fontFamily: 'monospace',
                    textDecorationLine: 'underline',
                }}>
                    {formatDiceString(data)}
                    {renderRollResult()}
                    {rollerName && ` (rolled by ${rollerName})`}
                </Text>
            </TouchableOpacity>
            
            {/* Number Input Modal */}
            <Modal
                visible={showModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                    <View style={{
                        backgroundColor: Colors[theme].background,
                        padding: 20,
                        borderRadius: 10,
                        width: '80%',
                    }}>
                        <Text style={{ 
                            color: Colors[theme].text,
                            marginBottom: 10,
                            fontSize: 16,
                        }}>
                            Enter a number:
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: Colors[theme].border,
                                borderRadius: 4,
                                padding: 10,
                                color: Colors[theme].text,
                                backgroundColor: Colors[theme].card,
                            }}
                            value={inputValue}
                            onChangeText={setInputValue}
                            keyboardType="numeric"
                            autoFocus={true}
                        />
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            marginTop: 20,
                        }}>
                            <TouchableOpacity
                                style={{
                                    padding: 10,
                                    marginRight: 10,
                                }}
                                onPress={() => setShowModal(false)}
                            >
                                <Text style={{ color: Colors[theme].text }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    padding: 10,
                                    backgroundColor: Colors[theme].primary,
                                    borderRadius: 4,
                                }}
                                onPress={handleInputSubmit}
                            >
                                <Text style={{ color: Colors[theme].text }}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Options Choice Modal */}
            <Modal
                visible={showOptions}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowOptions(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                    <View style={{
                        backgroundColor: Colors[theme].background,
                        padding: 20,
                        borderRadius: 10,
                        width: '80%',
                    }}>
                        <Text style={{ 
                            color: Colors[theme].text,
                            marginBottom: 10,
                            fontSize: 16,
                        }}>
                            Choose an option:
                        </Text>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    padding: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: Colors[theme].border,
                                }}
                                onPress={() => handleOptionSelect(option)}
                            >
                                <Text style={{ color: Colors[theme].text }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={{
                                padding: 10,
                                marginTop: 20,
                                backgroundColor: Colors[theme].primary,
                                borderRadius: 4,
                                alignItems: 'center',
                            }}
                            onPress={() => setShowOptions(false)}
                        >
                            <Text style={{ color: Colors[theme].text }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

export function RenderHit({text, ...properties}) {
    const [data, displayText] = text.split('|');
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].hit,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || data}
        </Text>
    );
}

export function RenderDamage({text, ...properties}) {
    const [data, displayText] = text.split('|');
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].damage,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || data}
        </Text>
    );
}

export function RenderD20({text, ...properties}) {
    const [data, displayText] = text.split('|');
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].d20,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || data}
        </Text>
    );
}

export function RenderScaleDamage({text, ...properties}) {
    const [data, displayText] = text.split('|');
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].scaleDamage,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || data}
        </Text>
    );
}

export function RenderScaleDice({text, ...properties}) {
    const [data, displayText] = text.split('|');
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].scaleDice,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || data}
        </Text>
    );
}

export function RenderAbility({text, ...properties}) {
    const [shortName, displayText] = text.split('|');
    const fullName = SHORT_TO_LONG_ABILITIES[shortName.toLowerCase()] || shortName;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].ability,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || fullName}
        </Text>
    );
}

export function RenderSavingThrow({text, ...properties}) {
    const [data, displayText] = text.split('|');
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].savingThrow,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || data}
        </Text>
    );
}

export function RenderSkillCheck({text, ...properties}) {
    const [data, displayText] = text.split('|');
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].skillCheck,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || data}
        </Text>
    );
}

export function RenderAutoDice({text, ...properties}) {
    const [data, displayText] = text.split('|');
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].autoDice,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || data}
        </Text>
    );
}

export function RenderChance({text, ...properties}) {
    const parts = text.split('|');
    const [data, displayText, rollerName, successText, failureText] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].chance,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || data}
            {rollerName && ` (rolled by ${rollerName})`}
        </Text>
    );
}

export function RenderHitYourSpellAttack({text, ...properties}) {
    if (!text) {
        return (
            <Text style={{ 
                backgroundColor: Colors[theme].spellAttack,
                color: Colors[theme].text,
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 4,
                fontFamily: 'monospace'
            }}>
                Spell Attack
            </Text>
        );
    }
    
    const parts = text.split('|');
    const [displayText] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].spellAttack,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText}
        </Text>
    );
}

export function RenderDcYourSpellSave({text, ...properties}) {
    if (!text) {
        return (
            <Text style={{ 
                backgroundColor: Colors[theme].spellSave,
                color: Colors[theme].text,
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 4,
                fontFamily: 'monospace'
            }}>
                Spell Save DC
            </Text>
        );
    }
    
    const parts = text.split('|');
    const [displayText] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].spellSave,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText}
        </Text>
    );
}

export function RenderRecharge({text, ...properties}) {
    if (!text) {
        return (
            <Text style={{ 
                backgroundColor: Colors[theme].recharge,
                color: Colors[theme].text,
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 4,
                fontFamily: 'monospace'
            }}>
                (Recharge 6)
            </Text>
        );
    }
    
    const parts = text.split('|');
    const [value] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].recharge,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            (Recharge {value})
        </Text>
    );
}

export function RenderCoinFlip({text, ...properties}) {
    if (!text) {
        return (
            <Text style={{ 
                backgroundColor: Colors[theme].coinflip,
                color: Colors[theme].text,
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 4,
                fontFamily: 'monospace'
            }}>
                Coin Flip
            </Text>
        );
    }
    
    const parts = text.split('|');
    const [displayText, rollerName, successText, failureText] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].coinflip,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText}
            {rollerName && ` (rolled by ${rollerName})`}
        </Text>
    );
}

export function RenderSkill({text, ...properties}) {
    const [data, displayText] = text.split('|');
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].skill,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || data}
        </Text>
    );
}

export function RenderSense({text, ...properties}) {
    const [data, displayText] = text.split('|');
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].sense,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || data}
        </Text>
    );
}

export function RenderFootnote({text, ...properties}) {
    const [data, displayText] = text.split('|');
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].footnote,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || data}
        </Text>
    );
}

export function RenderHomebrew({text, ...properties}) {
    const [data, displayText] = text.split('|');
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].homebrew,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || data}
        </Text>
    );
}

export function RenderSpell({text, ...properties}) {
    const parts = text.split('|');
    const [spellName, source, linkText] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].spell,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {linkText || spellName}
            {source && ` (${source})`}
        </Text>
    );
}

export function RenderEmbedItem({text, ...properties}) {
    const parts = text.split('|');
    const [itemName, source, linkText] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].item,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {linkText || itemName}
            {source && ` (${source})`}
        </Text>
    );
}

export function RenderCreature({text, ...properties}) {
    const parts = text.split('|');
    const [creatureName, source, linkText] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].creature,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {linkText || creatureName}
            {source && ` (${source})`}
        </Text>
    );
}

export function RenderLegendaryGroup({text, ...properties}) {
    const parts = text.split('|');
    const [groupName, source, linkText] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].legendaryGroup,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {linkText || groupName}
            {source && ` (${source})`}
        </Text>
    );
}

export function RenderBackground({text, ...properties}) {
    const parts = text.split('|');
    const [backgroundName, source, linkText] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].background,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {linkText || backgroundName}
            {source && ` (${source})`}
        </Text>
    );
}

export function RenderRace({text, ...properties}) {
    const parts = text.split('|');
    const [raceName, source, linkText] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].race,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {linkText || raceName}
            {source && ` (${source})`}
        </Text>
    );
}

export function RenderOptionalFeature({text, ...properties}) {
    const parts = text.split('|');
    const [featureName, source, linkText] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].optionalFeature,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {linkText || featureName}
            {source && ` (${source})`}
        </Text>
    );
}

export function RenderClass({text, ...properties}) {
    const parts = text.split('|');
    const [className, source, linkText, subclasses, classFeature] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].class,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {linkText || className}
            {source && ` (${source})`}
            {subclasses && ` - ${subclasses}`}
            {classFeature && ` - ${classFeature}`}
        </Text>
    );
}

export function RenderClassFeature({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderSubclass({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderSubclassFeature({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderCondition({text, ...properties}) {
    const [conditionName, displayText] = text.split('|');
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].condition,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {displayText || conditionName}
        </Text>
    );
}

export function RenderDisease({text, ...properties}) {
    const parts = text.split('|');
    const [diseaseName, source, linkText] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].disease,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {linkText || diseaseName}
            {source && ` (${source})`}
        </Text>
    );
}

export function RenderReward({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderFeat({text, ...properties}) {
    const parts = text.split('|');
    const [featName, source, linkText] = parts;
    return (
        <Text style={{ 
            backgroundColor: Colors[theme].feat,
            color: Colors[theme].text,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: 'monospace'
        }}>
            {linkText || featName}
            {source && ` (${source})`}
        </Text>
    );
}

export function RenderPsionic({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderObject({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderBoon({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderCult({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderTrap({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderHazard({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderDeity({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderVariantRule({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderVehicle({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderVehicleUpgrade({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderEmbedTable({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderAction({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderLanguage({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderCharacterOption({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderRecipe({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderDeck({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderCard({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderEmbedLink({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderFilter({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderAdventure({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderBook({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderQuickRef({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function Render5eTools({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function Render5eToolsImage({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderBestiaryAttack({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderLoader({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderDc({text, ...properties}) {
    return RenderDefaultEmbed({text, ...properties});
}

export function RenderEmbeds({text, style, ...properties}) {
    const regex = /\{\@([^{} ]+?)(?: ((?:(?:[^{}])|(?:\{\@(?:[^{} ]+?)(?: (?:(?:(?:[^{}])|(?:\{[^{}]*\}))*))?\}))*))?\}/g;

    const parts = [];
    let lastIndex = 0;
    let key = 0;

    const actual_style = style ? style : styles.content;

    let match = regex.exec(text);
    if (match === null) {
        return <Text style={actual_style}>{text}</Text>;
    }
    do {
        const [fullMatch, type, value] = match;
        const matchStart = match.index;

        if (matchStart > lastIndex) {
            parts.push(<Text style={actual_style} key={key++}>{text.slice(lastIndex, match.index)}</Text>);
        }

        const Renderer = embedRenderers[type] ?? RenderDefaultEmbed;
        parts.push(<Renderer key={key++} text={value} {...properties} />);

        lastIndex = matchStart + fullMatch.length;
    } while ((match = regex.exec(text)) !== null);

    if (lastIndex < text.length) {
        parts.push(<Text key={key} style={style ? style : styles.content}>{text.slice(lastIndex)}</Text>);
    }

    return <Text>{parts}</Text>
};

function RenderDefault({data, level, ...properties}) {
    return (
        <Text style={styles.content}>{JSON.stringify(data, null, 4)}</Text>
    )
}

export function RenderSection({data, level, ...properties}) {
    level = 0;
    const nextLevel = Math.min(level + 1, MAX_LEVEL);
    return (
        <View style={styles.container}>
            <Text style={styles.headers[level]}>{data.name}</Text>
            {data.entries.map((entry, index) => (
                <Render key={index} data={entry} level={nextLevel} {...properties} />
            ))}
        </View>
    );
}

export function RenderQuote({data, ...properties}) {
    return (
        <View style={styles.container}>
            <Text style={{ color: Colors[theme].text }}>
                "<RenderInline data={data} {...properties} />"
            </Text>
            <View style={styles.container}>
                <Text style={{...styles.content, textAlign: 'right', color: Colors[theme].text}}>
                    {`— ${data.by}, `}
                    <Text style={{fontStyle: 'italic', color: Colors[theme].text}}>{data.from}</Text>
                </Text>
            </View>
        </View>
    );
}

export function RenderList({data, level, listLevel, ...properties}) {
    listLevel = listLevel || 0;
    return (
        <>
            {data.hasOwnProperty('name') && <Text style={styles.headers[level]}>{data.name}</Text> }
            {
                data.items.map((item, index) => (
                    <View key={index} style={[styles.container, { marginBottom: -5 }]}>
                        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                            {
                                !item.hasOwnProperty('type') || item.type !== "list"
                                    ? listSeperators[listLevel]
                                    : null
                            }
                            <View style={{flex: 1}}>
                                <Render data={item} level={Math.max(level + 1, MAX_LEVEL)} listLevel={listLevel + 1} {...properties} />
                            </View>
                        </View>
                    </View>
                ))
            }
        </>
    );
}

export function RenderInset({data, level, ...properties}) {
    const INSET_LEVEL = 3;
    return (
        <View style={styles.inset}>
            {data.hasOwnProperty('name') &&
                <Text style={styles.headers[INSET_LEVEL - 1]}>
                    {data.name}
                </Text>
            }
            {data.entries.map((entry, index) => (
                <Render key={index} data={entry} level={INSET_LEVEL} {...properties} />
            ))}
        </View>
    );
}

export function RenderEntries({data, level, ...properties}) {
    if (level == MAX_LEVEL) {
        return (<>
                    <Text style={styles.content}>
                        {data.hasOwnProperty('name') &&
                            <Text style={styles.headers[level]}>{data.name}. </Text>
                        }
                        <Render data={data.entries[0]} level={MAX_LEVEL} {...properties} />
                    </Text>
                    {data.entries.map((entry, index) => (index > 0 && 
                        <Render key={index} data={entry} level={MAX_LEVEL} {...properties} />
                    ))}
                </>
            );
    }
    return (
        <View style={styles.container}>
            {data.hasOwnProperty('name') &&
                <Text style={styles.headers[level]}>{data.name}</Text>
            }
            {data.entries.map((entry, index) => (
                <Render key={index} data={entry} level={Math.min(level + 1, MAX_LEVEL)} {...properties} />
            ))}
        </View>
    );
}

export function RenderInline({data, ...properties}) {
    return (
        <Text style={styles.content}>
            {data.entries.map((entry, index) => (
                <Render key={index} data={entry} {...properties} />
            ))}
        </Text>
    );
}

export function RenderInlineBlock({data, ...properties}) {
    return (
        <View style={styles.content}>
            <Text style={{ color: Colors[theme].text }}>
                {data.entries.map((entry, index) => (
                    <Render key={index} data={entry} {...properties} />
                ))}
            </Text>
        </View>
    );
}

export function RenderLink({data, ...properties}) {
    const handlePress = data.href.type !== "internal" ?
        useCallback(async () => {
            if (await Linking.canOpenURL(data.href.url)) {
                await Linking.openURL(data.href.url);
            } else {
                Alert.alert(`Can't open this URL: ${data.href.url}`)
            }
        }, [data.href.url]) : () => {};
    
    return (
        <Text style={{ color: Colors[theme].text }}>
            {data.href.type === "internal" ?
            <Link href={data.href.path} asChild><Text style={styles.link}>{data.text}</Text></Link>
            : <Text style={styles.link} onPress={handlePress}>{data.text}</Text>}
        </Text>
    );
}

export function RenderOptions({data, level, ...properties}) {
    return (
        <>
            {data.entries.map((entry, index) => (
                <Render key={index} data={entry} level={level} {...properties} />
            ))}
        </>
    );
}

export function RenderTable({data, level, ...properties}) {
    const rows = data.hasOwnProperty("colLabels") ? [data.colLabels, ...data.rows] : data.rows;

    return (
        <>
            {data.hasOwnProperty("caption") &&
                <Text style={styles.tableCaption}>
                    {data.caption}
                </Text>
            }
            <View style={styles.table}>
                {rows.map((row, index) => (
                    <View key={index} style={styles.tableRow}>
                        {(row.hasOwnProperty("row") ? row.row : row).map((entry, index) => (
                            <View key={index} style={styles.tableCell}>
                                <Render data={entry} level={Math.min(level + 1, MAX_LEVEL)} {...properties} />
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </>
    );
}

export function RenderItem({data, ...properties}) {
    const entry = data.hasOwnProperty("entry") ? data.entry : data.entries[0];

    return (
        <>
            <Text style={styles.content}>
                {data.hasOwnProperty("name") &&
                <Text style={styles.headers[MAX_LEVEL]}>
                    {data.name}{". "}
                </Text>}
                <Render data={entry} {...properties} />
            </Text>
            {data.hasOwnProperty("entries") && data.entries.map((entry, index) => (
                index > 0 && <Render key={index} data={entry} {...properties} />
            ))}
        </>
    );
}

export function RenderBonus({data, level, ...properties}) {
    return (
        <Text style={styles.content}>+{data.value}</Text>
    );
}

export function RenderDice({data, level, ...properties}) {

    const handlePress = () => {
        // TODO: do
    }

    const rollString = data.toRoll.map((roll, _) => `${roll.number}d${roll.faces}${(roll.hasOwnProperty("modifier") && roll.modifier != 0) ? "+" + roll.modifier : ""}`).join('+')

    return (
        <Text style={styles.content}>
            <Text onPress={handlePress}>
                {rollString}
            </Text>
        </Text>
    );
}

export function RenderAbilityDc({data, level, ...properties}) {
    return (
        <View style={styles.middle}>
            <Text style={{ color: Colors[theme].text }}>
                <Text style={styles.bold}>
                    {data.name} save DC
                </Text>
                <Text style={{ color: Colors[theme].text }}>
                    {" "}= 8 + {data.attributes.map((shortAttr, _) => SHORT_TO_LONG_ABILITIES[shortAttr]).join(' or ')}{data.attributes.length > 1 ? " (your choice)" : ""} + Proficiency Bonus
                </Text>
            </Text>
        </View>
    );
}

export function RenderAbilityAttackMod({data, level, ...properties}) {
    return (
        <View style={styles.middle}>
            <Text style={{ color: Colors[theme].text }}>
                <Text style={styles.bold}>
                    {data.name} attack modifier
                </Text>
                <Text style={{ color: Colors[theme].text }}>
                    {" "}= {data.attributes.map((shortAttr, _) => SHORT_TO_LONG_ABILITIES[shortAttr]).join(' or ')}{data.attributes.length > 1 ? " (your choice)" : ""} + Proficiency Bonus
                </Text>
            </Text>
        </View>
    );
}

export function RenderAbilityGeneric({data, level, ...properties}) {
    return (
        <View style={styles.middle}>
            <Text style={{ color: Colors[theme].text }}>
                {data.hasOwnProperty("name") && <Text style={styles.bold}>
                    {data.name}
                </Text>}
                <Text style={{ color: Colors[theme].text }}>
                    {data.hasOwnProperty("name") ? " = " : ""}{data.hasOwnProperty("text") ? data.text + " " : ""}{data.hasOwnProperty("attributes") ? (data.attributes.map((shortAttr, _) => SHORT_TO_LONG_ABILITIES[shortAttr]).join(' or ')) : ""}{data.hasOwnProperty("attributes") && data.attributes.length > 1 ? " (your choice)" : ""}
                </Text>
            </Text>
        </View>
    );
}

export function RenderVariant({data, level, ...properties}) {
    return (
        RenderInset({data: {...data, name: "Variant: " + data.name}, level, ...properties})
    );
}

export function RenderImage({data, level, ...properties}) {
    return (
        RenderDefault({data, level, ...properties})
    );
}

export function RenderStatblockInline({data, level, ...properties}) {
    return (
        RenderDefault({data, level, ...properties})
    );
}

export function Render({data, level, ...properties}) {
    level = level === undefined ? 1 : level;
    if (typeof data === 'string') {
        return <RenderEmbeds text={data} />;
    }

    if (typeof data === 'object') {
        if (!data.hasOwnProperty('type')) {
            throw new Error('Unknown data type');
        }
    }

    return renderers[data.type] ? renderers[data.type]({data, level, ...properties}) : RenderDefault({data, level, ...properties});
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors[theme].background,
        padding: 16,
        borderRadius: 8,
    },
    headers: [
        {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            color: Colors[theme].text,
        },
        {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            borderBottomWidth: 2,
            borderBottomColor: Colors[theme].border,
            color: Colors[theme].text,
        },
        {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: Colors[theme].text,
        },
        {
            fontWeight: 'bold',
            color: Colors[theme].text,
        }
    ],
    content: {
        marginBottom: 10,
        color: Colors[theme].text,
        lineHeight: 20,
    },
    inset: {
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: Colors[theme].border,
        backgroundColor: Colors[theme].card,
        padding: 12,
        marginBottom: 10,
        borderRadius: 6,
    },
    quote: {
        fontStyle: 'italic',
        color: Colors[theme].text,
    },
    link: {
        color: Colors[theme].primary,
        textDecorationLine: 'underline',
    },
    tableCaption: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors[theme].text,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors[theme].border,
    },
    tableCell: {
        margin: 0,
        padding: 8,
        borderWidth: 1,
        borderColor: Colors[theme].border,
        flex: 1,
        backgroundColor: Colors[theme].card,
    },
    table: {
        borderWidth: 1,
        borderColor: Colors[theme].border,
        borderRadius: 6,
        overflow: 'hidden',
    },
    middle: {
        alignItems: 'center',
        textAlign: 'center',
    },
    bold: {
        fontWeight: 'bold',
        color: Colors[theme].text,
    },
    italic: {
        fontStyle: 'italic',
        color: Colors[theme].text,
    },
    underline: {
        textDecorationLine: 'underline',
        color: Colors[theme].text,
    },
    strikethrough: {
        textDecorationLine: 'line-through',
        color: Colors[theme].text,
    }
});