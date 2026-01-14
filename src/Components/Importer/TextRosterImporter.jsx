
import { Button, Input, Modal, message } from "antd";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { parseTextRoster } from "../../Helpers/textRosterParser";
import { useCardStorage } from "../../Hooks/useCardStorage";
import { useDataSourceStorage } from "../../Hooks/useDataSourceStorage";

const { TextArea } = Input;

export const TextRosterImporter = ({ visible, setVisible }) => {
    const [text, setText] = useState("");
    const { importCategory } = useCardStorage();
    const { dataSource } = useDataSourceStorage(); // Access datasource

    const handleImport = () => {
        try {
            const result = parseTextRoster(text);

            if (!result || !result.units || result.units.length === 0) {
                message.error("Could not parse roster or no units found.");
                return;
            }

            const newCategoryUuid = uuidv4();

            const newCategory = {
                uuid: newCategoryUuid,
                name: result.name,
                type: "category",
                closed: false,
                cards: result.units.map(unit => {
                    // Try to find the unit in the active datasource
                    let baseCard = null;
                    if (dataSource && dataSource.data) {
                        for (const faction of dataSource.data) {
                            if (faction.datasheets) {
                                const found = faction.datasheets.find(ds => ds.name === unit.name);
                                if (found) {
                                    baseCard = found;
                                    break;
                                }
                            }
                        }
                    }

                    if (baseCard) {
                        // Merge base card data with roster specific data
                        return {
                            ...baseCard, // existing stats, abilities, etc
                            id: uuidv4(),
                            uuid: uuidv4(),
                            // Keep name from roster or base? Roster might have custom name but usually matches
                            // Ensure points are updated from roster if present
                            points: [{ cost: unit.points.toString(), active: true }],
                            // Add loadout/wargear to abilities.other or similar so it shows up
                            abilities: {
                                ...baseCard.abilities,
                                other: [
                                    ...(baseCard.abilities?.other || []),
                                    {
                                        name: "Loadout / Details",
                                        description: unit.wargear,
                                        showAbility: true,
                                        showDescription: true
                                    }
                                ]
                            },
                            count: unit.count || 1,
                        };
                    } else {
                        // Fallback for custom/unmatched units
                        return {
                            id: uuidv4(),
                            uuid: uuidv4(),
                            name: unit.name,
                            cardType: "DataCard",
                            source: "40k-10e", // Fix source
                            points: [{ cost: unit.points.toString(), active: true }],
                            role: unit.role,
                            abilities: {
                                other: [
                                    {
                                        name: "Loadout / Details",
                                        description: unit.wargear,
                                        showAbility: true,
                                        showDescription: true
                                    }
                                ]
                            },
                            faction_id: "custom",
                            count: unit.count || 1,
                        };
                    }
                })
            };

            importCategory(newCategory);
            message.success(`Imported ${result.name} with ${result.units.length} units.`);
            setVisible(false);
            setText("");

        } catch (e) {
            console.error(e);
            message.error("Error importing roster.");
        }
    };

    return (
        <Modal
            title="Import Text Roster (10th Edition)"
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={[
                <Button key="cancel" onClick={() => setVisible(false)}>
                    Cancel
                </Button>,
                <Button key="import" type="primary" onClick={handleImport}>
                    Import
                </Button>,
            ]}
        >
            <p>Paste your army roster text below (e.g. from 40k App or generic text export).</p>
            <TextArea
                rows={10}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Imperial Knights - [2000 pts]..."
            />
        </Modal>
    );
};
