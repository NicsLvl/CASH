import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import { getProjectedValues } from "../redux/inputDataAction";
import { useFormik } from "formik";
import * as Yup from "yup";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  txtField: {
    margin: theme.spacing(2, 0),
  },
  icon: {
    fontSize: 50,
  },
}));

export default function RateCard() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.DataReducer.inputData);
  const ratesData = data.rates;

  const formik = useFormik({
    initialValues: ratesData,
    validationSchema: Yup.object({
      housePriceIndex: Yup.number().required("Required"),
      investmentRate: Yup.number().required("Required"),
      bankInterestRate: Yup.number().required("Required"),
    }),
  });
  const handleOnBlur = () => {
    let rateData = Object.assign({}, formik.values);
    //rateData.housePriceIndex = rateData.housePriceIndex
    //  ? rateData.housePriceIndex / 100
    //  : 0;
    //rateData.investmentRate = rateData.investmentRate
    //  ? rateData.investmentRate / 100
    //  : 0;
    //rateData.bankInterestRate = rateData.bankInterestRate
    //  ? rateData.bankInterestRate / 100
    //  : 0;
    let updatedData = Object.assign({}, data, {
      rates: rateData,
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
            Rates
          </Typography>
        }
        avatar={<TrendingUpIcon />}
      />
      <CardContent>
        <Grid container>
          {/* <TextField
            className={classes.txtField}
            variant="outlined"
            label="Inflation Rate"
            name="inflationRate"
            type="text"
            onChange={(e) => handleChange(e, "inflationRate")}
            onBlur={handleOnBlur}
            InputLabelProps={{
              shrink: true,
            }}
            value={rates.inflationRate}
            step="0.01"
          /> */}
          <TextField
            className={classes.txtField}
            variant="outlined"
            label="Housing Price Index (%)"
            name="housePriceIndex"
            type="text"
            onChange={handleChange}
            onBlur={handleOnBlur}
            InputLabelProps={{
              shrink: true,
            }}
            value={values.housePriceIndex}
            error={formik.errors.housePriceIndex}
          />
          <TextField
            className={classes.txtField}
            variant="outlined"
            label="Investment Annual Rate (%)"
            name="investmentRate"
            type="text"
            onChange={handleChange}
            onBlur={handleOnBlur}
            InputLabelProps={{
              shrink: true,
            }}
            value={values.investmentRate}
            error={formik.errors.investmentRate}
          />
          <TextField
            className={classes.txtField}
            variant="outlined"
            label="Savings Annual Rate (%)"
            name="bankInterestRate"
            type="text"
            onChange={handleChange}
            onBlur={handleOnBlur}
            InputLabelProps={{
              shrink: true,
            }}
            value={values.bankInterestRate}
            error={formik.errors.bankInterestRate}
          />
        </Grid>
      </CardContent>
    </>
  );
}
