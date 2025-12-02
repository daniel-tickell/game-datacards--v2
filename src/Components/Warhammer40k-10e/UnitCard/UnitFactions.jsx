export const UnitFactions = ({ factions, fontSize }) => {
  const factionsFontSize = fontSize || 18;
  return (
    <div className="factions" style={{ fontSize: `${factionsFontSize}px` }}>
      <span className="title">faction keywords</span>
      <span className="value">{factions?.join(", ")}</span>
    </div>
  );
};
