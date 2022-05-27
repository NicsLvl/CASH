import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { FormControl } from "@material-ui/core";
// import CustomTable from "./Table";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { getProjectedValues } from "../redux/inputDataAction";
import { useFormik, FieldArray, Field, FormikProvider } from "formik";
import * as Yup from "yup";
import _ from "lodash";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    height: "100%",
  },
  title: {
    fontSize: 18,
  },
  icon: {
    fontSize: 25,
  },
  tableHeaderCell: {
    fontSize: theme.fontSize,
  },
  txtField: {
    margin: theme.spacing(0, 2, 0, 0),
  },
  tableContainer: {
    margin: theme.spacing(2, 0),
  },
  addBtn: {
    margin: theme.spacing(2, 0),
  },
  btnDiv: {
    display: "flex",
    justifyContent: "flex-end",
  },
  tableCell: {
    borderBottom: "solid 1px",
  },
}));

export default function ExpenseCard() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.DataReducer.inputData);
  const expenseData = data.expenses.slice();
  // let [items, setItems] = useState(expenseData);
  const formik = useFormik({
    initialValues: expenseData,
    validationSchema: Yup.array().of(
      Yup.object({
        newExpenseName: Yup.string().required("Required"),
        newExpenseAmount: Yup.number().min(1).required("Required"),
        newAgeFrom: Yup.number().min(1).required("Required"),
        newAgeTo: Yup.number().min(1).required("Required"),
        newRate: Yup.number().required("Required"),
      })
    ),
  });
  const handleChangeExpense = (e, field, values, setValues, index) => {
    // let items = [...values];
    values[index][field] = e.target.value;
    const newItems = [...values];
    setValues(newItems);
  };
  const handleOnBlur = () => {
    let expenseData = Object.assign({}, formik.values);
    let updatedData = Object.assign({}, data, {
      expenses: formik.values,
    });

    if (_.isEmpty(formik.errors)) {
      dispatch(getProjectedValues(updatedData));
    }
  };
  const dataHeader = (
    <TableRow>
      <TableCell>
        <Typography>Source of Expense</Typography>
      </TableCell>
      <TableCell>
        <Typography>Age From</Typography>
      </TableCell>
      <TableCell>
        <Typography>Age To</Typography>
      </TableCell>
      <TableCell>
        <Typography>Monthly Amount</Typography>
      </TableCell>
      <TableCell>
        <Typography>Annual Inflation (%)</Typography>
      </TableCell>
    </TableRow>
  );

  const addExpense = () => {
    let len = formik.values ? formik.values.length : 0;
    const newItem = {
      newExpenseName: "Expense " + (len + 1),
      newExpenseAmount: 1,
      newAgeFrom: 1,
      newAgeTo: 1,
      newRate: 2.52,
    };
    let newItems = [...formik.values];
    newItems.push(newItem);
    formik.setValues(newItems);
  };

  const removeIncome = (e, index) => {
    let newItems = [...formik.values];
    newItems = newItems.filter(function (value, i, arr) {
      return i !== index;
    });
    formik.setValues(newItems);
  };

  const content = (
    <FormikProvider value={formik}>
      <FieldArray
        name="expenses"
        render={() => {
          let { values, setValues } = formik;
          return (
            <>
              {values
                ? values.map((value, index) => {
                    return (
                      <TableRow key={`listItem${index}`}>
                        <TableCell>
                          <FormControl>
                            <Field
                              className={`MuiInputBase-input MuiInput-input ${classes.tableCell}`}
                              variant="standard"
                              name={`expenses.${index}.newExpenseName`}
                              type="text"
                              onChange={(e) =>
                                handleChangeExpense(
                                  e,
                                  "newExpenseName",
                                  values,
                                  setValues,
                                  index
                                )
                              }
                              onBlur={handleOnBlur}
                              value={value.newExpenseName}
                            />

                            {formik.errors[index] ? (
                              <div>{formik.errors[index].newExpenseName}</div>
                            ) : null}
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <>
                            <Field
                              className={`MuiInputBase-input MuiInput-input ${classes.tableCell}`}
                              variant="standard"
                              name={`expenses.${index}.newAgeFrom`}
                              type="text"
                              onChange={(e) =>
                                handleChangeExpense(
                                  e,
                                  "newAgeFrom",
                                  values,
                                  setValues,
                                  index
                                )
                              }
                              onBlur={handleOnBlur}
                              value={value.newAgeFrom}
                            />
                            {formik.errors[index] ? (
                              <div>{formik.errors[index].newAgeFrom}</div>
                            ) : null}
                          </>
                        </TableCell>
                        <TableCell>
                          <>
                            <Field
                              className={`MuiInputBase-input MuiInput-input ${classes.tableCell}`}
                              variant="standard"
                              name={`expenses.${index}.newAgeTo`}
                              type="text"
                              onChange={(e) =>
                                handleChangeExpense(
                                  e,
                                  "newAgeTo",
                                  values,
                                  setValues,
                                  index
                                )
                              }
                              onBlur={handleOnBlur}
                              value={value.newAgeTo}
                            />
                            {formik.errors[index] ? (
                              <div>{formik.errors[index].newAgeTo}</div>
                            ) : null}
                          </>
                        </TableCell>
                        <TableCell>
                          <>
                            <Field
                              className={`MuiInputBase-input MuiInput-input ${classes.tableCell}`}
                              variant="standard"
                              name={`expenses.${index}.newExpenseAmount`}
                              type="text"
                              onChange={(e) =>
                                handleChangeExpense(
                                  e,
                                  "newExpenseAmount",
                                  values,
                                  setValues,
                                  index
                                )
                              }
                              onBlur={handleOnBlur}
                              value={value.newExpenseAmount}
                            />
                            {formik.errors[index] ? (
                              <div>{formik.errors[index].newExpenseAmount}</div>
                            ) : null}
                          </>
                        </TableCell>
                        <TableCell>
                          <>
                            <Field
                              className={`MuiInputBase-input MuiInput-input ${classes.tableCell}`}
                              variant="standard"
                              name={`expenses.${index}.newRate`}
                              type="text"
                              onChange={(e) =>
                                handleChangeExpense(
                                  e,
                                  "newRate",
                                  values,
                                  setValues,
                                  index
                                )
                              }
                              onBlur={handleOnBlur}
                              value={value.newRate}
                              error={formik.errors}
                            />
                            {formik.errors[index] ? (
                              <div>{formik.errors[index].newRate}</div>
                            ) : null}
                          </>
                        </TableCell>
                        <TableCell>
                          {index ? (
                            <span onClick={(e) => removeIncome(e, index)}>
                              <DeleteIcon />
                            </span>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
            </>
          );
        }}
      ></FieldArray>
    </FormikProvider>
  );

  return (
    <>
      <CardHeader
        title={
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Expense
          </Typography>
        }
        avatar={<AttachMoneyIcon />}
      />
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Table className={classes.tableContainer}>
              <TableHead>{dataHeader}</TableHead>
              <TableBody>{content}</TableBody>
            </Table>
          </Grid>
          <Grid item xs={12} className={classes.btnDiv}>
            <Button
              onClick={addExpense}
              variant="contained"
              size="small"
              color="primary"
              className={classes.addBtn}
            >
              <AddIcon className={classes.icon} />
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
}
