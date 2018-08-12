import * as React from "react";

interface Props {
  scrollbarStyle?: {
    background: React.CSSProperties;
    backgroundFocus: React.CSSProperties;
    foreground: React.CSSProperties;
    foregroundFocus: React.CSSProperties;
  };
  customHeader?: Array<React.ComponentClass<any> | React.SFC<any>>;
  width: string;
  height: string;
  maxWidth?: string;
  maxHeight?: string;
}

 export default class ReactTableContainer extends React.Component<Props> {}
 