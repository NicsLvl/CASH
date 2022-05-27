import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import HousingTab from "./Tabs/HousingTab";
import RetirementTab from "./Tabs/RetirementTab";
import MarriageTab from "./Tabs/MarriageTab";
import { TAB } from "../consts";
import Grid from "@material-ui/core/Grid";
import { getProjectedValues } from "../redux/inputDataAction";
import { connect } from "react-redux";
import PersonalInfoCard from "../components/PersonalInfoCard";
import HousingCard from "../components/HousingCard";
import IncomeCard from "../components/IncomeCard";
import ExpenseCard from "../components/ExpenseCard";
import RateCard from "../components/RateCard";
import LineChartCard from "../components/LineChartCard";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: "0 auto",
  },
  tabs: {
    margin: theme.spacing(0, 0, 2, 0),
  },
  moveright: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end",
  },
  personalInfoRoot: {
    minWidth: 275,
    height: "100%",
  },
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: <HousingTab />,
      selectedTab: "housing",
      showModal: false,
    };
    console.log("checking props", props);
  }
  handleChange = (e, newValue) => {
    let nextTab = <HousingTab />;
    switch (newValue) {
      case TAB.RETIREMENT_TAB:
        nextTab = <RetirementTab />;
        break;
      case TAB.MARRIAGE_TAB:
        nextTab = <MarriageTab />;
        break;
      default:
        nextTab = <HousingTab />;
    }
    this.setState({
      selectedTab: newValue,
      currentTab: nextTab,
    });
  };

  showModal = () => {
    this.props.calculate().then(() => {
      this.setState({ showModal: true });
    });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid container item xs={12} spacing={3}>
            <>
              <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
                <Grid
                  container
                  className={`MuiPaper-root MuiCard-root makeStyles-root-5 MuiPaper-elevation1 MuiPaper-rounded ${classes.personalInfoRoot}`}
                >
                  <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                    <PersonalInfoCard />
                  </Grid>
                  <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
                    <RateCard />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                <LineChartCard />
              </Grid>
            </>
          </Grid>
          <Grid container item xs={12} spacing={3}>
            <>
              <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
                <IncomeCard />
              </Grid>
              <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                <Grid
                  container
                  className="MuiPaper-root MuiCard-root makeStyles-root-5 MuiPaper-elevation1 MuiPaper-rounded"
                >
                  <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                    <ExpenseCard />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                    <HousingCard />
                  </Grid>
                </Grid>
              </Grid>
            </>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    calculate: (values) => dispatch(getProjectedValues(values)),
  };
};
export default connect(null, mapDispatchToProps)(withStyles(styles)(Dashboard));
