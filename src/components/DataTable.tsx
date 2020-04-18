import React from "react";
import {
  Column,
  PagingState,
  IntegratedPaging,
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  Toolbar,
  SearchPanel,
  PagingPanel,
} from "@devexpress/dx-react-grid-material-ui";
import { Paper } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(2),
    },
  })
);

interface DataTableProps<T> {
  dataType: string;
  columns: Array<Column>;
  rows: Array<T>;
  handleRowClick: (redirect: string) => void;
}

function DataTable<T>(props: DataTableProps<T>) {
  const { dataType, columns, rows, handleRowClick } = props;
  const classes = useStyles();
  const [pageSizes] = React.useState([5, 10, 15, 0]);

  const TableRow = ({ row, ...restProps }: Table.DataRowProps) => {
    return (
      <Table.Row
        {...restProps}
        style={{ cursor: "pointer" }}
        onClick={() => handleRowClick(`/${dataType}/${row.id}`)}
        row={row}
      />
    );
  };

  return (
    <Paper className={classes.paper}>
      <Grid columns={columns} rows={rows}>
        <SearchState />
        <IntegratedFiltering />
        <SortingState
          defaultSorting={[{ columnName: "id", direction: "desc" }]}
        />
        <IntegratedSorting />
        <PagingState defaultCurrentPage={0} defaultPageSize={5} />
        <IntegratedPaging />
        <Table rowComponent={TableRow} />
        <TableHeaderRow showSortingControls />
        <Toolbar />
        <SearchPanel />
        <PagingPanel pageSizes={pageSizes} />
      </Grid>
    </Paper>
  );
}

export default DataTable;
