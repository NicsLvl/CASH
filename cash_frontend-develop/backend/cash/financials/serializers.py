# coding: utf-8
from marshmallow import Schema, fields


class ExpensesSchema(Schema):
    newExpenseName = fields.String()
    newExpenseAmount = fields.Float()
    newAgeFrom = fields.Int()
    newAgeTo = fields.Int()
    newRate = fields.Float()


class IncomeSchema(Schema):
    newIncomeName = fields.String()
    newIncomeAmount = fields.Float()
    newAgeFrom = fields.Int()
    newAgeTo = fields.Int()
    newRate = fields.Float()
    newBonus = fields.Float()


class PersonalInfoSchema(Schema):
    startingAge = fields.Int()
    startingSaving = fields.Float()
    retirementAge = fields.Int()
    lifeExpectancy = fields.Int()
    investmentPercentage = fields.Float()


class HousingInfoSchema(Schema):
    housePrice = fields.Float()
    targetAge = fields.Int()
    houseInterestRate = fields.Float()
    loanLength = fields.Int()
    downPayment = fields.Float()


class RatesSchema(Schema):
    housePriceIndex = fields.Float()
    investmentRate = fields.Float()
    bankInterestRate = fields.Float()


class TimeSeriesOutputSchema(Schema):
    expense = fields.List(fields.Float())
    income = fields.List(fields.Float())
    total = fields.List(fields.Float())
    age = fields.List(fields.Int())


class CalculateOutputSchema(Schema):
    data = fields.List(fields.Nested(TimeSeriesOutputSchema))
    zero_savings_age = fields.String()
    potential_max_expenses = fields.String()
    recommended_retirement_age = fields.String()
    minimum_investment_rate = fields.String()
    minimum_investment_percentage = fields.String()
    maximum_income_reduction = fields.String()


class ReportInputSchema(Schema):
    personalInformation = fields.Nested(PersonalInfoSchema)
    housingInfo = fields.Nested(HousingInfoSchema)
    rates = fields.Nested(RatesSchema)

    incomes = fields.List(fields.Nested(lambda: IncomeSchema()))
    expenses = fields.List(fields.Nested(lambda: ExpensesSchema()))


report_input_schema = ReportInputSchema()
calculate_output_schema = CalculateOutputSchema()
