declare module "react-simple-maps" {
  import * as React from "react";

  export type GeographyProps = {
    geography: any;
    style?: any;
    [key: string]: any;
  };

  export type GeographiesProps = {
    geography: any;
    children: (args: { geographies: any[] }) => React.ReactNode;
    [key: string]: any;
  };

  export type ComposableMapProps = {
    projection?: any;
    projectionConfig?: any;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    [key: string]: any;
  };

  export const ComposableMap: React.ComponentType<ComposableMapProps>;
  export const Geographies: React.ComponentType<GeographiesProps>;
  export const Geography: React.ComponentType<GeographyProps>;
}
