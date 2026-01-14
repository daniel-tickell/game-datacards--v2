
import { parseTextRoster } from './textRosterParser';

describe('textRosterParser', () => {
    const exampleRoster = `Imperium - Imperial Knights - Knights - [2000 pts]

# ++ Army Roster ++ [2000 pts]
## Configuration
Battle Size: Strike Force (2000 Point limit)
Code Chivalric: Deed, Quality
Detachment: Questor Forgepact
Show/Hide Options: Agents of the Imperium are visible, Titans are visible, Unaligned Forces are visible, Unaligned Fortifications are visible

## Character [995 pts]
Knight Castellan [440 pts]: Warlord, Omnissian Champion [30 pts], Plasma decimator, Titanic feet, 2x Twin meltagun, Volcano lance, 2 shieldbreaker missile launchers and twin siegebreaker cannon (2x Shieldbreaker missile launcher, Twin siegebreaker cannon)
Knight Paladin [395 pts]: Knight of the Opus Machina [20 pts], Questoris heavy stubber, Rapid-fire battle cannon, Meltagun, Reaper chainsword
Tech-Priest Dominus [100 pts]: Magos Questoris [35 pts], Omnissian axe, Macrostubber, Volkite blaster
Tech-Priest Manipulus [60 pts]: Omnissian staff, Magnarail lance

## Battleline [180 pts]
Skitarii Rangers [85 pts]:
• 1x Skitarii Ranger Alpha: Close combat weapon, Galvanic rifle
• 9x Skitarii Ranger w/ galvanic rifle: Close combat weapon, Galvanic rifle
Skitarii Vanguard [95 pts]:
• 1x Skitarii Vanguard Alpha: Close combat weapon, Radium carbine
• 9x Skitarii Vanguard w/ radium carbine: Close combat weapon, Radium carbine

## Vehicle [560 pts]
Armiger Helverin [140 pts]: 2x Armiger autocannon, Armoured feet, Meltagun
Armiger Helverin [140 pts]: 2x Armiger autocannon, Armoured feet, Questoris heavy stubber
Armiger Warglaive [140 pts]: Reaper chain-cleaver, Thermal spear, Meltagun
Armiger Warglaive [140 pts]: Reaper chain-cleaver, Thermal spear, Questoris heavy stubber

## Allied Units [265 pts]
Grey Knights Terminator Squad [210 pts]:
• 1x Terminator Justicar: Nemesis force weapon, Storm bolter
• 2x Terminator: Nemesis force weapon, Storm bolter
• 1x Terminator w/ heavy weapon: Nemesis force weapon, Psycannon
• 1x Terminator w/ narthecium: Narthecium, Nemesis force weapon
Inquisitor [55 pts]: Inquisitorial melee weapon, Bolt pistol, Blessed wardings`;

    it('should parse the army name', () => {
        const result = parseTextRoster(exampleRoster);
        expect(result.name).toBe('Imperium - Imperial Knights - Knights -');
    });

    it('should parse characters', () => {
        const result = parseTextRoster(exampleRoster);
        const castellan = result.units.find(u => u.name === 'Knight Castellan');
        expect(castellan).toBeDefined();
        expect(castellan.points).toBe(440);
        expect(castellan.role).toBe('Character');
        expect(castellan.wargear).toContain('Volcano lance');
    });

    it('should parse battleline with multi-line details', () => {
        const result = parseTextRoster(exampleRoster);
        const rangers = result.units.find(u => u.name === 'Skitarii Rangers');
        expect(rangers).toBeDefined();
        expect(rangers.points).toBe(85);
        expect(rangers.wargear).toContain('• 1x Skitarii Ranger Alpha');
        expect(rangers.wargear).toContain('• 9x Skitarii Ranger');
    });

    it('should parse allied units', () => {
        const result = parseTextRoster(exampleRoster);
        const terminators = result.units.find(u => u.name === 'Grey Knights Terminator Squad');
        expect(terminators).toBeDefined();
        expect(terminators.role).toBe('Allied Units');
        expect(terminators.points).toBe(210);
    });
});
