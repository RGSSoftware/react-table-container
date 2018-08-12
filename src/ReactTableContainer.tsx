import * as React from "react";
import {
  TableVerticalScrollbar,
  IScrollbarStyle
} from "./TableVerticalScrollbar";
import { TableHorizontalScrollbar } from "./TableHorizontalScrollbar";

interface IDimensions {
  containerWidth: number;
  containerHeight: number;
  tableWidth: number;
  tableHeight: number;
}

interface IProps {
  scrollbarStyle?: IScrollbarStyle;
  customHeader?: Array<React.ComponentClass<any> | React.SFC<any>>;
  width: string;
  height: string;
  maxWidth?: string;
  maxHeight?: string;
}

interface IState {
  containerWidth: number;
  containerHeight: number;
  tableWidth: number;
  tableHeight: number;
  tableMarginTop: number;
  verticalPercentageScrolled: number;
  tableMarginLeft: number;
  horizontalPercentageScrolled: number;
  isMoving: boolean;
  previousSwipeClientX: number;
  previousSwipeClientY: number;
}

export default class ReactTableContainer extends React.Component<
  IProps,
  IState
> {
  private readonly headerTableId = "header-table";
  private readonly mainTableId = "main-table";

  // Table header related html elements
  private readonly headerRelatedHTMLElements = ["colgroup", "thead"];

  private timeoutId = null;

  private container: HTMLElement;
  private table: HTMLTableElement;
  private tbody: HTMLElement;

  constructor(props: IProps) {
    super(props);

    this.state = {
      containerWidth: 0,
      containerHeight: 0,
      tableWidth: 0,
      tableHeight: 0,
      tableMarginTop: 0,
      verticalPercentageScrolled: 0,
      tableMarginLeft: 0,
      horizontalPercentageScrolled: 0,
      isMoving: false,
      previousSwipeClientX: 0,
      previousSwipeClientY: 0
    };
  }

  public componentDidMount(): void {
    this.table = this.container.querySelector(
      `[data-rtc-id="${this.mainTableId}"]`
    ) as HTMLTableElement;
    this.tbody = this.table.querySelector("tbody");

    this.tbody.addEventListener("wheel", this.onWheel);

    this.tbody.addEventListener("touchstart", this.onTouchStart);
    this.tbody.addEventListener("touchmove", this.onTouchMove);
    this.tbody.addEventListener("touchend", this.onTouchEnd);
    this.tbody.addEventListener("touchcancel", this.onTouchEnd);

    window.addEventListener("resize", this.onWindowResize);

    const containerBoundingClientRect = this.container.getBoundingClientRect();
    const tableBoundingClientRect = this.table.getBoundingClientRect();

    this.applyDimensions({
      containerWidth: containerBoundingClientRect.width,
      containerHeight: containerBoundingClientRect.height,
      tableWidth: tableBoundingClientRect.width,
      tableHeight: tableBoundingClientRect.height
    });
  }

  public componentDidUpdate(): void {
    this.refreshHeaders();
    this.reevaluateDimensions();
  }

  public render(): JSX.Element {
    const {
      children,
      scrollbarStyle,
      customHeader,
      width,
      height,
      maxWidth,
      maxHeight
    } = this.props;
    const {
      tableMarginTop,
      verticalPercentageScrolled,
      tableMarginLeft,
      horizontalPercentageScrolled
    } = this.state;

    const containerStyle: React.CSSProperties = {
      boxSizing: "border-box",
      position: "relative",
      display: "inline-block",
      overflow: "hidden",
      width,
      height
    };

    if (maxWidth) {
      containerStyle.maxWidth = maxWidth;
    }

    if (maxHeight) {
      containerStyle.maxHeight = maxHeight;
    }

    const table = React.Children.only(children) as React.ReactElement<any>;

    const tableChildren = React.Children.toArray(table.props.children) as Array<
      React.ReactElement<any>
    >;

    // Extract out header related children
    const headerRelatedChildren = tableChildren.filter(({ type }) => {
      let headerRelatedItems: Array<
        string | React.ComponentClass<any> | React.SFC<any>
      > = [...this.headerRelatedHTMLElements];

      if (customHeader) {
        headerRelatedItems = [...headerRelatedItems, ...customHeader];
      }

      return headerRelatedItems.indexOf(type) > -1;
    });

    // Set header table props
    const headerTableProps = { ...table.props };

    headerTableProps["data-rtc-id"] = this.headerTableId;

    const headerTableStyle = {
      borderSpacing: 0,
      position: "absolute",
      top: 0,
      left: -tableMarginLeft,
      zIndex: 1
    };

    headerTableProps.style = headerTableProps.style
      ? { ...headerTableProps.style, ...headerTableStyle }
      : headerTableStyle;

    // Set main table props
    const mainTableProps = { ...table.props };

    mainTableProps["data-rtc-id"] = this.mainTableId;

    const mainTableStyle = {
      borderSpacing: 0,
      marginTop: -tableMarginTop,
      marginLeft: -tableMarginLeft
    };

    mainTableProps.style = mainTableProps.style
      ? { ...mainTableProps.style, ...mainTableStyle }
      : mainTableStyle;

    return (
      <div ref={ref => (this.container = ref)} style={containerStyle}>
        {React.cloneElement(table, headerTableProps, headerRelatedChildren)}

        {React.cloneElement(table, mainTableProps)}

        <TableVerticalScrollbar
          customStyle={scrollbarStyle}
          container={this.container}
          table={this.table}
          scrollTo={verticalPercentageScrolled}
          onScroll={this.onVerticalScroll}
        />

        <TableHorizontalScrollbar
          customStyle={scrollbarStyle}
          container={this.container}
          table={this.table}
          scrollTo={horizontalPercentageScrolled}
          onScroll={this.onHorizontalScroll}
        />
      </div>
    );
  }

  public componentWillUnmount(): void {
    this.tbody.removeEventListener("wheel", this.onWheel);

    this.tbody.removeEventListener("touchstart", this.onTouchStart);
    this.tbody.removeEventListener("touchmove", this.onTouchMove);
    this.tbody.removeEventListener("touchend", this.onTouchEnd);
    this.tbody.removeEventListener("touchcancel", this.onTouchEnd);

    window.removeEventListener("resize", this.onWindowResize);
  }

  private onWindowResize = (): void => {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(this.reevaluateDimensions, 16);
  };

  // Make the header table's header cells the same width as the main table's header cells
  private refreshHeaders = (): void => {
    const headerTableHeaderRow = this.container.querySelector(
      `[data-rtc-id="${this.headerTableId}"] thead tr:first-child`
    );
    const mainTableHeaderRow = this.container.querySelector(
      `[data-rtc-id="${this.mainTableId}"] thead tr:first-child`
    );

    if (headerTableHeaderRow && mainTableHeaderRow) {
      const cellsWidth = [];

      // All necessary reads are done first for increased performance
      for (let i = 0; i < mainTableHeaderRow.children.length; i++) {
        cellsWidth.push(
          mainTableHeaderRow.children.item(i).getBoundingClientRect().width
        );
      }

      for (let i = 0; i < mainTableHeaderRow.children.length; i++) {
        const item = headerTableHeaderRow.children.item(i) as HTMLElement;

        item.style.boxSizing = "border-box";
        item.style.minWidth = cellsWidth[i] + "px";
      }
    }
  };

  // Update dimensions if they have changed
  private reevaluateDimensions = (): void => {
    const {
      containerWidth,
      containerHeight,
      tableWidth,
      tableHeight
    } = this.state;

    const containerBoundingClientRect = this.container.getBoundingClientRect();
    const tableBoundingClientRect = this.table.getBoundingClientRect();

    const newContainerWidth = containerBoundingClientRect.width;
    const newContainerHeight = containerBoundingClientRect.height;
    const newTableWidth = tableBoundingClientRect.width;
    const newTableHeight = tableBoundingClientRect.height;

    if (
      containerWidth !== newContainerWidth ||
      containerHeight !== newContainerHeight ||
      tableWidth !== newTableWidth ||
      tableHeight !== newTableHeight
    ) {
      this.applyDimensions({
        containerWidth: newContainerWidth,
        containerHeight: newContainerHeight,
        tableWidth: newTableWidth,
        tableHeight: newTableHeight
      });
    }
  };

  private applyDimensions(dimensions: IDimensions): void {
    let {
      tableMarginTop,
      verticalPercentageScrolled,
      tableMarginLeft,
      horizontalPercentageScrolled
    } = this.state;

    const verticalMaxScrollable =
      dimensions.tableHeight - dimensions.containerHeight;

    tableMarginTop = Math.max(
      0,
      Math.min(tableMarginTop, verticalMaxScrollable)
    );

    verticalPercentageScrolled = verticalMaxScrollable
      ? tableMarginTop / verticalMaxScrollable
      : 0;

    const horizontalMaxScrollable =
      dimensions.tableWidth - dimensions.containerWidth;

    tableMarginLeft = Math.max(
      0,
      Math.min(tableMarginLeft, horizontalMaxScrollable)
    );

    horizontalPercentageScrolled = horizontalMaxScrollable
      ? tableMarginLeft / horizontalMaxScrollable
      : 0;

    this.setState({
      containerWidth: dimensions.containerWidth,
      containerHeight: dimensions.containerHeight,
      tableWidth: dimensions.tableWidth,
      tableHeight: dimensions.tableHeight,
      tableMarginTop,
      verticalPercentageScrolled,
      tableMarginLeft,
      horizontalPercentageScrolled
    });
  }

  // If scrolling within the table hits any boundary, propagate it onto the window object
  private setWindowScroll(
    verticalMaxScrollable: number,
    newTableMarginTop: number,
    horizontalMaxScrollable: number,
    newTableMarginLeft: number
  ): void {
    let scrollByX = 0;
    let scrollByY = 0;

    if (newTableMarginTop < 0) {
      scrollByY = newTableMarginTop;
    } else if (newTableMarginTop > verticalMaxScrollable) {
      scrollByY = newTableMarginTop - verticalMaxScrollable;
    }

    if (newTableMarginLeft < 0) {
      scrollByX = newTableMarginLeft;
    } else if (newTableMarginLeft > horizontalMaxScrollable) {
      scrollByX = newTableMarginLeft - horizontalMaxScrollable;
    }

    window.scrollBy(scrollByX, scrollByY);
  }

  private onWheel = (event: WheelEvent): void => {
    event.preventDefault();

    /* tslint:disable:prefer-const */
    let {
      containerWidth,
      containerHeight,
      tableWidth,
      tableHeight,
      tableMarginTop,
      verticalPercentageScrolled,
      tableMarginLeft,
      horizontalPercentageScrolled
    } = this.state;
    /* tslint:enable:prefer-const */

    let deltaY = event.deltaY;
    let deltaX = event.deltaX;

    // Adjust if the delta values are specified in lines
    if (event.deltaMode === 1) {
      deltaY *= 10;
      deltaX *= 10;
    }

    // Get vertical properties
    const verticalMaxScrollable = Math.max(0, tableHeight - containerHeight);
    const newTableMarginTop = tableMarginTop + deltaY;

    // Get horizontal properties
    const horizontalMaxScrollable = Math.max(0, tableWidth - containerWidth);
    const newTableMarginLeft = tableMarginLeft + deltaX;

    this.setWindowScroll(
      verticalMaxScrollable,
      newTableMarginTop,
      horizontalMaxScrollable,
      newTableMarginLeft
    );

    // Set vertical properties
    tableMarginTop = Math.max(
      0,
      Math.min(newTableMarginTop, verticalMaxScrollable)
    );
    verticalPercentageScrolled = verticalMaxScrollable
      ? tableMarginTop / verticalMaxScrollable
      : 0;

    // Set horizontal properties
    tableMarginLeft = Math.max(
      0,
      Math.min(newTableMarginLeft, horizontalMaxScrollable)
    );
    horizontalPercentageScrolled = horizontalMaxScrollable
      ? tableMarginLeft / horizontalMaxScrollable
      : 0;

    this.setState({
      tableMarginTop,
      verticalPercentageScrolled,
      tableMarginLeft,
      horizontalPercentageScrolled
    });
  };

  private onTouchStart = (event: TouchEvent): void => {
    this.setState({
      isMoving: true,
      previousSwipeClientX: event.changedTouches[0].clientX,
      previousSwipeClientY: event.changedTouches[0].clientY
    });
  };

  private onTouchMove = (event: TouchEvent): void => {
    event.preventDefault();

    /* tslint:disable:prefer-const */
    let {
      containerWidth,
      containerHeight,
      tableWidth,
      tableHeight,
      tableMarginTop,
      tableMarginLeft,
      isMoving,
      previousSwipeClientX,
      previousSwipeClientY
    } = this.state;
    /* tslint:enable:prefer-const */

    if (!isMoving) {
      return;
    }

    // Get vertical properties
    const verticalMaxScrollable = Math.max(0, tableHeight - containerHeight);
    const currentSwipeClientY = event.changedTouches[0].clientY;
    const deltaY = previousSwipeClientY - currentSwipeClientY;
    const newTableMarginTop = tableMarginTop + deltaY;

    // Get horizontal properties
    const horizontalMaxScrollable = Math.max(0, tableWidth - containerWidth);
    const currentSwipeClientX = event.changedTouches[0].clientX;
    const deltaX = previousSwipeClientX - currentSwipeClientX;
    const newTableMarginLeft = tableMarginLeft + deltaX;

    this.setWindowScroll(
      verticalMaxScrollable,
      newTableMarginTop,
      horizontalMaxScrollable,
      newTableMarginLeft
    );

    // Set vertical properties
    tableMarginTop = Math.max(
      0,
      Math.min(newTableMarginTop, verticalMaxScrollable)
    );

    const verticalPercentageScrolled = verticalMaxScrollable
      ? tableMarginTop / verticalMaxScrollable
      : 0;

    previousSwipeClientY = currentSwipeClientY;

    // Set horizontal properties
    tableMarginLeft = Math.max(
      0,
      Math.min(newTableMarginLeft, horizontalMaxScrollable)
    );

    const horizontalPercentageScrolled = horizontalMaxScrollable
      ? tableMarginLeft / horizontalMaxScrollable
      : 0;

    previousSwipeClientX = currentSwipeClientX;

    this.setState({
      tableMarginTop,
      verticalPercentageScrolled,
      tableMarginLeft,
      horizontalPercentageScrolled,
      previousSwipeClientY,
      previousSwipeClientX
    });
  };

  private onTouchEnd = (event: TouchEvent): void => {
    this.setState({
      isMoving: false,
      previousSwipeClientX: 0,
      previousSwipeClientY: 0
    });
  };

  private onVerticalScroll = (scrollTo: number): void => {
    const { containerHeight, tableHeight } = this.state;

    const maxScrollable = tableHeight - containerHeight;

    const tableMarginTop = Math.max(
      0,
      Math.min(scrollTo * maxScrollable, maxScrollable)
    );

    this.setState({
      tableMarginTop,
      verticalPercentageScrolled: scrollTo
    });
  };

  private onHorizontalScroll = (scrollTo: number): void => {
    const { containerWidth, tableWidth } = this.state;

    const maxScrollable = tableWidth - containerWidth;

    const tableMarginLeft = Math.max(
      0,
      Math.min(scrollTo * maxScrollable, maxScrollable)
    );

    this.setState({
      tableMarginLeft,
      horizontalPercentageScrolled: scrollTo
    });
  };
}
