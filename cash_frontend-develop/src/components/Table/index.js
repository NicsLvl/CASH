import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  tableHeader: {
    fontWeight: "bold",
  },
  tableContainer: {
    margin: theme.spacing(2, 0),
  },
}));

export default function CustomTable(props) {
  const classes = useStyles();
  const pagination = props.hasPagination ? (
    <TableFooter>
      <TablePagination></TablePagination>
    </TableFooter>
  ) : null;
  const header = props.dataHeader ? (
    <TableHead stickyHeader className={classes.tableHeader}>
      {props.dataHeader}
    </TableHead>
  ) : null;
  return (
    <Table className={classes.tableContainer} component={Paper}>
      {header}
      <TableBody>{props.dataRows}</TableBody>
      {pagination}
    </Table>
  );
}
