import { Button, Col, Input, InputNumber, Row, Slider, message } from "antd";
import React, { useEffect, useState } from "react";
import { useCardStorage } from "../Hooks/useCardStorage";

export const CategoryStyleEditor = () => {
    const { activeCategory, updateCategoryStyles } = useCardStorage();
    const [styles, setStyles] = useState({
        bannerColor: "#103344",
        headerColor: "#456664",
        externalImage: "",
        imagePositionX: 0,
        imagePositionY: 0,
        imageWidth: 380,
        imageHeight: 196,
    });

    useEffect(() => {
        if (activeCategory && activeCategory.cards && activeCategory.cards.length > 0) {
            const firstCard = activeCategory.cards[0];
            setStyles({
                bannerColor: firstCard.bannerColor || "#103344",
                headerColor: firstCard.headerColor || "#456664",
                externalImage: firstCard.externalImage || "",
                imagePositionX: firstCard.imagePositionX || 0,
                imagePositionY: firstCard.imagePositionY || 0,
                imageWidth: firstCard.imageWidth || 380,
                imageHeight: firstCard.imageHeight || 196,
            });
        }
    }, [activeCategory]);

    const handleStyleUpdate = () => {
        if (activeCategory) {
            updateCategoryStyles(activeCategory, styles);
            message.success("Category styles updated.");
        }
    };

    if (!activeCategory) {
        return <div>No category selected</div>;
    }

    return (
        <div style={{ padding: "16px" }}>
            <h2>Edit Category Styles</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Row gutter={16} align="middle">
                    <Col span={8}>Banner Color:</Col>
                    <Col span={16}>
                        <input
                            type="color"
                            value={styles.bannerColor}
                            onChange={(e) => setStyles({ ...styles, bannerColor: e.target.value })}
                            style={{ width: "100%", height: "32px", padding: 0, border: "none" }}
                        />
                    </Col>
                </Row>
                <Row gutter={16} align="middle">
                    <Col span={8}>Header Color:</Col>
                    <Col span={16}>
                        <input
                            type="color"
                            value={styles.headerColor}
                            onChange={(e) => setStyles({ ...styles, headerColor: e.target.value })}
                            style={{ width: "100%", height: "32px", padding: 0, border: "none" }}
                        />
                    </Col>
                </Row>
                <Row gutter={16} align="middle">
                    <Col span={8}>External Image URL:</Col>
                    <Col span={16}>
                        <Input
                            value={styles.externalImage}
                            onChange={(e) => setStyles({ ...styles, externalImage: e.target.value })}
                            placeholder="https://example.com/image.png"
                        />
                    </Col>
                </Row>
                <Row gutter={16} align="middle">
                    <Col span={8}>Image Width:</Col>
                    <Col span={16}>
                        <Slider
                            min={100}
                            max={800}
                            value={styles.imageWidth}
                            onChange={(val) => setStyles({ ...styles, imageWidth: val })}
                        />
                        <InputNumber value={styles.imageWidth} onChange={(val) => setStyles({ ...styles, imageWidth: val })} />
                    </Col>
                </Row>
                <Row gutter={16} align="middle">
                    <Col span={8}>Image Height:</Col>
                    <Col span={16}>
                        <Slider
                            min={100}
                            max={800}
                            value={styles.imageHeight}
                            onChange={(val) => setStyles({ ...styles, imageHeight: val })}
                        />
                        <InputNumber value={styles.imageHeight} onChange={(val) => setStyles({ ...styles, imageHeight: val })} />
                    </Col>
                </Row>
                <Row gutter={16} align="middle">
                    <Col span={8}>Position X:</Col>
                    <Col span={16}>
                        <Slider
                            min={-500}
                            max={500}
                            value={styles.imagePositionX}
                            onChange={(val) => setStyles({ ...styles, imagePositionX: val })}
                        />
                        <InputNumber value={styles.imagePositionX} onChange={(val) => setStyles({ ...styles, imagePositionX: val })} />
                    </Col>
                </Row>
                <Row gutter={16} align="middle">
                    <Col span={8}>Position Y:</Col>
                    <Col span={16}>
                        <Slider
                            min={-500}
                            max={500}
                            value={styles.imagePositionY}
                            onChange={(val) => setStyles({ ...styles, imagePositionY: val })}
                        />
                        <InputNumber value={styles.imagePositionY} onChange={(val) => setStyles({ ...styles, imagePositionY: val })} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Button type="primary" onClick={handleStyleUpdate} block>Apply to All Cards</Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
};
