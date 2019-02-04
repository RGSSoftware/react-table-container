'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var TableVerticalScrollbar = /** @class */ (function (_super) {
    __extends(TableVerticalScrollbar, _super);
    function TableVerticalScrollbar(props) {
        var _this = _super.call(this, props) || this;
        _this.minHeight = 15;
        _this.onMouseDown = function (event) {
            event.preventDefault();
            _this.isMoving = true;
            _this.previousMoveClientY = event.clientY;
        };
        _this.onMouseMove = function (event) {
            var scrollTo = _this.props.scrollTo;
            var _a = _this.state, containerHeight = _a.containerHeight, theadHeight = _a.theadHeight, scrollbarHeight = _a.scrollbarHeight;
            if (!_this.isMoving) {
                return;
            }
            event.preventDefault();
            var currentMoveClientY = event.clientY;
            var deltaY = currentMoveClientY - _this.previousMoveClientY;
            var scrollbarMoveableDistance = containerHeight - theadHeight - scrollbarHeight;
            scrollTo = scrollbarMoveableDistance
                ? (scrollbarMoveableDistance * scrollTo + deltaY) /
                    scrollbarMoveableDistance
                : 0;
            scrollTo = Math.max(0, Math.min(scrollTo, 1));
            _this.previousMoveClientY = currentMoveClientY;
            _this.props.onScroll(scrollTo);
        };
        _this.onMouseUp = function (event) {
            if (!_this.isMoving) {
                return;
            }
            event.preventDefault();
            _this.isMoving = false;
            _this.previousMoveClientY = 0;
        };
        _this.onMouseOver = function () {
            _this.setState({ focused: true });
        };
        _this.onMouseOut = function () {
            _this.setState({ focused: false });
        };
        _this.state = {
            focused: false,
            containerHeight: 0,
            tableHeight: 0,
            theadHeight: 0,
            scrollbarHeight: 0
        };
        _this.isMoving = false;
        _this.previousMoveClientY = 0;
        return _this;
    }
    TableVerticalScrollbar.prototype.componentDidMount = function () {
        this.calculateDimensions();
        this.scrollbarRef.addEventListener("mousedown", this.onMouseDown);
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("mouseup", this.onMouseUp);
    };
    TableVerticalScrollbar.prototype.componentWillUnmount = function () {
        this.scrollbarRef.removeEventListener("mousedown", this.onMouseDown);
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mouseup", this.onMouseUp);
    };
    TableVerticalScrollbar.prototype.componentDidUpdate = function () {
        var _a = this.props, containerRef = _a.containerRef, tableRef = _a.tableRef;
        var _b = this.state, containerHeight = _b.containerHeight, tableHeight = _b.tableHeight;
        var newContainerHeight = containerRef.getBoundingClientRect().height;
        var newTableHeight = ReactDOM.findDOMNode(tableRef).getBoundingClientRect().height;
        if (containerHeight !== newContainerHeight ||
            tableHeight !== newTableHeight) {
            this.calculateDimensions();
        }
    };
    TableVerticalScrollbar.prototype.render = function () {
        var _this = this;
        var _a = this.props, style = _a.style, tableRef = _a.tableRef, scrollTo = _a.scrollTo;
        var _b = this.state, focused = _b.focused, containerHeight = _b.containerHeight, tableHeight = _b.tableHeight, theadHeight = _b.theadHeight, scrollbarHeight = _b.scrollbarHeight;
        var isScrollable = tableRef
            ? containerHeight - theadHeight < tableHeight - theadHeight
            : false;
        var scrollbarContainerStyle = {
            display: isScrollable ? "block" : "none",
            boxSizing: "border-box",
            position: "absolute",
            top: theadHeight,
            right: 0,
            bottom: 0,
            backgroundColor: "#E3E5EB",
            width: 8
        };
        scrollbarContainerStyle = style
            ? focused
                ? __assign({}, scrollbarContainerStyle, style.backgroundFocus) : __assign({}, scrollbarContainerStyle, style.background)
            : scrollbarContainerStyle;
        var scrollbarPositionTop = (containerHeight - theadHeight - scrollbarHeight) * scrollTo;
        var scrollbarStyle = {
            boxSizing: "border-box",
            position: "absolute",
            top: scrollbarPositionTop,
            right: 0,
            backgroundColor: "#888C97",
            borderRadius: 4,
            width: 8,
            height: scrollbarHeight
        };
        scrollbarStyle = style
            ? focused
                ? __assign({}, scrollbarStyle, style.foregroundFocus) : __assign({}, scrollbarStyle, style.foreground)
            : scrollbarStyle;
        return (React.createElement("div", { style: scrollbarContainerStyle, onMouseOver: this.onMouseOver, onMouseOut: this.onMouseOut },
            React.createElement("div", { ref: function (ref) { return (_this.scrollbarRef = ref); }, style: scrollbarStyle })));
    };
    TableVerticalScrollbar.prototype.calculateDimensions = function () {
        var _a = this.props, containerRef = _a.containerRef, tableRef = _a.tableRef;
        if (!containerRef || !tableRef) {
            return;
        }
        var containerHeight = containerRef.getBoundingClientRect().height;
        var tableElement = ReactDOM.findDOMNode(tableRef);
        var tableHeight = tableElement.getBoundingClientRect().height;
        var theadHeight = tableElement
            .querySelector("thead")
            .getBoundingClientRect().height;
        var noHeaderTableHeight = tableHeight - theadHeight;
        var visibleContainerHeight = containerHeight - theadHeight;
        var scrollbarHeight = noHeaderTableHeight
            ? Math.pow(visibleContainerHeight, 2) / noHeaderTableHeight
            : 0;
        scrollbarHeight = Math.max(this.minHeight, Math.min(scrollbarHeight, visibleContainerHeight));
        this.setState({
            containerHeight: containerHeight,
            tableHeight: tableHeight,
            theadHeight: theadHeight,
            scrollbarHeight: scrollbarHeight
        });
    };
    return TableVerticalScrollbar;
}(React.Component));

var TableHorizontalScrollbar = /** @class */ (function (_super) {
    __extends(TableHorizontalScrollbar, _super);
    function TableHorizontalScrollbar(props) {
        var _this = _super.call(this, props) || this;
        _this.minHeight = 15;
        _this.onMouseDown = function (event) {
            event.preventDefault();
            _this.isMoving = true;
            _this.previousMoveClientX = event.clientX;
        };
        _this.onMouseMove = function (event) {
            var scrollTo = _this.props.scrollTo;
            var _a = _this.state, containerWidth = _a.containerWidth, scrollbarWidth = _a.scrollbarWidth;
            if (!_this.isMoving) {
                return;
            }
            event.preventDefault();
            var currentMoveClientX = event.clientX;
            var deltaX = currentMoveClientX - _this.previousMoveClientX;
            var scrollbarMoveableDistance = containerWidth - scrollbarWidth;
            scrollTo = scrollbarMoveableDistance
                ? (scrollbarMoveableDistance * scrollTo + deltaX) /
                    scrollbarMoveableDistance
                : 0;
            scrollTo = Math.max(0, Math.min(scrollTo, 1));
            _this.previousMoveClientX = currentMoveClientX;
            _this.props.onScroll(scrollTo);
        };
        _this.onMouseUp = function (event) {
            if (!_this.isMoving) {
                return;
            }
            event.preventDefault();
            _this.isMoving = false;
            _this.previousMoveClientX = 0;
        };
        _this.onMouseOver = function () {
            _this.setState({ focused: true });
        };
        _this.onMouseOut = function () {
            _this.setState({ focused: false });
        };
        _this.state = {
            focused: false,
            containerWidth: 0,
            tableWidth: 0,
            scrollbarWidth: 0
        };
        _this.isMoving = false;
        _this.previousMoveClientX = 0;
        return _this;
    }
    TableHorizontalScrollbar.prototype.componentDidMount = function () {
        this.calculateDimensions();
        this.scrollbarRef.addEventListener("mousedown", this.onMouseDown);
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("mouseup", this.onMouseUp);
    };
    TableHorizontalScrollbar.prototype.componentWillUnmount = function () {
        this.scrollbarRef.removeEventListener("mousedown", this.onMouseDown);
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mouseup", this.onMouseUp);
    };
    TableHorizontalScrollbar.prototype.componentDidUpdate = function () {
        var _a = this.props, containerRef = _a.containerRef, tableRef = _a.tableRef;
        var _b = this.state, containerWidth = _b.containerWidth, tableWidth = _b.tableWidth;
        var newContainerWidth = containerRef.getBoundingClientRect().width;
        var newTableWidth = ReactDOM.findDOMNode(tableRef).getBoundingClientRect().width;
        if (containerWidth !== newContainerWidth || tableWidth !== newTableWidth) {
            this.calculateDimensions();
        }
    };
    TableHorizontalScrollbar.prototype.render = function () {
        var _this = this;
        var _a = this.props, style = _a.style, tableRef = _a.tableRef, scrollTo = _a.scrollTo;
        var _b = this.state, focused = _b.focused, containerWidth = _b.containerWidth, tableWidth = _b.tableWidth, scrollbarWidth = _b.scrollbarWidth;
        var isScrollable = tableRef ? containerWidth < tableWidth : false;
        var scrollbarContainerStyle = {
            display: isScrollable ? "block" : "none",
            boxSizing: "border-box",
            position: "absolute",
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "#E3E5EB",
            height: 8
        };
        scrollbarContainerStyle = style
            ? focused
                ? __assign({}, scrollbarContainerStyle, style.backgroundFocus) : __assign({}, scrollbarContainerStyle, style.background)
            : scrollbarContainerStyle;
        var scrollbarPositionLeft = (containerWidth - scrollbarWidth) * scrollTo;
        var scrollbarStyle = {
            boxSizing: "border-box",
            position: "absolute",
            bottom: 0,
            left: scrollbarPositionLeft,
            backgroundColor: "#888C97",
            borderRadius: 4,
            width: scrollbarWidth,
            height: 8
        };
        scrollbarStyle = style
            ? focused
                ? __assign({}, scrollbarStyle, style.foregroundFocus) : __assign({}, scrollbarStyle, style.foreground)
            : scrollbarStyle;
        return (React.createElement("div", { style: scrollbarContainerStyle, onMouseOver: this.onMouseOver, onMouseOut: this.onMouseOut },
            React.createElement("div", { ref: function (ref) { return (_this.scrollbarRef = ref); }, style: scrollbarStyle })));
    };
    TableHorizontalScrollbar.prototype.calculateDimensions = function () {
        var _a = this.props, containerRef = _a.containerRef, tableRef = _a.tableRef;
        if (!containerRef || !tableRef) {
            return;
        }
        var containerWidth = containerRef.getBoundingClientRect().width;
        var tableWidth = ReactDOM.findDOMNode(tableRef).getBoundingClientRect().width;
        var scrollbarWidth = tableWidth
            ? Math.pow(containerWidth, 2) / tableWidth
            : 0;
        scrollbarWidth = Math.max(this.minHeight, Math.min(scrollbarWidth, containerWidth));
        this.setState({
            containerWidth: containerWidth,
            tableWidth: tableWidth,
            scrollbarWidth: scrollbarWidth
        });
    };
    return TableHorizontalScrollbar;
}(React.Component));

var ReactTableContainer = /** @class */ (function (_super) {
    __extends(ReactTableContainer, _super);
    function ReactTableContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.tableId = "main-table";
        _this.headerTableId = "header-table";
        _this.headerRelatedHTMLElements = ["colgroup", "thead"];
        _this.timeoutId = null;
        _this.onWindowResize = function () {
            clearTimeout(_this.timeoutId);
            _this.timeoutId = setTimeout(_this.reevaluateDimensions, 16);
        };
        // Make the header table's header cells the same width as the main table's header cells
        _this.refreshHeaders = function () {
            var headerTableHeaderRow = ReactDOM.findDOMNode(_this.headerTableRef).querySelector("thead > tr:first-child");
            var tableHeaderRow = ReactDOM.findDOMNode(_this.tableRef).querySelector("thead > tr:first-child");
            if (headerTableHeaderRow && tableHeaderRow) {
                var cellsWidth = [];
                // All necessary reads are done first for increased performance
                for (var i = 0; i < tableHeaderRow.children.length; i++) {
                    cellsWidth.push(tableHeaderRow.children.item(i).getBoundingClientRect().width);
                }
                for (var i = 0; i < tableHeaderRow.children.length; i++) {
                    var item = headerTableHeaderRow.children.item(i);
                    item.style.boxSizing = "border-box";
                    item.style.minWidth = cellsWidth[i] + "px";
                }
            }
        };
        // Update dimensions if they have changed
        _this.reevaluateDimensions = function () {
            var _a = _this.state, containerWidth = _a.containerWidth, containerHeight = _a.containerHeight, tableWidth = _a.tableWidth, tableHeight = _a.tableHeight;
            // `getBoundingClientRect` can be called directly on the ref instance since it holds a DIV element instance
            var containerBoundingClientRect = _this.containerRef.getBoundingClientRect();
            var tableBoundingClientRect = ReactDOM.findDOMNode(_this.tableRef).getBoundingClientRect();
            var newContainerWidth = containerBoundingClientRect.width;
            var newContainerHeight = containerBoundingClientRect.height;
            var newTableWidth = tableBoundingClientRect.width;
            var newTableHeight = tableBoundingClientRect.height;
            if (containerWidth !== newContainerWidth ||
                containerHeight !== newContainerHeight ||
                tableWidth !== newTableWidth ||
                tableHeight !== newTableHeight) {
                _this.applyDimensions({
                    containerWidth: newContainerWidth,
                    containerHeight: newContainerHeight,
                    tableWidth: newTableWidth,
                    tableHeight: newTableHeight
                });
            }
        };
        _this.onWheel = function (event) {
            event.preventDefault();
            var _a = _this.state, containerWidth = _a.containerWidth, containerHeight = _a.containerHeight, tableWidth = _a.tableWidth, tableHeight = _a.tableHeight, tableMarginTop = _a.tableMarginTop, verticalPercentageScrolled = _a.verticalPercentageScrolled, tableMarginLeft = _a.tableMarginLeft, horizontalPercentageScrolled = _a.horizontalPercentageScrolled;
            var deltaY = event.deltaY;
            var deltaX = event.deltaX;
            // Adjust if the delta values are specified in lines
            if (event.deltaMode === 1) {
                deltaY *= 10;
                deltaX *= 10;
            }
            // Get vertical properties
            var verticalMaxScrollable = Math.max(0, tableHeight - containerHeight);
            var newTableMarginTop = tableMarginTop + deltaY;
            // Get horizontal properties
            var horizontalMaxScrollable = Math.max(0, tableWidth - containerWidth);
            var newTableMarginLeft = tableMarginLeft + deltaX;
            _this.setWindowScroll(verticalMaxScrollable, newTableMarginTop, horizontalMaxScrollable, newTableMarginLeft);
            // Set vertical properties
            tableMarginTop = Math.max(0, Math.min(newTableMarginTop, verticalMaxScrollable));
            verticalPercentageScrolled = verticalMaxScrollable
                ? tableMarginTop / verticalMaxScrollable
                : 0;
            // Set horizontal properties
            tableMarginLeft = Math.max(0, Math.min(newTableMarginLeft, horizontalMaxScrollable));
            horizontalPercentageScrolled = horizontalMaxScrollable
                ? tableMarginLeft / horizontalMaxScrollable
                : 0;
            _this.setState({
                tableMarginTop: tableMarginTop,
                verticalPercentageScrolled: verticalPercentageScrolled,
                tableMarginLeft: tableMarginLeft,
                horizontalPercentageScrolled: horizontalPercentageScrolled
            });
        };
        _this.onTouchStart = function (event) {
            _this.setState({
                isMoving: true,
                previousSwipeClientX: event.changedTouches[0].clientX,
                previousSwipeClientY: event.changedTouches[0].clientY
            });
        };
        _this.onTouchMove = function (event) {
            event.preventDefault();
            var _a = _this.state, containerWidth = _a.containerWidth, containerHeight = _a.containerHeight, tableWidth = _a.tableWidth, tableHeight = _a.tableHeight, tableMarginTop = _a.tableMarginTop, tableMarginLeft = _a.tableMarginLeft, isMoving = _a.isMoving, previousSwipeClientX = _a.previousSwipeClientX, previousSwipeClientY = _a.previousSwipeClientY;
            if (!isMoving) {
                return;
            }
            // Get vertical properties
            var verticalMaxScrollable = Math.max(0, tableHeight - containerHeight);
            var currentSwipeClientY = event.changedTouches[0].clientY;
            var deltaY = previousSwipeClientY - currentSwipeClientY;
            var newTableMarginTop = tableMarginTop + deltaY;
            // Get horizontal properties
            var horizontalMaxScrollable = Math.max(0, tableWidth - containerWidth);
            var currentSwipeClientX = event.changedTouches[0].clientX;
            var deltaX = previousSwipeClientX - currentSwipeClientX;
            var newTableMarginLeft = tableMarginLeft + deltaX;
            _this.setWindowScroll(verticalMaxScrollable, newTableMarginTop, horizontalMaxScrollable, newTableMarginLeft);
            // Set vertical properties
            tableMarginTop = Math.max(0, Math.min(newTableMarginTop, verticalMaxScrollable));
            var verticalPercentageScrolled = verticalMaxScrollable
                ? tableMarginTop / verticalMaxScrollable
                : 0;
            previousSwipeClientY = currentSwipeClientY;
            // Set horizontal properties
            tableMarginLeft = Math.max(0, Math.min(newTableMarginLeft, horizontalMaxScrollable));
            var horizontalPercentageScrolled = horizontalMaxScrollable
                ? tableMarginLeft / horizontalMaxScrollable
                : 0;
            previousSwipeClientX = currentSwipeClientX;
            _this.setState({
                tableMarginTop: tableMarginTop,
                verticalPercentageScrolled: verticalPercentageScrolled,
                tableMarginLeft: tableMarginLeft,
                horizontalPercentageScrolled: horizontalPercentageScrolled,
                previousSwipeClientY: previousSwipeClientY,
                previousSwipeClientX: previousSwipeClientX
            });
        };
        _this.onTouchEnd = function (event) {
            _this.setState({
                isMoving: false,
                previousSwipeClientX: 0,
                previousSwipeClientY: 0
            });
        };
        _this.onVerticalScroll = function (scrollTo) {
            var _a = _this.state, containerHeight = _a.containerHeight, tableHeight = _a.tableHeight;
            var maxScrollable = tableHeight - containerHeight;
            var tableMarginTop = Math.max(0, Math.min(scrollTo * maxScrollable, maxScrollable));
            _this.setState({
                tableMarginTop: tableMarginTop,
                verticalPercentageScrolled: scrollTo
            });
        };
        _this.onHorizontalScroll = function (scrollTo) {
            var _a = _this.state, containerWidth = _a.containerWidth, tableWidth = _a.tableWidth;
            var maxScrollable = tableWidth - containerWidth;
            var tableMarginLeft = Math.max(0, Math.min(scrollTo * maxScrollable, maxScrollable));
            _this.setState({
                tableMarginLeft: tableMarginLeft,
                horizontalPercentageScrolled: scrollTo
            });
        };
        // Some of the state below could possibly be converted into instance properties, as they don't seem to directly play a role during any rendering
        _this.state = {
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
        return _this;
    }
    ReactTableContainer.prototype.componentDidMount = function () {
        // Set up the Main Table
        this.tableElement = ReactDOM.findDOMNode(this.tableRef);
        // Register listeners
        this.tableElement.addEventListener("wheel", this.onWheel);
        this.tableElement.addEventListener("touchstart", this.onTouchStart);
        this.tableElement.addEventListener("touchmove", this.onTouchMove);
        this.tableElement.addEventListener("touchend", this.onTouchEnd);
        this.tableElement.addEventListener("touchcancel", this.onTouchEnd);
        window.addEventListener("resize", this.onWindowResize);
        // `getBoundingClientRect` can be called directly on the ref instance since it holds a DIV element instance
        var containerBoundingClientRect = this.containerRef.getBoundingClientRect();
        var tableBoundingClientRect = this.tableElement.getBoundingClientRect();
        // Apply initial dimensions
        this.applyDimensions({
            containerWidth: containerBoundingClientRect.width,
            containerHeight: containerBoundingClientRect.height,
            tableWidth: tableBoundingClientRect.width,
            tableHeight: tableBoundingClientRect.height
        });
        // Refs (which aren't null at this stage) must be propagated onto the scrollbar components.
        // This could be achieved using `this.forceUpdate()` but the `this.applyDimensions` method above already triggers the required re-render.
    };
    ReactTableContainer.prototype.componentWillUnmount = function () {
        // Remove listeners
        this.tableElement.removeEventListener("wheel", this.onWheel);
        this.tableElement.removeEventListener("touchstart", this.onTouchStart);
        this.tableElement.removeEventListener("touchmove", this.onTouchMove);
        this.tableElement.removeEventListener("touchend", this.onTouchEnd);
        this.tableElement.removeEventListener("touchcancel", this.onTouchEnd);
        window.removeEventListener("resize", this.onWindowResize);
    };
    ReactTableContainer.prototype.componentDidUpdate = function () {
        this.refreshHeaders();
        this.reevaluateDimensions();
    };
    ReactTableContainer.prototype.render = function () {
        var _this = this;
        var _a = this.props, children = _a.children, style = _a.style, className = _a.className, width = _a.width, height = _a.height, customHeader = _a.customHeader, scrollbarStyle = _a.scrollbarStyle;
        var _b = this.state, tableMarginTop = _b.tableMarginTop, verticalPercentageScrolled = _b.verticalPercentageScrolled, tableMarginLeft = _b.tableMarginLeft, horizontalPercentageScrolled = _b.horizontalPercentageScrolled;
        var containerStyle = {
            boxSizing: "border-box",
            position: "relative",
            display: "inline-block",
            overflow: "hidden",
            width: width,
            height: height
        };
        var containerProps = {
            ref: function (ref) { return (_this.containerRef = ref); },
            style: __assign({}, style, containerStyle),
            className: className
        };
        // Only one direct child (i.e. <table>) is allowed
        var table = React.Children.only(children);
        // Set table props
        var tableProps = __assign({}, table.props, { ref: function (ref) { return (_this.tableRef = ref); }, "data-rtc-id": this.tableId, style: __assign({}, table.props.style, { borderSpacing: 0, marginTop: -tableMarginTop, marginLeft: -tableMarginLeft }) });
        // Set header table props
        var headerTableProps = __assign({}, table.props, { ref: function (ref) { return (_this.headerTableRef = ref); }, "data-rtc-id": this.headerTableId, style: __assign({}, table.props.style, { borderSpacing: 0, position: "absolute", top: 0, left: -tableMarginLeft, zIndex: 1 }), role: "presentation", "aria-hidden": "true" });
        var tableChildren = React.Children.toArray(table.props.children);
        var headerRelatedItems = customHeader ? __spread(this.headerRelatedHTMLElements, customHeader) : this.headerRelatedHTMLElements;
        // Extract out header related children
        var headerRelatedChildren = tableChildren.filter(function (_a) {
            var type = _a.type;
            return headerRelatedItems.indexOf(type) !== -1;
        });
        return (React.createElement("div", __assign({}, containerProps),
            React.cloneElement(table, headerTableProps, headerRelatedChildren),
            React.cloneElement(table, tableProps),
            React.createElement(TableVerticalScrollbar, { style: scrollbarStyle, containerRef: this.containerRef, tableRef: this.tableRef, scrollTo: verticalPercentageScrolled, onScroll: this.onVerticalScroll }),
            React.createElement(TableHorizontalScrollbar, { style: scrollbarStyle, containerRef: this.containerRef, tableRef: this.tableRef, scrollTo: horizontalPercentageScrolled, onScroll: this.onHorizontalScroll })));
    };
    // For instance, if the table gets wider, the horizontal scrollbar will remain in the same place, but the amount of percentage scrolled will be now be less
    ReactTableContainer.prototype.applyDimensions = function (dimensions) {
        var _a = this.state, tableMarginTop = _a.tableMarginTop, verticalPercentageScrolled = _a.verticalPercentageScrolled, tableMarginLeft = _a.tableMarginLeft, horizontalPercentageScrolled = _a.horizontalPercentageScrolled;
        var verticalMaxScrollable = dimensions.tableHeight - dimensions.containerHeight;
        tableMarginTop = Math.max(0, Math.min(tableMarginTop, verticalMaxScrollable));
        verticalPercentageScrolled = verticalMaxScrollable
            ? tableMarginTop / verticalMaxScrollable
            : 0;
        var horizontalMaxScrollable = dimensions.tableWidth - dimensions.containerWidth;
        tableMarginLeft = Math.max(0, Math.min(tableMarginLeft, horizontalMaxScrollable));
        horizontalPercentageScrolled = horizontalMaxScrollable
            ? tableMarginLeft / horizontalMaxScrollable
            : 0;
        this.setState({
            containerWidth: dimensions.containerWidth,
            containerHeight: dimensions.containerHeight,
            tableWidth: dimensions.tableWidth,
            tableHeight: dimensions.tableHeight,
            tableMarginTop: tableMarginTop,
            verticalPercentageScrolled: verticalPercentageScrolled,
            tableMarginLeft: tableMarginLeft,
            horizontalPercentageScrolled: horizontalPercentageScrolled
        });
    };
    // If scrolling within the table hits any boundary, propagate it onto the window object
    ReactTableContainer.prototype.setWindowScroll = function (verticalMaxScrollable, newTableMarginTop, horizontalMaxScrollable, newTableMarginLeft) {
        var scrollByX = 0;
        var scrollByY = 0;
        if (newTableMarginTop < 0) {
            scrollByY = newTableMarginTop;
        }
        else if (newTableMarginTop > verticalMaxScrollable) {
            scrollByY = newTableMarginTop - verticalMaxScrollable;
        }
        if (newTableMarginLeft < 0) {
            scrollByX = newTableMarginLeft;
        }
        else if (newTableMarginLeft > horizontalMaxScrollable) {
            scrollByX = newTableMarginLeft - horizontalMaxScrollable;
        }
        window.scrollBy(scrollByX, scrollByY);
    };
    return ReactTableContainer;
}(React.Component));

module.exports = ReactTableContainer;
