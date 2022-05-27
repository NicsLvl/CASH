# coding: utf-8
import json
import uuid
import sys

from flask import Blueprint, jsonify
from flask_apispec import marshal_with, use_kwargs
from flask_cors import cross_origin
from flask import request

import numpy as np

from .models import Report
from .serializers import report_input_schema, calculate_output_schema


blueprint = Blueprint('calculate', __name__)


@blueprint.route('/api/calculate', methods=('POST', 'OPTIONS'))
@use_kwargs(report_input_schema)
@marshal_with(calculate_output_schema)
@cross_origin(origin='*')
def make_report(**kwargs):
    starting_age = kwargs["personalInformation"]["startingAge"]
    starting_savings = kwargs["personalInformation"]["startingSaving"]
    life_expectancy = kwargs["personalInformation"]["lifeExpectancy"]
    retirement_age = kwargs["personalInformation"]["retirementAge"]
    percentage_investment = kwargs["personalInformation"]["investmentPercentage"]

    # inflation_rate = kwargs["rates"]["inflationRate"]
    housing_price_index = kwargs["rates"]["housePriceIndex"]
    investment_rate = kwargs["rates"]["investmentRate"]
    bank_interest_rate = kwargs["rates"]["bankInterestRate"]

    total_monthly_income = transform_to_arr_income(kwargs["incomes"])
    total_monthly_expense = transform_to_arr_expenses(kwargs["expenses"])

    house_value = kwargs["housingInfo"]["housePrice"]
    house_purchase_age = kwargs["housingInfo"]["targetAge"]
    house_loan_years = kwargs["housingInfo"]["loanLength"]
    house_downpayment_percentage = kwargs["housingInfo"]["downPayment"]
    house_interest_rate = kwargs["housingInfo"]["houseInterestRate"]

    # We will only project 20 years past life expectancy
    Final_Age = life_expectancy + 20
    Age_List = list(range(starting_age, Final_Age+1))

    def expense():
        # Creating lists for different expense streams
        amount = []
        starting = []
        ending = []
        rate = []

        # Putting FE values into the respective lists
        for x in range(4):
            for i in total_monthly_expense[x::4]:
                if x == 0:
                    amount.append(i)
                elif x == 1:
                    starting.append(i)
                elif x == 2:
                    ending.append(i)
                else:
                    rate.append(i)

        # Calculate Total Expenses
        total = [0 for x in range(len(Age_List))]

        for i in range(len(amount)):
            first_part = [0 for x in range(starting[i]-starting_age)]
            if life_expectancy > ending[i]:
                middle_part = [
                    amount[i]*12*(1+rate[i]/100)**x for x in range(ending[i]-starting[i]+1)]
                last_part = [0 for x in range(Final_Age-ending[i])]
            else:
                middle_part = [
                    amount[i]*12*(1+rate[i]/100)**x for x in range(Final_Age-starting[i]+1)]
                last_part = []

            total_sub = first_part+middle_part+last_part
            total = [x + y for x, y in zip(total, total_sub)]

        # Housing Downpayment
        # if any of the inputs are not there, we don't compute housing expenses
        if validate_housing_params(
            house_value,
            house_purchase_age,
            house_loan_years,
            house_downpayment_percentage,
            house_interest_rate
        ):
            housing_downpayment = []

            for idx, age in enumerate(Age_List):
                if age == house_purchase_age:
                    price = house_value*(1+housing_price_index/100)**(idx) * \
                        (house_downpayment_percentage/100)
                    housing_downpayment.append(price)
                else:
                    housing_downpayment.append(0)

            total = [x + y for x, y in zip(total, housing_downpayment)]

            # Housing Mortgage
            housing_mortgage = []
            for idx, age in enumerate(Age_List):
                if age == house_purchase_age:
                    remaining_value = house_value*(1+housing_price_index/100)**(idx) * \
                        (1-house_downpayment_percentage/100)
            for idx, age in enumerate(Age_List):
                payment = np.pmt(house_interest_rate/100,
                                    house_loan_years, -remaining_value)
                if age in range(house_purchase_age, house_purchase_age + house_loan_years):
                    housing_mortgage.append(payment)
                else:
                    housing_mortgage.append(0)

            total = [x + y for x, y in zip(total, housing_mortgage)]

        return total

    def income(ra=retirement_age):
        # Creating lists for different income streams
        amount = []
        starting = []
        ending = []
        rate = []
        bonus = []

        # Putting FE values into the respective lists
        for x in range(5):
            for i in total_monthly_income[x::5]:
                if x == 0:
                    amount.append(i)
                elif x == 1:
                    starting.append(i)
                elif x == 2:
                    ending.append(i)
                elif x == 3:
                    rate.append(i)
                else:
                    bonus.append(i)

        total = [0 for x in range(len(Age_List))]

        for i in range(len(amount)):
            first_part = [0 for x in range(starting[i]-starting_age)]
            middle_part = [amount[i]*(12+bonus[i])*(1+rate[i]/100)
                           ** x for x in range(ending[i]-starting[i]+1)]
            last_part = [0 for x in range(Final_Age-ending[i])]

            total_sub = first_part+middle_part+last_part
            total = [x + y for x, y in zip(total, total_sub)]

        retirement_status = []

        for age in Age_List:
            if age < ra:
                retirement_status.append(1)
            else:
                retirement_status.append(0)

        total = [x * y for x, y in zip(total, retirement_status)]

        return total

    # Calculating Net Assets
    def total(inc, exp, IR=investment_rate, IP=percentage_investment):
        ending_balance = []
        start = starting_savings
        for i in range(Final_Age-starting_age+1):
            before = start + inc[i] - exp[i]
            if before < 0:
                ending = 0
            elif before > start:
                ending = start*IP/100*(1+IR/100) + start*(1-IP/100)*(1+bank_interest_rate/100) + (
                    before-start)*IP/100*(1+IR/100)/2 + (before-start)*(1-IP/100)*(1+bank_interest_rate/100)/2
            else:
                ending = before*IP/100*(1+IR/100) + before*(1-IP/100)*(1+bank_interest_rate/100) + (
                    start-before)*IP/100*(IR/100)/2 + (start-before)*(1-IP/100)*(bank_interest_rate/100)/2
            ending_balance.append(ending)
            start = ending

        return ending_balance

    def calculate_age():
        for idx, i in enumerate(range(starting_age, Final_Age)):
            x = income()
            y = expense()
            z = total(x, y)
            if z[idx] == 0:
                return i  # first age when your net assets reach 0 at life expectancy
            elif i == Final_Age-1:
                return "N/A"  # no age where your net assets reach 0

    def max_expenses():
        for i in range(1, 101):
            x = income()
            y = [amount*(1+i/100) for amount in expense()]
            z = total(x, y)
            if z[life_expectancy-starting_age] > 0:
                pass
            elif z[life_expectancy-starting_age] == 0:
                if i == 1:
                    return "0%"
                else:
                    # How much percent you can afford to increase all your expenses
                    return str(i+1) + "%"
            else:
                return ">100%"  # You can return expenses >100%

    def calculate_retirement_age():
        # Searches for retirement age from Starting_Age till the end for the first time
        # Ending_Asset value is positive at Life_Expectancy
        for i in range(starting_age, Final_Age):
            x = income(ra=i)
            y = expense()
            z = total(x, y)
            if z[life_expectancy-starting_age] == 0:
                if i == Final_Age-1:
                    return "N/A"  # you can't retire
                else:
                    pass
            elif z[life_expectancy-starting_age] > 0:
                return i  # the earliest possible retirement age till life expectancy
            else:
                return starting_age  # no issues retiring at Starting_Age

    def calculate_investment_rate():
        # Searches for percentage from 0-100 till the end for the first time
        # Ending_Asset value at Life_Expectancy is positive
        for i in range(0, 101):
            x = income()
            y = expense()
            z = total(x, y, IR=i/100)
            if z[life_expectancy-starting_age] == 0:
                if i == 100:
                    return "N/A"  # you would require investment returns of >100%, try tweaking other parameters"
                else:
                    pass
            elif z[life_expectancy-starting_age] > 0:
                # the minimum investment rate p.a to reach life expectancy
                return str(i) + "%"

    def calculate_investment_percentage():
        # Searches for percentage allocation from 0-100 till the end for the first time
        # Ending_Asset value at Life_Expectancy is positive
        for i in range(0, 101):
            x = income()
            y = expense()
            z = total(x, y, IP=i/100)
            if z[life_expectancy-starting_age] == 0:
                if i == 100:
                    return "N/A"  # you would require investment allocation of >100%, try tweaking other parameters
                else:
                    pass
            elif z[life_expectancy-starting_age] > 0:
                # the minimum investment percentage to reach life expectancy
                return str(i) + "%"

    def calculate_max_income_reduction():
        for i in reversed(range(0, 100)):
            x = [amount*i/100 for amount in income()]
            y = expense()
            z = total(x, y)
            if z[life_expectancy-starting_age] > 0:
                if i == 0:
                    return "100%"
            elif z[life_expectancy-starting_age] == 0:
                # How much percent you can afford to reduce all your income
                return str(100-(i)-1) + "%"
            else:
                return "0%"  # You can't reduce income at all

    def validate_housing_params(
        house_value,
        house_purchase_age,
        house_loan_years,
        house_downpayment_percentage,
        house_interest_rate
    ):

        # house buying age must be between start to life expectancy
        if not (type(house_value) == int or type(house_value) == float):
            return False

        # house buying age must be between start to life expectancy
        if not (type(house_purchase_age) == int or type(house_purchase_age) == float):
            return False

        if house_purchase_age not in Age_List:
            return False

        # house buying age must be between start to life expectancy
        if not (type(house_loan_years) == int or type(house_loan_years) == float):
            return False

        # house buying age must be between start to life expectancy
        if not (type(house_downpayment_percentage) == int or type(house_downpayment_percentage) == float):
            return False

        # house buying age must be between start to life expectancy
        if not (type(house_interest_rate) == int or type(house_interest_rate) == float):
            return False

        return True

    def merge_outputs(
        expense_vals,
        income_vals,
        total_vals,
        Age_List,
    ):
        final_vals = []
        for expense, income, total, age in zip(expense_vals, income_vals, total_vals, Age_List):
            final_vals.append({
                "expense": expense,
                "income": income,
                "total": total,
                "age": age
            })

        return final_vals

    expense_vals = expense()
    income_vals = income()
    total_vals = total(income_vals, expense_vals,
                       investment_rate, percentage_investment)
    # age where you potentially deplete all your savings
    zero_savings_age = calculate_age()
    potential_max_expenses = max_expenses()
    recommended_retirement_age = calculate_retirement_age()
    minimum_investment_rate = calculate_investment_rate()
    minimum_investment_percentage = calculate_investment_percentage()
    # maximum you can reduce your income by
    maximum_income_reduction = calculate_max_income_reduction()
    merged_vals = merge_outputs(
        expense_vals, income_vals, total_vals, Age_List)

    results = {
        "data": merged_vals,
        "zero_savings_age": zero_savings_age,
        "potential_max_expenses": potential_max_expenses,
        "recommended_retirement_age": recommended_retirement_age,
        "minimum_investment_rate": minimum_investment_rate,
        "minimum_investment_percentage": minimum_investment_percentage,
        "maximum_income_reduction": maximum_income_reduction,
    }

    article = Report(report_id=uuid.uuid4(),
                     input_params=kwargs, report_results=results)
    article.save()

    return results


def transform_to_arr_income(vals):
    output = []
    for val in vals:
        output.append(val["newIncomeAmount"])
        output.append(val["newAgeFrom"])
        output.append(val["newAgeTo"])
        output.append(val["newRate"])
        output.append(val["newBonus"])

    return output


def transform_to_arr_expenses(vals):
    output = []
    for val in vals:
        output.append(val["newExpenseAmount"])
        output.append(val["newAgeFrom"])
        output.append(val["newAgeTo"])
        output.append(val["newRate"])

    return output
