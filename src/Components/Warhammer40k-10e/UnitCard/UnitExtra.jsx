import { UnitAbility } from "./UnitAbility";
import { UnitAbilityDescription, replaceKeywords } from "./UnitAbilityDescription";
import { UnitInvul } from "./UnitInvul";

export const UnitExtra = ({ unit, fontSize, side = "front" }) => {
  const abilitiesFontSize = fontSize || 12;

  const showCore = unit?.showAbilities?.["core"] !== false && (unit.abilityPositions?.core || "front") === side;
  const showFaction = unit?.showAbilities?.["faction"] !== false && (unit.abilityPositions?.faction || "front") === side;
  const showOther = unit?.showAbilities?.["other"] !== false && (unit.abilityPositions?.other || "front") === side;
  const showWargear = unit?.showAbilities?.["wargear"] !== false && (unit.abilityPositions?.wargear || "front") === side;
  const showDamaged = unit.abilities?.damaged && unit.abilities?.damaged.showDamagedAbility && (unit.abilityPositions?.damaged || "front") === side;
  const showSpecial = unit?.showAbilities?.["special"] !== false && unit.abilities?.special && (unit.abilityPositions?.special || "front") === side;

  return (
    <div className="extra">
      {(showCore || showFaction || showOther) && (
        <div className="abilities">
          <div className="heading">
            <div className="title">Abilities</div>
          </div>
          {showCore && (
            <UnitAbility
              name={"core"}
              value={unit.abilities?.core?.join(", ")}
              style={{ fontSize: `${abilitiesFontSize}px` }}
            />
          )}
          {showFaction && (
            <UnitAbility
              name={"faction"}
              value={unit.abilities?.faction?.join(", ")}
              style={{ fontSize: `${abilitiesFontSize}px` }}
            />
          )}
          {showOther &&
            unit.abilities?.other
              ?.filter((ability) => ability.showAbility)
              ?.map((ability, index) => {
                return (
                  <UnitAbilityDescription
                    name={ability.name}
                    description={ability?.description}
                    showDescription={ability?.showDescription}
                    key={`ability-${index}`}
                    style={{ fontSize: `${abilitiesFontSize}px` }}
                  />
                );
              })}
        </div>
      )}
      {showWargear &&
        unit.abilities?.wargear?.filter((ability) => ability.showAbility)?.length > 0 && (
          <div className="abilities">
            <div className="heading">
              <div className="title">Wargear abilities</div>
            </div>
            {unit.abilities?.wargear
              ?.filter((ability) => ability.showAbility)
              ?.map((ability, index) => {
                return (
                  <UnitAbilityDescription
                    name={ability.name}
                    description={ability.description}
                    showDescription={ability.showDescription}
                    key={`ability-${index}`}
                    style={{ fontSize: `${abilitiesFontSize}px` }}
                  />
                );
              })}
          </div>
        )}
      {showDamaged && (
        <div className="damaged" style={{ fontSize: `${abilitiesFontSize}px` }}>
          <div className="heading">
            <div className="title">Damaged: {unit.abilities?.damaged?.range}</div>
          </div>
          {unit.abilities?.damaged.showDescription && (
            <div className="description" style={{ fontSize: `${abilitiesFontSize}px` }}>
              {replaceKeywords(unit.abilities?.damaged?.description)}
            </div>
          )}
        </div>
      )}
      {showSpecial && (
        <>
          {unit.abilities?.special
            ?.filter((ability) => ability.showAbility)
            ?.map((ability, index) => {
              return (
                <div className="special" key={`special-${ability.name}`} style={{ fontSize: `${abilitiesFontSize}px` }}>
                  <div className="heading">
                    <div className="title">{ability.name}</div>
                  </div>
                  {ability.showDescription && (
                    <div className="description-container">
                      <span className="description">{replaceKeywords(ability.description)}</span>
                    </div>
                  )}
                </div>
              );
            })}
        </>
      )}
      {unit.abilities?.invul?.showInvulnerableSave && !unit.abilities?.invul?.showAtTop && (
        <UnitInvul invul={unit.abilities?.invul} />
      )}
    </div>
  );
};
