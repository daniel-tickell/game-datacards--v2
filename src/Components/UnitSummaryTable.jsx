import { Modal, Table, Typography, Tag, Button } from "antd";
import React, { useMemo } from "react";
import { useCardStorage } from "../Hooks/useCardStorage";
import { PrinterOutlined } from "@ant-design/icons";

export const UnitSummaryTable = ({ visible, setVisible }) => {
    const { activeCategory } = useCardStorage();

    const columns = [
        {
            title: "Unit Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => {
                return {
                    children: <Typography.Text strong>{text}</Typography.Text>,
                    props: {
                        rowSpan: record.rowSpan,
                    },
                };
            },
        },
        {
            title: "M",
            dataIndex: ["stats", "m"],
            key: "m",
            width: 60,
            align: "center",
            render: (text, record) => ({
                children: text,
                props: { rowSpan: record.rowSpan },
            }),
        },
        {
            title: "T",
            dataIndex: ["stats", "t"],
            key: "t",
            width: 60,
            align: "center",
            render: (text, record) => ({
                children: text,
                props: { rowSpan: record.rowSpan },
            }),
        },
        {
            title: "Sv",
            dataIndex: ["stats", "sv"],
            key: "sv",
            width: 60,
            align: "center",
            render: (text, record) => ({
                children: text,
                props: { rowSpan: record.rowSpan },
            }),
        },
        {
            title: "W",
            dataIndex: ["stats", "w"],
            key: "w",
            width: 60,
            align: "center",
            render: (text, record) => ({
                children: text,
                props: { rowSpan: record.rowSpan },
            }),
        },
        {
            title: "Ld",
            dataIndex: ["stats", "ld"],
            key: "ld",
            width: 60,
            align: "center",
            render: (text, record) => ({
                children: text,
                props: { rowSpan: record.rowSpan },
            }),
        },
        {
            title: "OC",
            dataIndex: ["stats", "oc"],
            key: "oc",
            width: 60,
            align: "center",
            render: (text, record) => ({
                children: text,
                props: { rowSpan: record.rowSpan },
            }),
        },
        {
            title: "Weapon",
            dataIndex: "weaponName",
            key: "weaponName",
            width: 200,
            render: (text) => <Typography.Text>{text}</Typography.Text>,
        },
        {
            title: "Range",
            dataIndex: "range",
            key: "range",
            width: 80,
            align: "center",
        },
        {
            title: "A",
            dataIndex: "attacks",
            key: "attacks",
            width: 60,
            align: "center",
        },
        {
            title: "BS/WS",
            dataIndex: "skill",
            key: "skill",
            width: 80,
            align: "center",
        },
        {
            title: "S",
            dataIndex: "strength",
            key: "strength",
            width: 60,
            align: "center",
        },
        {
            title: "AP",
            dataIndex: "ap",
            key: "ap",
            width: 60,
            align: "center",
        },
        {
            title: "D",
            dataIndex: "damage",
            key: "damage",
            width: 60,
            align: "center",
        },
        {
            title: "Keywords",
            dataIndex: "keywords",
            key: "keywords",
            width: 120,
            render: (keywords) => (
                <div style={{ fontSize: "0.8em", opacity: 0.8 }}>
                    {keywords?.map((k, i) => (
                        <div key={i}>{k.name || k}</div>
                    ))}
                </div>
            ),
        },
    ];

    const data = useMemo(() => {
        const flattenedData = [];
        let unitCounter = 0;

        if (activeCategory && activeCategory.cards) {
            activeCategory.cards.forEach((card) => {
                if (card.source === "40k-10e" && card.cardType === "DataCard") {
                    const currentUnitIndex = unitCounter++;
                    const validStats = card.stats?.filter((s) => s.active !== false);
                    const activeStat = validStats?.[0] || {};

                    let weaponProfiles = [];

                    const processWeapons = (weaponsList) => {
                        weaponsList?.filter(w => w.active !== false)?.forEach(w => {
                            if (w.profiles && w.profiles.length > 0) {
                                w.profiles.filter(p => p.active !== false).forEach(p => {
                                    weaponProfiles.push({
                                        ...p,
                                        weaponName: w.name ? (p.name === w.name ? p.name : `${w.name} - ${p.name}`) : p.name,
                                        keywords: p.keywords
                                    });
                                })
                            } else {
                                weaponProfiles.push({
                                    ...w,
                                    weaponName: w.name || "Unknown Weapon",
                                });
                            }
                        })
                    }

                    if (card.rangedWeapons) processWeapons(card.rangedWeapons);
                    if (card.meleeWeapons) processWeapons(card.meleeWeapons);

                    if (weaponProfiles.length === 0) {
                        flattenedData.push({
                            key: `${card.uuid}-noweapon`,
                            name: card.name,
                            stats: {
                                m: activeStat.m,
                                t: activeStat.t,
                                sv: activeStat.sv,
                                w: activeStat.w,
                                ld: activeStat.ld,
                                oc: activeStat.oc,
                            },
                            rowSpan: 1,
                            weaponName: "-",
                            unitIndex: currentUnitIndex,
                        })
                    } else {
                        weaponProfiles.forEach((profile, index) => {
                            flattenedData.push({
                                key: `${card.uuid}-${index}`,
                                name: card.name,
                                stats: {
                                    m: activeStat.m,
                                    t: activeStat.t,
                                    sv: activeStat.sv,
                                    w: activeStat.w,
                                    ld: activeStat.ld,
                                    oc: activeStat.oc,
                                },
                                rowSpan: index === 0 ? weaponProfiles.length : 0,
                                weaponName: profile.weaponName,
                                range: profile.range,
                                attacks: profile.attacks,
                                skill: profile.skill,
                                strength: profile.strength,
                                ap: profile.ap,
                                damage: profile.damage,
                                keywords: profile.keywords,
                                unitIndex: currentUnitIndex,
                            });
                        });
                    }
                }
            });
        }
        return flattenedData;
    }, [activeCategory]);

    return (
        <Modal
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight: 24 }}>
                    <span>Unit Summary</span>
                    <Button className="no-print" icon={<PrinterOutlined />} onClick={() => window.print()}>Print</Button>
                </div>
            }
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={null}
            width={1400}
            style={{ top: 20 }}
            bodyStyle={{ padding: 0 }}
            centered
            className="unit-summary-modal"
        >
            <div className="unit-summary-print-container">
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                    scroll={{ y: "calc(85vh - 100px)", x: 'max-content' }}
                    size="middle"
                    rowKey="key"
                    bordered
                    rowClassName={(record, index, data) => {
                        let classes = record.unitIndex % 2 === 0 ? "even-row" : "odd-row";
                        if (record.rowSpan > 0) classes += " unit-first-row";
                        if (index === data.length - 1 || data[index + 1]?.unitIndex !== record.unitIndex) {
                            classes += " unit-last-row";
                        }
                        return classes;
                    }}
                />
            </div>
            <style>{`
        .even-row {
            background-color: #ffffff;
        }
        .odd-row {
            background-color: #f4f4f4;
        }
        .unit-first-row > td {
            border-top: 2px solid #000 !important;
        }
        .unit-last-row > td {
            border-bottom: 2px solid #000 !important;
        }
        /* Make sure the rowSpan cell (first col) also gets the bottom border */
        .unit-first-row > td:first-child {
            border-bottom: 2px solid #000 !important;
        }
        .ant-table-thead > tr > th {
            border-bottom: 2px solid #000 !important;
            border-top: 2px solid #000 !important;
        }
        .ant-table-wrapper .ant-table-container {
            border-left: 2px solid #000 !important;
            border-right: 2px solid #000 !important;
        }
        @media print {
            @page {
                size: landscape;
                margin: 0.5in;
            }
            body * {
                visibility: hidden;
            }
            .unit-summary-modal, .unit-summary-modal * {
                visibility: visible;
            }
            .ant-modal-root {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
            }
            .ant-modal-wrap {
                position: static !important;
                overflow: visible !important;
                display: block !important;
            }
            .unit-summary-modal {
                position: static !important;
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            .no-print {
                display: none !important;
            }
            .ant-modal-content {
                box-shadow: none !important;
                padding: 0 !important;
            }
            .ant-table-wrapper, 
            .ant-spin-nested-loading, 
            .ant-spin-container, 
            .ant-table, 
            .ant-table-container, 
            .ant-table-content, 
            .ant-table-body,
            .ant-table-header {
                overflow: visible !important;
                max-height: none !important;
                height: auto !important;
            }
            .ant-table {
                font-size: 12px !important;
            }
             .unit-summary-print-container {
                display: block;
            }
            .even-row {
                background-color: #ffffff !important;
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
            }
            .odd-row {
                background-color: #f0f0f0 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            /* Adjust padding to save space */
            .ant-table-cell {
                padding: 4px 4px !important;
            }
            /* Name column */
            .ant-table-cell:first-child {
                max-width: 140px !important;
                word-wrap: break-word !important;
                white-space: normal !important;
            }
            /* Make keywords wrap */
            .ant-table-cell:last-child div {
                white-space: normal !important;
                word-wrap: break-word !important;
            }
        }
      `}</style>
        </Modal>
    );
};
