
export const parseTextRoster = (text) => {
    const result = {
        name: "New Roster",
        units: [],
    };

    if (!text) return result;

    const lines = text.split("\n").map(l => l.trim()).filter(l => l);

    // Try to find roster name
    // It often appears as "Army Name [Points]" or just a name at the start
    // The example shows: "Imperium - Imperial Knights - Knights - [2000 pts]"
    // And "++ Army Roster ++ [2000 pts]"

    let currentRole = "Uncategorized";
    let parsingUnits = false;

    // Regex to identify unit lines: "Name [Points]: Details" or "Name [Points]"
    // Example: "Knight Castellan [440 pts]: Warlord, ..."
    // Example: "Skitarii Rangers [85 pts]:"
    const unitRegex = /^(.+?) \[(\d+) pts\](?::\s*(.*))?$/;

    // Regex for role headers like "## Character [995 pts]"
    const roleRegex = /^##\s*(.+?)\s*\[/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check for Army Name if not yet found/set from default
        // We'll take the first line if it looks like a title (not starting with special chars)
        if (i === 0 && !line.startsWith("#") && !line.startsWith("++")) {
            result.name = line.replace(/\s*\[.*?\]\s*$/, ""); // Remove [2000 pts] from name
        }

        if (line.startsWith("## ")) {
            // It's a header
            const roleMatch = line.match(roleRegex);
            if (roleMatch) {
                currentRole = roleMatch[1];
                parsingUnits = true;
            } else if (line.includes("Configuration")) {
                // configuration section, usually just ignore logic-wise for now or store as notes
                parsingUnits = false;
            }
            continue;
        }

        if (parsingUnits) {
            // Check if it's a unit line
            const unitMatch = line.match(unitRegex);
            if (unitMatch) {
                const unitName = unitMatch[1];
                const points = unitMatch[2]; // string
                let wargear = unitMatch[3] || "";

                // Sometimes wargear follows on next lines if they start with bullet points or just continuation
                // But in 40k app export, sometimes it's bullet points for models.
                // Let's peek ahead for lines starting with "•" which indicate models/wargear details
                let j = i + 1;
                let extraDetails = [];
                while (j < lines.length) {
                    const nextLine = lines[j];
                    if (nextLine.startsWith("•") || nextLine.startsWith("##") || nextLine.match(unitRegex)) {
                        if (nextLine.startsWith("##") || nextLine.match(unitRegex)) {
                            break;
                        }
                        if (nextLine.startsWith("•")) {
                            extraDetails.push(nextLine);
                            i++; // advance outer loop
                        }
                    } else {
                        // unexpected line, maybe just wargear wrapping?
                        // In the example: "• 1x Skitarii ..."
                        // Let's assume lines not matching headers or other units are part of this unit if we are parsing units
                        if (!nextLine.startsWith("#")) {
                            // Likely continuation or specific details
                            // For now, let's treat it as description if it doesn't look like a new block
                            extraDetails.push(nextLine);
                            i++;
                        } else {
                            break;
                        }
                    }
                    j++;
                }

                if (extraDetails.length > 0) {
                    wargear = wargear ? wargear + "\n" + extraDetails.join("\n") : extraDetails.join("\n");
                }

                result.units.push({
                    name: unitName,
                    points: parseInt(points, 10),
                    role: currentRole,
                    wargear: wargear,
                    count: 1 // Default to 1, parser logic might need to detect "2x Unit" if that format exists, but usually it lists them individually or as models
                });
            }
        }
    }

    return result;
};
