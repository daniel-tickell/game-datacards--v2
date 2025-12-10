import styled from "styled-components";
import { UnitPoints } from "./UnitPoints";

const HeaderContainer = styled.div`
  position: relative;
`;

const StyledImage = styled.img`
  position: absolute;
  right: ${(props) => (props.imagepositionx ? `calc(0px - ${props.imagepositionx}px)` : "0")};
  top: ${(props) => (props.imagepositiony ? `calc(0px + ${props.imagepositiony}px)` : "0")};
  width: 380px;
  height: 196px;
  object-fit: contain;
  object-position: top right;
  z-index: ${(props) => (props.imagezindex === "onTop" ? 100 : "auto")};
`;

export const UnitName = ({
  name,
  subname,
  points,
  legends,
  combatPatrol,
  externalImage,
  localImageUrl,
  imageZIndex,
  imagePositionX,
  imagePositionY,
}) => {
  const imageUrl = localImageUrl || externalImage;

  console.log("[UnitName] Rendering with:", {
    name,
    localImageUrl,
    externalImage,
    finalImageUrl: imageUrl,
    imageZIndex,
    imagePositionX,
    imagePositionY,
  });

  return (
    <HeaderContainer className="header_container">
      {imageUrl && (
        <StyledImage
          src={imageUrl}
          imagezindex={imageZIndex}
          imagepositionx={imagePositionX}
          imagepositiony={imagePositionY}
          crossOrigin="anonymous"
          alt="Unit Image"
        />
      )}
      <div className="name_container">
        <div className="name">{name}</div>
        {subname && <div className="subname">{subname}</div>}
      </div>
      {legends && <div className="legends" />}
      {combatPatrol && <div className="combatpatrol" />}
      <UnitPoints points={points} />
    </HeaderContainer>
  );
};
