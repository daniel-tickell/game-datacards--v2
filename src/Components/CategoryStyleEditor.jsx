import React, { useEffect, useState } from "react";
import { Button, Col, Input, InputNumber, Row, Slider, message, Upload, Space, Typography, Select } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useCardStorage } from "../Hooks/useCardStorage";
import { useIndexedDBImages } from "../Hooks/useIndexedDBImages";
import { useDataSourceStorage } from "../Hooks/useDataSourceStorage";

const { Text } = Typography;
const { Option } = Select;


export const CategoryStyleEditor = () => {
    const { activeCategory, updateCategoryStyles } = useCardStorage();
    const { saveImage, deleteImage, getImageData, isReady } = useIndexedDBImages();
    const { dataSource } = useDataSourceStorage();
    const [localImageInfo, setLocalImageInfo] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [styles, setStyles] = useState({
        bannerColor: "#103344",
        headerColor: "#456664",
        externalImage: "",
        imagePositionX: 0,
        imagePositionY: 0,
        imageWidth: 380,
        imageHeight: 196,
        imageZIndex: "default",
    });

    useEffect(() => {
        if (activeCategory && activeCategory.cards && activeCategory.cards.length > 0) {
            const firstCard = activeCategory.cards[0];
            const cardFaction = dataSource.data.find((faction) => faction.id === firstCard?.faction_id);
            const defaultBanner = cardFaction?.colours?.banner || "#103344";
            const defaultHeader = cardFaction?.colours?.header || "#456664";

            setStyles({
                bannerColor: firstCard.bannerColor || defaultBanner,
                headerColor: firstCard.headerColor || defaultHeader,
                externalImage: firstCard.externalImage || "",
                imagePositionX: firstCard.imagePositionX || 0,
                imagePositionY: firstCard.imagePositionY || 0,
                imageWidth: firstCard.imageWidth || 380,
                imageHeight: firstCard.imageHeight || 196,
                imageZIndex: firstCard.imageZIndex || "default",
            });
        }
    }, [activeCategory, dataSource]);

    useEffect(() => {
        const loadImageInfo = async () => {
            if (activeCategory?.uuid && isReady) {
                const imageData = await getImageData(activeCategory.uuid);
                if (imageData) {
                    setLocalImageInfo({
                        filename: imageData.filename,
                        size: imageData.size,
                        hasCategoryLocalImage: true,
                    });
                    setStyles(prev => ({ ...prev, hasCategoryLocalImage: true }));
                } else {
                    setLocalImageInfo(null);
                    setStyles(prev => ({ ...prev, hasCategoryLocalImage: false }));
                }
            } else {
                setLocalImageInfo(null);
            }
        };
        loadImageInfo();
    }, [activeCategory?.uuid, isReady, getImageData]);

    const handleImageUpload = async (file) => {
        const actualFile = file?.file || file;

        if (!actualFile) {
            message.error("No file selected");
            return false;
        }

        if (!activeCategory?.uuid) {
            message.error("No category selected");
            return false;
        }

        if (actualFile.size > 5 * 1024 * 1024) {
            message.error("Image size must be less than 5MB");
            return false;
        }

        if (!actualFile.type.startsWith("image/")) {
            message.error("Please upload an image file");
            return false;
        }

        setUploading(true);
        try {
            await saveImage(activeCategory.uuid, actualFile);
            setLocalImageInfo({
                filename: actualFile.name,
                size: actualFile.size,
                hasCategoryLocalImage: true,
            });
            setStyles(prev => ({ ...prev, hasCategoryLocalImage: true }));
            message.success("Image uploaded successfully");
        } catch (error) {
            console.error("Failed to upload image:", error);
            message.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
        return false;
    };

    const handleDeleteLocalImage = async () => {
        if (!activeCategory?.uuid) return;

        try {
            await deleteImage(activeCategory.uuid);
            setLocalImageInfo(null);
            setStyles(prev => ({ ...prev, hasCategoryLocalImage: false }));
            message.success("Local image removed");
        } catch (error) {
            console.error("Failed to delete image:", error);
            message.error("Failed to delete image");
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " bytes";
        else if (bytes < 1048576) return Math.round(bytes / 1024) + " KB";
        else return Math.round((bytes / 1048576) * 10) / 10 + " MB";
    };

    const handleStyleUpdate = () => {
        if (activeCategory) {
            updateCategoryStyles(activeCategory, {
                ...styles,
                categoryUuid: activeCategory.uuid,
                hasCategoryLocalImage: localImageInfo ? true : false,
            });
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
                    <Col span={8}>Local Image:</Col>
                    <Col span={16}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                            {!localImageInfo ? (
                                <Upload
                                    accept="image/*"
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        handleImageUpload(file);
                                        return false;
                                    }}
                                    disabled={!isReady}
                                >
                                    <Button icon={<UploadOutlined />} loading={uploading} disabled={!isReady}>
                                        Upload
                                    </Button>
                                </Upload>
                            ) : (
                                <Space>
                                    <Text>
                                        {localImageInfo.filename} ({formatFileSize(localImageInfo.size)})
                                    </Text>
                                    <Button icon={<DeleteOutlined />} size="small" danger onClick={handleDeleteLocalImage}>
                                        Remove
                                    </Button>
                                </Space>
                            )}
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Applied to all cards in category
                            </Text>
                        </Space>
                    </Col>
                </Row>
                <Row gutter={16} align="middle">
                    <Col span={8}>Show on top:</Col>
                    <Col span={16}>
                        <Select
                            value={styles.imageZIndex || "default"}
                            onChange={(value) => setStyles({ ...styles, imageZIndex: value })}
                            style={{ width: "100%" }}
                        >
                            <Option value="default">Default</Option>
                            <Option value="onTop">On top</Option>
                        </Select>
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
