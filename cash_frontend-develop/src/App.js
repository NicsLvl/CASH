import React from "react";
import Container from "@material-ui/core/Container";
import Dashboard from "./views/Dashboard";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, "auto"),
    padding: 0,
    maxWidth: "90vw",
  },
}));

export default function App() {
  const classes = useStyles();
  return (
    <div>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Cash
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.root} maxWidth="false">
        <Dashboard />
      </Container>
    </div>
  );
}
