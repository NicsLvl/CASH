import { DATA_REDUCER } from "../actionTypes";

const initialState = {
  inputData: {
    expenses: [
      {
        newExpenseName: "Expense 1",
        newExpenseAmount: 1628,
        newAgeFrom: 30,
        newAgeTo: 85,
        newRate: 2.52,
      },
    ],
    incomes: [
      {
        newIncomeName: "Income 1",
        newIncomeAmount: 4534,
        newAgeFrom: 30,
        newAgeTo: 64,
        newRate: 4.2,
        newBonus: 2,
      },
    ],
    personalInformation: {
      startingAge: 30,
      startingSaving: 150000,
      retirementAge: 62,
      lifeExpectancy: 85,
      investmentPercentage: 30,
    },
    housingInfo: {
      housePrice: 500000,
      targetAge: 34,
      houseInterestRate: 2.6,
      loanLength: 20,
      downPayment: 15,
    },
    rates: {
      housePriceIndex: 5.96,
      investmentRate: 5.9,
      bankInterestRate: 1,
    },
  },
  data: {
    // life_expectancy: inputData.personalInformation.lifeExpectancy,
    maximum_income_reduction: "26%",
    minimum_investment_percentage: "0%",
    minimum_investment_rate: "0%",
    potential_max_expenses: "33%",
    recommended_retirement_age: "56",
    zero_savings_age: "104",
  },
};

export default function DataReducer(state = initialState, action) {
  switch (action.type) {
    case DATA_REDUCER: {
      return Object.assign({}, state, {
        data: action.payload,
        inputData: action.inputData,
      });
    }
    default:
      return state;
  }
}
