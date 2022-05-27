# coding: utf-8
from cash.database import Model, db


class Report(Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.String(36))

    # report paramters
    input_params = db.Column(db.JSON)
    report_results = db.Column(db.JSON)

    def __init__(self, report_id, input_params, report_results):
        db.Model.__init__(self, report_id=report_id,
                          input_params=input_params, report_results=report_results)
