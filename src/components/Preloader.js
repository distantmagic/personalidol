// @flow

import * as React from "react";

import PreloaderImage from "./PreloaderImage";

import border_orthodox_frame from "../assets/border-orthodox-frame.png";
import icon_backpack from "../assets/icon-backpack.png";
import icon_cogs from "../assets/icon-cogs.png";
import icon_dialogue from "../assets/icon-dialogue.png";
import icon_error from "../assets/icon-error.png";
import icon_hourglass from "../assets/icon-hourglass.png";
import icon_magic from "../assets/icon-magic.png";
import icon_magnifying_glass from "../assets/icon-magnifying-glass.png";
import icon_observe from "../assets/icon-observe.png";
import icon_prayer from "../assets/icon-prayer.png";
import icon_skill from "../assets/icon-skill.png";
import icon_strength from "../assets/icon-strength.png";
import image_disasters_of_war from "../assets/image-disasters-of-war.png";
import image_horizontal_rule_ornamental from "../assets/image-horizontal-rule-ornamental.png";
import image_knight_silhouette from "../assets/image-knight-silhouette.svg";
import image_nobody_knows_anybody from "../assets/image-nobody-knows-anybody.png";
import image_rise_and_fall from "../assets/image-rise-and-fall.png";
import texture_blood_marble_512 from "../assets/texture-blood-marble-512.png";
import texture_cod_gray_marble_512 from "../assets/texture-cod-gray-marble-512.png";
import texture_mineshaft_marble_512 from "../assets/texture-mineshaft-marble-512.png";
import texture_navy_blue_marble_512 from "../assets/texture-navy-blue-marble-512.jpg";
import texture_paper_1_512 from "../assets/texture-paper-1-512.jpg";

const images = [
  border_orthodox_frame,
  icon_backpack,
  icon_cogs,
  icon_dialogue,
  icon_error,
  icon_hourglass,
  icon_magic,
  icon_magnifying_glass,
  icon_observe,
  icon_prayer,
  icon_skill,
  icon_strength,
  image_disasters_of_war,
  image_horizontal_rule_ornamental,
  image_knight_silhouette,
  image_nobody_knows_anybody,
  image_rise_and_fall,
  texture_blood_marble_512,
  texture_cod_gray_marble_512,
  texture_mineshaft_marble_512,
  texture_navy_blue_marble_512,
  texture_paper_1_512,
];

const loaded = [];

type Props = {|
  onPreloaded: true => any,
|};

export default function Preloader(props: Props) {
  const [loadedCount, setLoadedCount] = React.useState<number>(loaded.length);

  function onLoad(loadedSrc: string) {
    loaded.push(loadedSrc);
    setLoadedCount(loaded.length);

    if (!Preloader.isLoaded()) {
      return;
    }

    props.onPreloaded(true);
  }

  return (
    <div className="dd__setup" id="dd-root-loader">
      Loading interface...
      <progress className="dd__setup__progress" max={images.length} value={loadedCount}></progress>
      <div
        className="dd__preloader__progress"
        style={{
          "--dd-preloader-images-total": images.length,
        }}
      >
        {images.map(image => (
          <PreloaderImage key={image} onLoad={onLoad} src={image} />
        ))}
      </div>
    </div>
  );
}

Preloader.isLoaded = function(): boolean {
  for (let src of images) {
    if (!loaded.includes(src)) {
      return false;
    }
  }

  return true;
};
