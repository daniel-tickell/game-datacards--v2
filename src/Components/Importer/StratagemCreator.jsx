
import { Button, Checkbox, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useCardStorage } from "../../Hooks/useCardStorage";
import { useDataSourceStorage } from "../../Hooks/useDataSourceStorage";

const { Option } = Select;

export const StratagemCreator = ({ visible, setVisible }) => {
    const { dataSource, selectedFaction } = useDataSourceStorage();
    const { importCategory } = useCardStorage();
    const [detachments, setDetachments] = useState([]);
    const [selectedDetachment, setSelectedDetachment] = useState(null);
    const [includeStandard, setIncludeStandard] = useState(true);

    useEffect(() => {
        if (selectedFaction?.stratagems) {
            // Extract unique detachments
            const uniqueDetachments = [
                ...new Set(
                    selectedFaction.stratagems
                        .map((s) => s.detachment)
                        .filter((id) => id !== undefined && id !== null && id !== "")
                ),
            ].sort();
            setDetachments(uniqueDetachments);
        }
    }, [selectedFaction]);

    const handleCreate = () => {
        if (!selectedFaction) {
            message.error("No faction selected.");
            return;
        }

        try {
            let stratagemsToImport = [];

            // 1. Filter faction stratagems by detachment
            if (selectedDetachment) {
                const detachmentStratagems = selectedFaction.stratagems.filter(
                    s => s.detachment === selectedDetachment
                );
                stratagemsToImport = [...detachmentStratagems];
            }

            // 2. Add standard stratagems if requested
            if (includeStandard && selectedFaction.basicStratagems) {
                // We need to ensure basic stratagems have the correct faction_id for context if needed,
                // though they are usually generic.
                const basics = selectedFaction.basicStratagems.map(s => ({
                    ...s,
                    faction_id: selectedFaction.id, // Assign current faction styling or generic?
                    // Usually basic stratagems might use a generic faction ID or the current one.
                    // DesktopUnitList maps them to selectedFaction.id.
                    subfaction_id: "standard" // MARK as standard/basic
                }));
                stratagemsToImport = [...stratagemsToImport, ...basics];
            } else if (includeStandard && !selectedFaction.basicStratagems) {
                // Fallback if basicStratagems not on selectedFaction (sometimes on dataSource root?)
                // Checked DesktopUnitList: `selectedFaction.basicStratagems`.
                console.warn("No basic stratagems found on selected faction.");
            }

            if (stratagemsToImport.length === 0) {
                message.warning("No stratagems found for selection.");
                return;
            }

            const newCategoryUuid = uuidv4();
            const categoryName = selectedDetachment
                ? `${selectedFaction.name} - ${selectedDetachment}`
                : `${selectedFaction.name} - Stratagems`;

            const newCategory = {
                uuid: newCategoryUuid,
                name: categoryName,
                type: "category",
                closed: false,
                cards: stratagemsToImport.map(strat => ({
                    ...strat,
                    id: uuidv4(), // New ID for the card instance
                    uuid: uuidv4(),
                    cardType: "stratagem",
                    // Ensure other props are there
                    source: "40k-10e",
                    count: 1
                }))
            };

            importCategory(newCategory);
            message.success(`Created category "${categoryName}" with ${stratagemsToImport.length} stratagems.`);
            setVisible(false);
            setSelectedDetachment(null); // Reset selection?

        } catch (e) {
            console.error(e);
            message.error("Error creating stratagems.");
        }
    };

    return (
        <Modal
            title="Create Stratagem Cards"
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={[
                <Button key="cancel" onClick={() => setVisible(false)}>
                    Cancel
                </Button>,
                <Button
                    key="create"
                    type="primary"
                    onClick={handleCreate}
                    disabled={!selectedDetachment} // Force detachment selection? Or allow just standard?
                >
                    Create
                </Button>,
            ]}
        >
            <p>Create a card set for <strong>{selectedFaction?.name || "No Faction Selected"}</strong>.</p>

            <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>Select Detachment:</label>
                <Select
                    style={{ width: "100%" }}
                    placeholder="Select Detachment"
                    value={selectedDetachment}
                    onChange={setSelectedDetachment}
                >
                    {detachments.map(d => (
                        <Option key={d} value={d}>{d}</Option>
                    ))}
                </Select>
            </div>

            <div>
                <Checkbox
                    checked={includeStandard}
                    onChange={e => setIncludeStandard(e.target.checked)}
                >
                    Include Standard Stratagems (Command Re-roll, etc.)
                </Checkbox>
            </div>

        </Modal>
    );
};
