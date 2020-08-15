// I realize that the name of the type is not gramatically correct and
// 'dimension' means only one dimension.
// It is named like that to differentiate it from the 'AtlasTextureDimensions'
// type.
export type AtlasTextureDimension = {
  atlasLeft: number;
  atlasTop: number;
  height: number;
  uvStartU: number;
  uvStartV: number;
  uvStopU: number;
  uvStopV: number;
  width: number;
};
