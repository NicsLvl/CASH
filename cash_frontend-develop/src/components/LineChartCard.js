import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import AssessmentIcon from "@material-ui/icons/Assessment";
import Typography from "@material-ui/core/Typography";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100%",
    width: "100%",
  },
  paper: {
    backgroundColor: "#FFFFB7",
    padding: theme.spacing(2),
    width: "60%",
  },
  title: {
    fontSize: 18,
  },
  spanText: {
    fontWeight: "bold",
  },
  gridContainer: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default function LineChartCard() {
  const data = useSelector((state) => state.DataReducer.data);
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <CardHeader
          avatar={<AssessmentIcon />}
          title={
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Projected Values
            </Typography>
          }
          classes={{
            title: classes.title,
          }}
        />
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            width={500}
            height={400}
            data={data.data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="age"  label={{ fontSize:"14", value: 'Age', fill:"#676767", position: 'insideBottomRight', dy:20}} />
            <YAxis
              width={80}
              yAxisId="left"
              orientation="left"
              tick={{ fontSize: 8 }}
            >
              <Label
                value={"Net Assets"}
                angle={0}
                position="top"
                fill="#676767"
                fontSize={14}
              />
            </YAxis>
            <YAxis
              width={80}
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10 }}
            >
              <Label
                value={"Income / Expense"}
                angle={0}
                position="top"
                fill="#676767"
                fontSize={14}
              />
            </YAxis>
            <Tooltip />
            <Legend />
            <Bar dataKey="total" yAxisId="left" barSize={20} fill="#413ea0" />
            <Line
              type="monotone"
              dataKey="income"
              yAxisId="right"
              stroke="#ff7300"
            />
            <Line
              type="monotone"
              dataKey="expense"
              yAxisId="right"
              stroke="#008000"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <Grid container className={classes.gridContainer}>
          <Paper className={classes.paper}>
          
          <Grid item xs={12}>
              <Typography>
                🚫 The first time your net assets reach negative is when you are {" "}
                <span className={classes.spanText}>
                  {data.zero_savings_age}
                </span>
              </Typography>
            </Grid>
          <Grid item xs={12}>
              <Typography>
               In order to retire comfortably at your desired life expectancy you may choose to:
              </Typography>
            </Grid>
          <Grid item xs={12}>
              <Typography>
                🛒 Increase your expenses by up to {" "}
                <span className={classes.spanText}>
                  {data.potential_max_expenses}
                </span>
              </Typography>
            </Grid>
          <Grid item xs={12}>
              <Typography>
                OR 💰 reduce your income by up to {" "}
                <span className={classes.spanText}>
                  {data.maximum_income_reduction}
                </span>
              </Typography>
            </Grid>
          <Grid item xs={12}>
              <Typography>
                OR 👴 retire at  {" "}
                <span className={classes.spanText}>
                  {data.recommended_retirement_age}
                </span>
              </Typography>
            </Grid>
          
          {/* <Grid item xs={12}>
              <Typography>
                📈 Your lowest investment annual rate is{" "}
                <span className={classes.spanText}>
                  {data.minimum_investment_rate}
                </span>
              </Typography>
            </Grid>
          <Grid item xs={12}>
              <Typography>
                🥚 Your lowest investment allocation percentage is{" "}
                <span className={classes.spanText}>
                  {data.minimum_investment_percentage}
                </span>
              </Typography>
            </Grid> */}
           
            
          </Paper>
        </Grid>
      </CardContent>
    </Card>
  );
}
