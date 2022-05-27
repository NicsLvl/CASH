import React from "react";
import Grid from "@material-ui/core/Grid";
import LineChartCard from "../../components/LineChartCard";
import IncomeCard from "../../components/IncomeCard";
import ExpenseCard from "../../components/ExpenseCard";
import RateCard from "../../components/RateCard";

export default function MarriageTab() {
  return (
    <Grid container spacing={2}>
      <Grid container item xs={12} spacing={3}>
        <>
          <Grid item xs={12} sm={6} md={2} lg={2} xl={2}>
            <RateCard />
          </Grid>
          <Grid item xs={12} sm={6} md={5} lg={5} xl={5}></Grid>
          <Grid item xs={12} sm={6} md={5} lg={5} xl={5}>
            <LineChartCard />
          </Grid>
        </>
      </Grid>
      <Grid container item xs={12} spacing={3}>
        <>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <IncomeCard />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <ExpenseCard />
          </Grid>
        </>
      </Grid>
    </Grid>
  );
}
