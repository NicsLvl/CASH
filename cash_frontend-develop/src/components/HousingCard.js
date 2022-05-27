import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import HouseIcon from "@material-ui/icons/House";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import { getProjectedValues } from "../redux/inputDataAction";
import { useFormik } from "formik";
import * as Yup from "yup";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    height: "100%",
  },
  title: {
    fontSize: 18,
  },
  label: {
    padding: theme.spacing(1, 0, 0, 0),
    fontSize: 14,
  },
  moveright: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export default function HousingCard() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.DataReducer.inputData);
  const housingInfoData = data.housingInfo;
  const formik = useFormik({
    initialValues: housingInfoData,
    validationSchema: Yup.object({
      housePrice: Yup.number().min(1).required("Required"),
      targetAge: Yup.number().min(1).required("Required"),
      houseInterestRate: Yup.number().required("Required"),
      loanLength: Yup.number().min(1).required("Required"),
      downPayment: Yup.number().required("Required"),
    }),
  });

  const handleOnBlur = () => {
    let housingData = Object.assign({}, formik.values);
    let updatedData = Object.assign({}, data, {
      housingInfo: housingData,
    });

    if (_.isEmpty(formik.errors)) {
      dispatch(getProjectedValues(updatedData));
    }
  };

  let { values, handleChange } = formik;
  return (
    <>
      <CardHeader
        title={
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Housing
          </Typography>
        }
        avatar={<HouseIcon />}
        classes={{
          title: classes.title,
        }}
      />
      <CardContent>
        <Grid container>
          <Grid item xs={8}>
            <Typography
              className={classes.label}
              color="textSecondary"
              gutterBottom
            >
              <label htmlFor="housePrice">Purchase Price</label>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="housePrice"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
              onBlur={handleOnBlur}
              value={values.housePrice}
              error={formik.errors.housePrice}
            />
          </Grid>
          <Grid item xs={8}>
            <Typography
              className={classes.label}
              color="textSecondary"
              gutterBottom
            >
              <label htmlFor="targetAge">Purchase Age</label>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="targetAge"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
              onBlur={handleOnBlur}
              value={values.targetAge}
              error={formik.errors.targetAge}
            />
          </Grid>
          <Grid item xs={8}>
            <Typography
              className={classes.label}
              color="textSecondary"
              gutterBottom
            >
              <label htmlFor="houseInterestRate">Loan Interest Rate (%)</label>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="houseInterestRate"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
              onBlur={handleOnBlur}
              value={values.houseInterestRate}
              error={formik.errors.houseInterestRate}
            />
          </Grid>
          <Grid item xs={8}>
            <Typography
              className={classes.label}
              color="textSecondary"
              gutterBottom
            >
              <label htmlFor="downPayment">Downpayment (%)</label>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="downPayment"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
              onBlur={handleOnBlur}
              value={values.downPayment}
              error={formik.errors.downPayment}
            />
          </Grid>
          <Grid item xs={8}>
            <Typography
              className={classes.label}
              color="textSecondary"
              gutterBottom
            >
              <label htmlFor="loanLength">Loan Duration (Years)</label>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="loanLength"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
              onBlur={handleOnBlur}
              value={values.loanLength}
              error={formik.errors.loanLength}
            />
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
}
