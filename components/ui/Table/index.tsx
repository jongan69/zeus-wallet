import React, { createContext, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Divider from "@/components/ui/Divider";
import Icon from "@/components/ui/Icons";
import { IconName } from "@/components/ui/Icons/icons";
import Tooltip from "@/components/ui/Tooltip";

export interface TableProps {
  /** Table Content */
  children?: React.ReactNode;
  /** Allow overflow */
  allowOverflow?: boolean;
  /** Custom classNames */
  className?: string;
  /** Custom column sizing */
  columnSizes?: number[];
  /** Should last item align to end */
  lastItemAlignEnd?: boolean;
  /** Is the first item sticky */
  stickFirstItem?: boolean;
  /** Is the last item sticky */
  stickLastItem?: boolean;
  /** Show Labels on Mobile */
  showLabelsOnMobile?: boolean;
  /** Table Type */
  tableType?: "default" | "stacked";
  /** Table Headers */
  headers?: string[];
  /** Header Size */
  headerSize?: "small" | "large";
  /** Table Width */
  width?: "auto" | "stretch";
  /** Table Variant */
  variant?: "nested" | "separated";
  /** Show Divider on mobile */
  showDividerOnMobile?: boolean;
  /** Hide last divider on mobile */
  hideLastDividerOnMobile?: boolean;
}

export interface TableHeaderProps {
  /** Hide on mobile */
  hideOnMobile?: boolean;
}

export interface MobileHeaderProps {
  /** Children of MobileHeader */
  children: React.ReactNode;
  /** Custom classNames */
  className?: string;
}

export interface TableBodyProps {
  /** Children of TableBody */
  children: React.ReactNode;
  /** Custom classNames */
  className?: string;
}

export interface TableRowProps {
  /** Children of TableRow */
  children: React.ReactNode;
  /** Custom classNames */
  className?: string;
  /** Size of all cells in the row */
  size?: "small" | "medium" | "large" | "medium/16px";
  /** Show mobile header */
  mobileHeader?: React.ReactNode;
  /** Row index (for internal use) */
  rowIndex?: number;
  /** Cell index (for internal use) */
  index?: number;
}

export interface TableCellProps {
  /** Cell Value */
  value?: string | number | React.ReactNode;
  /** Custom classNames */
  className?: string;
  /** Left Icon */
  leftIcon?: IconName;
  /** Left Icon Size */
  leftIconSize?: 18 | 14 | 12;
  /** Left Icon Classname */
  leftIconClassName?: string;
  /** Right Icon */
  rightIcon?: IconName;
  /** Right Icon Size */
  rightIconSize?: 18 | 14 | 12;
  /** Right Icon Classname */
  rightIconClassName?: string;
  /** Right Icon On Click */
  rightIconOnClick?: () => void;
  /** Right Icon On Mouse Enter */
  rightIconOnMouseEnter?: () => void;
  /** Right Icon On Mouse Leave */
  rightIconOnMouseLeave?: () => void;
  /** Hide on mobile */
  hideOnMobile?: boolean;
  /** Hide labels on mobile */
  hideLabelOnMobile?: boolean;
  /** Children of TableCell */
  children?: React.ReactNode;
  /** Full Width on Mobile */
  fullWidthMobile?: boolean;
  /** Show Lock Icon */
  showLockIcon?: boolean;
  /** Show Copied Tooltip */
  showCopiedTooltip?: boolean;
  /** Copied Tooltip ClassName */
  copiedTooltipClassName?: string;
  /** Cell index (for internal use) */
  index?: number;
  /** Row index (for internal use) */
  rowIndex?: number;
}


function checkGridIsValid(arr: number[]) {
  const sum = arr.reduce((a, b) => a + b, 0);
  if (sum !== 8 && sum !== 16 && sum !== 32) {
    console.warn(
      `To ensure correct design practices, table grids should sum to 8, 16 or 32. Got: ${sum}`
    );
  }
  return arr;
}

const TableContext = createContext<{
  columnSizes?: number[];
  lastItemAlignEnd?: boolean;
  cellSize?: "small" | "medium" | "large" | "medium/16px";
  stickFirstItem?: boolean;
  stickLastItem?: boolean;
  tableType?: "default" | "stacked";
  showLabelsOnMobile?: boolean;
  headers?: string[];
  headerSize?: "small" | "large";
  width?: "auto" | "stretch";
  variant?: "nested" | "separated";
  showDividerOnMobile?: boolean;
  hideLastDividerOnMobile?: boolean;
  isOverflowing?: boolean;
}>({});

const Table = ({
  children,
  columnSizes,
  lastItemAlignEnd,
  stickFirstItem,
  stickLastItem,
  tableType = "default",
  showLabelsOnMobile = true,
  headers,
  headerSize = "small",
  width = "auto",
  variant = "nested",
  showDividerOnMobile = false,
  hideLastDividerOnMobile = false,
}: TableProps) => {
  // No DOM refs/ResizeObserver in RN
  const validatedColumnSizes = columnSizes
    ? checkGridIsValid(columnSizes)
    : undefined;

  const tableContext = React.useMemo(
    () => ({
      columnSizes: validatedColumnSizes,
      lastItemAlignEnd,
      stickFirstItem,
      stickLastItem,
      tableType,
      headers,
      headerSize,
      showLabelsOnMobile,
      width,
      variant,
      showDividerOnMobile,
      hideLastDividerOnMobile,
      isOverflowing: false, // Not tracked in RN
    }),
    [
      validatedColumnSizes,
      lastItemAlignEnd,
      stickFirstItem,
      stickLastItem,
      tableType,
      headers,
      headerSize,
      showLabelsOnMobile,
      width,
      showDividerOnMobile,
      hideLastDividerOnMobile,
      variant,
    ]
  );

  return (
    <ScrollView horizontal style={styles.tableContainer}>
      <View style={styles.tableInner}>
        <TableContext.Provider value={tableContext}>
          {children}
        </TableContext.Provider>
      </View>
    </ScrollView>
  );
};

const TableHeader = () => {
  const { headers } = React.useContext(TableContext);
  if (!headers || headers.length === 0) return null;
  return (
    <View style={styles.headerRow}>
      {headers.map((header, idx) => (
        <View style={styles.headerCell} key={idx}>
          <Text style={styles.headerText}>{header}</Text>
        </View>
      ))}
    </View>
  );
};

const TableBody = ({ children }: TableBodyProps) => {
  const rows = React.Children.toArray(children);
  return (
    <View style={styles.body}>
      {rows.map((row, index) => {
        if (React.isValidElement(row) &&
            (row.type === TableRow || (row.type as any).displayName === 'TableRow')) {
          return (
            <React.Fragment key={index}>
              {React.cloneElement(row as React.ReactElement<any>, { rowIndex: index })}
              {index < rows.length - 1 && <Divider />}
            </React.Fragment>
          );
        }
        return row;
      })}
    </View>
  );
};

const TableRow = ({
  children,
  size = "small",
  mobileHeader,
  rowIndex,
}: TableRowProps) => {
  const rowCellCount = React.Children.count(children);
  const {
    columnSizes,
    lastItemAlignEnd,
    stickFirstItem,
    stickLastItem,
    tableType,
    headers,
    showLabelsOnMobile,
    width,
    variant,
    showDividerOnMobile,
    hideLastDividerOnMobile,
    isOverflowing,
  } = React.useContext(TableContext);

  const validatedColumnSizes = columnSizes
    ? checkGridIsValid(columnSizes)
    : undefined;
  const rowContext = React.useMemo(
    () => ({
      columnSizes: validatedColumnSizes,
      cellSize: size,
      lastItemAlignEnd,
      stickFirstItem,
      stickLastItem,
      tableType,
      mobileHeader,
      rowCellCount,
      headers,
      showLabelsOnMobile,
      width,
      variant,
      showDividerOnMobile,
      hideLastDividerOnMobile,
      isOverflowing,
    }),
    [
      validatedColumnSizes,
      size,
      lastItemAlignEnd,
      stickFirstItem,
      stickLastItem,
      tableType,
      mobileHeader,
      rowCellCount,
      headers,
      showLabelsOnMobile,
      width,
      variant,
      showDividerOnMobile,
      hideLastDividerOnMobile,
      isOverflowing,
    ]
  );

  return (
    <TableContext.Provider value={rowContext}>
      <View style={styles.row}>
        {tableType === "stacked" && mobileHeader && (
          <Text style={styles.mobileHeader}>{mobileHeader}</Text>
        )}
        {React.Children.map(children, (child, index) => {
          if (
            React.isValidElement(child) &&
            (child.type === TableCell || (child.type as any).displayName === 'TableCell')
          ) {
            return (
              <React.Fragment key={index}>
                {React.cloneElement(child as React.ReactElement<any>, { index, rowIndex })}
                {/* Divider logic for mobile/stacked */}
              </React.Fragment>
            );
          }
          return child;
        })}
      </View>
    </TableContext.Provider>
  );
};

const MobileHeader = ({ children }: MobileHeaderProps) => {
  return <View style={styles.mobileHeaderContainer}>{children}</View>;
};

const TableCell = ({
  value,
  leftIcon,
  rightIcon,
  rightIconOnClick,
  showCopiedTooltip = false,
  index,
  children,
  hideLabelOnMobile,
  showLockIcon,
}: TableCellProps & { index?: number; rowIndex?: number }) => {
  const {
    tableType,
    showLabelsOnMobile,
    headers,
  } = React.useContext(TableContext);

  const [isCopied, setIsCopied] = useState(false);

  function handleCopy() {
    if (!isCopied) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    }
  }

  return (
    <View style={styles.cell}>
      {showLabelsOnMobile &&
        !hideLabelOnMobile &&
        tableType === "stacked" &&
        headers && (
          <Text style={styles.cellText}>
            {index !== undefined && headers[index]}
          </Text>
        )}
      <View style={styles.cellContent}>
        {leftIcon && <Icon name={leftIcon} size={18} />}
        {value && <Text style={styles.cellText}>{value}</Text>}
        {children}
        {rightIcon && rightIconOnClick ? (
          <TouchableOpacity
            onPress={() => {
              rightIconOnClick();
              handleCopy();
            }}
            style={styles.iconButton}
          >
            {showCopiedTooltip && isCopied && (
              <Tooltip isOpen>
                Copied
              </Tooltip>
            )}
            <Icon name={rightIcon} size={18} />
          </TouchableOpacity>
        ) : rightIcon ? (
          <Icon name={rightIcon} size={18} />
        ) : null}
        {showLockIcon && (
          <Icon name="Lock" size={18} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: { width: "100%" },
  tableInner: { flex: 1 },
  headerRow: { flexDirection: "row", backgroundColor: "#f0f0f0" },
  headerCell: { flex: 1, padding: 8 },
  headerText: { fontWeight: "bold" },
  body: {},
  row: { flexDirection: "row" },
  cell: { flex: 1, padding: 8, flexDirection: "row", alignItems: "center" },
  cellText: { flex: 1 },
  mobileHeaderContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 8,
  },
  mobileHeader: {
    flex: 1,
    fontWeight: "bold",
  },
  hiddenDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "#f0f0f0",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 0,
  },
  icon: {
    marginLeft: 8,
  },
  lockIcon: {
    marginLeft: 8,
  },
  cellContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});

// Set displayName for TableRow and TableCell for type checks
TableRow.displayName = 'TableRow';
TableCell.displayName = 'TableCell';

export default Table;
export { MobileHeader, TableBody, TableCell, TableHeader, TableRow };

