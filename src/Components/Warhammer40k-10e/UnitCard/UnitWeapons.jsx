import { UnitAbilityDescription } from "./UnitAbilityDescription";
import { UnitWeaponsType } from "./UnitWeaponsType";
import { UnitWeapon } from "./UnitWeapon"; // Added import for UnitWeapon

export const UnitWeapons = ({ unit, fontSize, side = "front" }) => {
  const weaponsFontSize = fontSize || 14;

  const showPrimarch = unit.abilities.primarch && unit.abilities.primarch.length > 0 && (unit.abilityPositions?.primarch || "front") === side;

  return (
    <div className="weapons">
      {side === "front" && unit.showWeapons?.["rangedWeapons"] !== false && unit.rangedWeapons?.length > 0 && (
        <UnitWeaponsType
          weaponType={{ name: "Ranged weapons", class: "ranged", skill: "BS" }}
          weapons={unit.rangedWeapons}
          fontSize={weaponsFontSize}
        />
      )}
      {side === "front" && unit.showWeapons?.["meleeWeapons"] !== false && unit.meleeWeapons?.length > 0 && (
        <UnitWeaponsType
          weaponType={{ name: "Melee weapons", class: "melee", skill: "WS" }}
          weapons={unit.meleeWeapons}
          fontSize={weaponsFontSize}
        />
      )}
      {showPrimarch && (
        <>
          {unit.abilities.primarch
            ?.filter((ability) => ability.showAbility)
            .map((primarchAbility, index) => {
              return (
                <div className="special" key={`special-${primarchAbility.name}`}>
                  <div className="heading">
                    <div className="title">{primarchAbility.name}</div>
                  </div>
                  {primarchAbility.abilities
                    ?.filter((ability) => ability.showAbility)
                    ?.map((ability, index) => {
                      return (
                        <UnitAbilityDescription
                          name={ability.name}
                          description={ability.description}
                          showDescription={ability.showDescription}
                          key={`ability-${index}`}
                        />
                      );
                    })}
                </div>
              );
            })}
        </>
      )}
    </div>
  );
};
