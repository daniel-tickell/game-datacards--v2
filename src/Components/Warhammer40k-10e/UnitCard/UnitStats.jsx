import { ReactFitty } from "react-fitty";
import { UnitStat } from "./UnitStat";

export const UnitStats = ({ stats, fontSize }) => {
  const statsFontSize = fontSize || 22;
  const statHeaders = [
    { text: "M", value: "m" },
    { text: "T", value: "t" },
    { text: "SV", value: "sv" },
    { text: "W", value: "w" },
    { text: "LD", value: "ld" },
    { text: "OC", value: "oc" },
  ];
  // statHeaders.forEach((header, index) => {
  //   stats
  //     ?.filter((stat) => stat.active)
  //     ?.map((stat) => {
  //       if (stat?.[header.value] && stat?.[header.value].length >= 3) {
  //         statHeaders[index].width = "60px";
  //       }
  //     });
  // });
  return (
    <>
      <div className="stats_container">
        {statHeaders.map((header) => {
          return (
            <div className="stat" key={header.value}>
              <div className="caption">{header.text}</div>
            </div>
          );
        })}
      </div>
      {stats
        ?.filter((stat) => stat.active)
        ?.map((stat, index) => {
          return (
            <div className="stats_container" key={`stat-line-${index}`}>
              <UnitStat value={stat.m} style={{ fontSize: `${statsFontSize}px` }} />
              <UnitStat value={stat.t} style={{ fontSize: `${statsFontSize}px` }} />
              <UnitStat value={stat.sv} style={{ fontSize: `${statsFontSize}px` }} />
              <UnitStat
                value={stat.w}
                showDamagedMarker={stat.showDamagedMarker}
                style={{ fontSize: `${statsFontSize}px` }}
              />
              <UnitStat value={stat.ld} style={{ fontSize: `${statsFontSize}px` }} />
              <UnitStat value={stat.oc} style={{ fontSize: `${statsFontSize}px` }} />
              {stat.showName && (
                <div className="name">
                  <ReactFitty maxSize={16} minSize={10}>
                    {stat.name}
                  </ReactFitty>
                </div>
              )}
            </div>
          );
        })}
    </>
  );
};
