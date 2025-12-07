import { UnitFactions } from "./UnitCard/UnitFactions";
import { UnitKeywords } from "./UnitCard/UnitKeywords";
import { UnitLoadout } from "./UnitCard/UnitLoadout";
import { UnitName } from "./UnitCard/UnitName";
import { UnitWargear } from "./UnitCard/UnitWargear";
import { useDataSourceStorage } from "../../Hooks/useDataSourceStorage";

export const UnitCardBack = ({ unit, cardStyle, paddingTop = "32px", className }) => {
  const { dataSource } = useDataSourceStorage();
  const cardFaction = dataSource.data.find((faction) => faction.id === unit?.faction_id);

  const headerColor = unit.headerColor || cardStyle?.["--header-colour"] || cardFaction?.colours?.header || "#456664";
  const bannerColor = unit.bannerColor || cardStyle?.["--banner-colour"] || cardFaction?.colours?.banner || "#103344";

  return (
    <div
      className={className}
      style={{
        ...cardStyle,
        justifyContent: "center",
        justifyItems: "center",
        display: "flex",
        "--header-colour": headerColor,
        "--banner-colour": bannerColor,
        "--stat-text-colour": headerColor,
        "--weapon-keyword-colour": headerColor,
      }}>
      <div className={`unit back`} data-name={unit.name} data-fullname={`${unit.name} ${unit.subname}`}>
        <div className={"header back"}>
          <UnitName name={unit.name} subname={unit.subname} />
        </div>
        <div className="data_container ">
          <div className="data back">
            <UnitWargear unit={unit} />
            <UnitLoadout unit={unit} />
          </div>
        </div>
        <div className="footer">
          <UnitKeywords keywords={unit.keywords} />
          <UnitFactions factions={unit.factions} />
        </div>
        <div className="faction">
          <div className={unit.faction_id}></div>
        </div>
      </div>
    </div>
  );
};
