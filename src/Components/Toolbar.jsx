import { FileImageOutlined, FolderAddOutlined, PrinterOutlined, SaveOutlined, FileTextOutlined, ThunderboltOutlined, TableOutlined } from "@ant-design/icons";
import { Button, Col, Row, Tooltip, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCardStorage } from "../Hooks/useCardStorage";
import { useFirebase } from "../Hooks/useFirebase";

import { Parser } from "xml2js";
import { useSettingsStorage } from "../Hooks/useSettingsStorage";
import { ListCards } from "../Icons/ListCards";
import { Exporter } from "./Importer/Exporter";
import { Importer } from "./Importer/Importer";
import { TextRosterImporter } from "./Importer/TextRosterImporter";
import { StratagemCreator } from "./Importer/StratagemCreator";
import { UnitSummaryTable } from "./UnitSummaryTable";

const parser = new Parser({ mergeAttrs: true, explicitArray: false });

const parseString = parser.parseString;

export const Toolbar = ({ selectedTreeKey, setSelectedTreeKey }) => {
  const { settings } = useSettingsStorage();
  const [showTextImporter, setShowTextImporter] = useState(false);
  const [showStratagemCreator, setShowStratagemCreator] = useState(false);
  const [showSummaryTable, setShowSummaryTable] = useState(false);

  const navigate = useNavigate();

  const { cardStorage, activeCategory, saveActiveCard, cardUpdated, addCategory } = useCardStorage();

  return (
    <Row style={{ justifyContent: "space-between", background: "white", borderBottom: "1px solid #E5E5E5" }}>
      <Col
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          background: "white",
        }}>
        <Tooltip title={"Print cards from category"} placement="bottomLeft">
          <Button
            type={"text"}
            shape={"circle"}
            disabled={!(activeCategory && activeCategory.cards.length > 0)}
            onClick={() => {
              const categoryIndex = cardStorage?.categories?.findIndex((cat) => cat.uuid === activeCategory.uuid);
              if (settings.legacyPrinting) {
                navigate(`/legacy-print/${categoryIndex}`);
              } else {
                navigate(`/print/${categoryIndex}`);
              }
            }}
            icon={<PrinterOutlined />}
          />
        </Tooltip>
        <Tooltip title={"Export category to images/PDF"} placement="bottomLeft">
          <Button
            type={"text"}
            shape={"circle"}
            disabled={!(activeCategory && activeCategory.cards.length > 0)}
            onClick={() => {
              const categoryIndex = cardStorage?.categories?.findIndex((cat) => cat.uuid === activeCategory.uuid);
              navigate(`/image-export/${categoryIndex}`);
            }}
            icon={<FileImageOutlined />}
          />
        </Tooltip>
        <Exporter />
        <Importer />
        <Tooltip title={"Import Text Roster"} placement="bottomLeft">
          <Button
            type={"text"}
            shape={"circle"}
            icon={<FileTextOutlined />}
            onClick={() => {
              setShowTextImporter(true);
            }}
          />
        </Tooltip>
        <Tooltip title={"Create Stratagems"} placement="bottomLeft">
          <Button
            type={"text"}
            shape={"circle"}
            icon={<ThunderboltOutlined />}
            onClick={() => {
              setShowStratagemCreator(true);
            }}
          />
        </Tooltip>
        <Tooltip title={"Add new category"} placement="bottomLeft">
          <Button
            type={"text"}
            shape={"circle"}
            icon={<FolderAddOutlined />}
            onClick={() => {
              addCategory("New Category");
            }}
          />
        </Tooltip>
        <Tooltip title={"Add new list"} placement="bottomLeft">
          <Button
            type={"text"}
            shape={"circle"}
            icon={<ListCards />}
            onClick={() => {
              addCategory("New List", "list");
            }}
          />
        </Tooltip>
        <TextRosterImporter visible={showTextImporter} setVisible={setShowTextImporter} />
        <StratagemCreator visible={showStratagemCreator} setVisible={setShowStratagemCreator} />
        <Tooltip title={"Unit Summary Table"} placement="bottomLeft">
          <Button
            type={"text"}
            shape={"circle"}
            icon={<TableOutlined />}
            onClick={() => {
              setShowSummaryTable(true);
            }}
          />
        </Tooltip>
        <UnitSummaryTable visible={showSummaryTable} setVisible={setShowSummaryTable} />
      </Col>
      <Col
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          background: "white",
          alignItems: "center",
          paddingRight: "4px",
        }}>
        {selectedTreeKey?.includes("card") && (
          <>
            <Tooltip title={"Update selected card"} placement="bottom">
              <Button
                icon={<SaveOutlined />}
                type={"ghost"}
                size={"small"}
                disabled={!cardUpdated}
                onClick={() => {
                  saveActiveCard();
                  message.success("Card has been updated");
                }}>
                save
              </Button>
            </Tooltip>
          </>
        )}
      </Col>
    </Row>
  );
};
