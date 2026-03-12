import { replaceKeywords } from "../Components/Warhammer40k-10e/UnitCard/UnitAbilityDescription";

export const generateHtmlExport = (category, titleColor = "#456664", fontSize = 16) => {
    const sanitize = (str) => {
        if (!str && str !== 0) return "";
        return str.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    const css = `
    body { font-family: sans-serif; font-size: ${fontSize}px; background: #fff; color: #333; margin: 20px; }
    .export-container { max-width: 1000px; margin: 0 auto; }
    h1.category-title { text-align: center; margin-bottom: 30px; }
    .unit-card { border: 2px solid ${titleColor}; margin-bottom: 30px; border-radius: 4px; overflow: hidden; page-break-inside: avoid; }
    .unit-header { background-color: ${titleColor}; color: white; padding: 10px 15px; font-weight: bold; font-size: 1.2em; display: flex; justify-content: space-between; align-items: center; }
    .unit-header .unit-costs { font-size: 0.9em; font-weight: normal; }
    .unit-body { padding: 15px; }
    .stats-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; text-align: center; font-size: 1.1em; }
    .stats-table th, .stats-table td { border: 1px solid #ddd; padding: 8px; }
    .stats-table th { background-color: #f5f5f5; font-weight: bold; }
    .section-title { font-weight: bold; margin: 15px 0 10px; border-bottom: 2px solid ${titleColor}; padding-bottom: 4px; color: ${titleColor}; text-transform: uppercase; font-size: 0.9em; }
    .weapon-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 0.9em; text-align: center; }
    .weapon-table th, .weapon-table td { border: 1px solid #ddd; padding: 6px; }
    .weapon-table th { background-color: #f5f5f5; }
    .text-left { text-align: left; }
    .ability-item { margin-bottom: 8px; font-size: 0.9em; line-height: 1.4; }
    .ability-name { font-weight: bold; margin-right: 5px; }
    .keywords-section { margin-top: 20px; font-size: 0.85em; color: #555; background-color: #f9f9f9; padding: 10px; border-radius: 4px; }
    .keyword-title { font-weight: bold; margin-right: 5px; color: #333; }
    @media print {
      body { margin: 0; }
      .unit-card { margin-bottom: 20px; }
    }
  `;

    let htmlElements = category?.cards?.map(card => {
        // Stats
        const statsHtml = card.stats?.filter(s => s.active).map(stat => `
      <tr>
        <td>${sanitize(stat.m)}</td>
        <td>${sanitize(stat.t)}</td>
        <td>${sanitize(stat.sv)}</td>
        <td>${sanitize(stat.w)}</td>
        <td>${sanitize(stat.ld)}</td>
        <td>${sanitize(stat.oc)}</td>
      </tr>
    `).join("") || "";

        const renderWeapons = (weapons, title) => {
            if (!weapons || weapons.length === 0) return "";
            let hasVisibleWeapons = false;

            const rows = weapons.map(weapon => {
                const activeProfiles = weapon.profiles?.filter(p => p.active) || [];
                if (activeProfiles.length === 0) return "";
                hasVisibleWeapons = true;

                return activeProfiles.map((p, i) => `
          <tr>
            <td class="text-left" style="${i === 0 ? 'font-weight: bold;' : 'padding-left: 20px;'}">
              ${sanitize(p.name)}
              ${p.keywords?.length > 0 ? `<br/><small style="color: #666;">[${sanitize(p.keywords.join(", "))}]</small>` : ""}
            </td>
            <td>${sanitize(p.range)}</td>
            <td>${sanitize(p.attacks)}</td>
            <td>${sanitize(p.skill)}</td>
            <td>${sanitize(p.strength)}</td>
            <td>${sanitize(p.ap)}</td>
            <td>${sanitize(p.damage)}</td>
          </tr>
        `).join("");
            }).join("");

            if (!hasVisibleWeapons) return "";

            return `
        <div class="section-title">${title}</div>
        <table class="weapon-table">
          <thead>
            <tr>
              <th class="text-left">WEAPONS</th>
              <th>RANGE</th>
              <th>A</th>
              <th>BS/WS</th>
              <th>S</th>
              <th>AP</th>
              <th>D</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
        };

        const rangedHtml = renderWeapons(card.rangedWeapons, "Ranged Weapons");
        const meleeHtml = renderWeapons(card.meleeWeapons, "Melee Weapons");

        // Abilities
        const renderAbilitiesList = (abilities) => {
            if (!abilities || abilities.length === 0) return "";
            return abilities.filter(a => a.showAbility !== false).map(a => `
        <div class="ability-item">
          <span class="ability-name">${sanitize(a.name)}:</span>
          ${a.showDescription !== false && a.description ? sanitize(replaceKeywords(a.description)) : ""}
        </div>
      `).join("");
        };

        let abilitiesHtml = "";
        if (card.abilities) {
            const core = card.abilities.core?.length > 0 ? `<div class="ability-item"><span class="ability-name">Core:</span> ${sanitize(card.abilities.core.join(", "))}</div>` : "";
            const faction = card.abilities.faction?.length > 0 ? `<div class="ability-item"><span class="ability-name">Faction:</span> ${sanitize(card.abilities.faction.join(", "))}</div>` : "";
            const other = renderAbilitiesList(card.abilities.other);
            const wargear = renderAbilitiesList(card.abilities.wargear);
            const special = renderAbilitiesList(card.abilities.special);

            let invul = "";
            if (card.abilities.invul?.showInvulnerableSave) {
                invul = `<div class="ability-item"><span class="ability-name">Invulnerable Save:</span> ${sanitize(card.abilities.invul.value)} ${card.abilities.invul.info ? `(${sanitize(card.abilities.invul.info)})` : ''}</div>`;
            }

            if (core || faction || other || wargear || special || invul) {
                abilitiesHtml = `
          <div class="section-title">Abilities</div>
          ${core}
          ${faction}
          ${invul}
          ${other}
          ${wargear ? `<div style="margin-top: 10px; font-weight: bold; font-size: 0.9em;">Wargear Abilities:</div>${wargear}` : ""}
          ${special}
        `;
            }
        }

        // Keywords and Factions
        const keywordsHtml = card.keywords?.length > 0 ? `<div><span class="keyword-title">KEYWORDS:</span> ${sanitize(card.keywords.join(", ").toUpperCase())}</div>` : "";
        const factionsHtml = card.factions?.length > 0 ? `<div style="margin-top: 5px;"><span class="keyword-title">FACTION KEYWORDS:</span> ${sanitize(card.factions.join(", ").toUpperCase())}</div>` : "";

        const points = card.points ? `<span class="unit-costs">${sanitize(card.points)} PTS</span>` : "";

        return `
      <div class="unit-card">
        <div class="unit-header">
          <span>${sanitize(card.name)}</span>
          ${points}
        </div>
        <div class="unit-body">
          ${statsHtml ? `
            <table class="stats-table">
              <thead>
                <tr><th>M</th><th>T</th><th>SV</th><th>W</th><th>LD</th><th>OC</th></tr>
              </thead>
              <tbody>${statsHtml}</tbody>
            </table>
          ` : ""}
          
          ${rangedHtml}
          ${meleeHtml}
          ${abilitiesHtml}
          
          ${(keywordsHtml || factionsHtml) ? `
            <div class="keywords-section">
              ${keywordsHtml}
              ${factionsHtml}
            </div>
          ` : ""}
        </div>
      </div>
    `;
    }).join("") || "<p>No units in this list.</p>";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${sanitize(category?.name || "Export")}</title>
  <style>
    ${css}
  </style>
</head>
<body>
  <div class="export-container">
    <h1 class="category-title">${sanitize(category?.name || "Warhammer 40k List")}</h1>
    ${htmlElements}
  </div>
</body>
</html>`;
};
