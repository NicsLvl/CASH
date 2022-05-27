import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import { getProjectedValues } from "../redux/inputDataAction";
import { useFormik } from "formik";
import * as Yup from "yup";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 18,
  },
  label: {
    padding: theme.spacing(1, 0, 0, 0),
    fontSize: 14,
  },
}));

const PersonalInfoCard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.DataReducer.inputData);
  const personalInfoData = data.personalInformation;
  // const [personalInfo, setPersonalInfo] = useState(personalInfoData);
  const formik = useFormik({
    initialValues: personalInfoData,
    validationSchema: Yup.object({
      startingAge: Yup.number().min(1).required("Required"),
      startingSaving: Yup.number().min(1).required("Required"),
      retirementAge: Yup.number().min(1).required("Required"),
      lifeExpectancy: Yup.number().min(1).required("Required"),
      investmentPercentage: Yup.number().required("Required"),
    }),
  });
  // const handleOnChange = (e, fieldName) => {
  //   let info = {};
  //   info[fieldName] = e.target.value;
  //   let newPersonalInfo = Object.assign({}, personalInfo, info);
  //   setPersonalInfo(newPersonalInfo);
  // };
  const handleOnBlur = () => {
    let personalInfo = Object.assign({}, formik.values);
    let updatedData = Object.assign({}, data, {
      personalInformation: personalInfo,
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
            Personal Information
          </Typography>
        }
        avatar={<PermIdentityIcon />}
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
              <label htmlFor="startingAge">Current Age</label>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="startingAge"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
              onBlur={handleOnBlur}
              value={values.startingAge}
              error={formik.errors.startingAge}
            />
          </Grid>
          <Grid item xs={8}>
            <Typography
              className={classes.label}
              color="textSecondary"
              gutterBottom
            >
              <label htmlFor="startingSaving">Current Savings</label>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="startingSaving"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
              onBlur={handleOnBlur}
              value={values.startingSaving}
              error={formik.errors.startingSaving}
            />
          </Grid>
          <Grid item xs={8}>
            <Typography
              className={classes.label}
              color="textSecondary"
              gutterBottom
            >
              <label htmlFor="retirementAge">Retirement Age</label>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="retirementAge"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
              onBlur={handleOnBlur}
              value={values.retirementAge}
              error={formik.errors.retirementAge}
            />
          </Grid>
          <Grid item xs={8}>
            <Typography
              className={classes.label}
              color="textSecondary"
              gutterBottom
            >
              <label htmlFor="lifeExpectancy">Life Expectancy</label>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="lifeExpectancy"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
              onBlur={handleOnBlur}
              value={values.lifeExpectancy}
              error={formik.errors.lifeExpectancy}
            />
          </Grid>
          <Grid item xs={8}>
            <Typography
              className={classes.label}
              color="textSecondary"
              gutterBottom
            >
              <label htmlFor="investmentPercentage">
                 Savings Invested (%)
              </label>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="investmentPercentage"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
              onBlur={handleOnBlur}
              value={values.investmentPercentage}
              error={formik.errors.investmentPercentage}
            />
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};

export default PersonalInfoCard;
