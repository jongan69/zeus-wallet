import Svg, { G, Path, SvgProps } from "react-native-svg";

interface IconProps {
  props?: SvgProps;
  size?: number;
  color?: string;
}

export default function DisconnectedIcon({ props, size = 18, color }: IconProps) {
  return (
    <Svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
    >
      <G fill={color}>
        <Path d="M12.188,16.484c-1.097,0-2.192-.417-3.026-1.252l-2.175-2.175c-1.671-1.671-1.671-4.39,0-6.061,.356-.356,.753-.637,1.19-.846,.371-.18,.821-.021,1,.354,.179,.374,.021,.821-.354,1-.283,.135-.541,.318-.766,.543-1.096,1.096-1.096,2.863-.01,3.95l2.175,2.175c1.085,1.085,2.853,1.086,3.939,0,1.096-1.096,1.096-2.863,.01-3.949l-.931-.931c-.293-.293-.293-.768,0-1.061s.768-.293,1.061,0l.931,.931c1.671,1.671,1.671,4.389,0,6.06-.842,.842-1.944,1.262-3.044,1.262Z"></Path>
        <Path d="M9.501,11.923c-.28,0-.548-.157-.677-.427-.179-.374-.021-.821,.354-1,.283-.135,.541-.318,.766-.543,1.096-1.096,1.096-2.863,.01-3.95l-2.175-2.175c-1.085-1.085-2.853-1.086-3.939,0-1.096,1.096-1.096,2.863-.01,3.949l.931,.931c.293,.293,.293,.768,0,1.061s-.768,.293-1.061,0l-.931-.931c-1.671-1.671-1.671-4.389,0-6.06,1.681-1.681,4.4-1.682,6.07-.01l2.175,2.175c1.671,1.671,1.671,4.39,0,6.061-.356,.356-.753,.637-1.19,.846-.104,.05-.214,.073-.323,.073Z"></Path>
        <Path d="M12.25,4.5c-.079,0-.159-.012-.237-.039-.393-.131-.605-.556-.474-.949l.75-2.25c.13-.393,.555-.606,.949-.474,.393,.131,.605,.556,.474,.949l-.75,2.25c-.104,.314-.397,.513-.711,.513Z"></Path>
        <Path d="M14.25,6.5c-.314,0-.607-.199-.711-.513-.131-.393,.081-.818,.474-.949l2.25-.75c.394-.131,.818,.082,.949,.474,.131,.393-.081,.818-.474,.949l-2.25,.75c-.079,.026-.159,.039-.237,.039Z"></Path>
        <Path d="M1.5,13.75c-.314,0-.607-.199-.711-.513-.131-.393,.081-.818,.474-.949l2.25-.75c.394-.132,.818,.082,.949,.474,.131,.393-.081,.818-.474,.949l-2.25,.75c-.079,.026-.159,.039-.237,.039Z"></Path>
        <Path d="M5,17.25c-.079,0-.159-.012-.237-.039-.393-.131-.605-.556-.474-.949l.75-2.25c.13-.393,.556-.606,.949-.474,.393,.131,.605,.556,.474,.949l-.75,2.25c-.104,.314-.397,.513-.711,.513Z"></Path>
      </G>
    </Svg>
  );
}
