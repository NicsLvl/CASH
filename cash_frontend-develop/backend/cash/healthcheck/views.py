# coding: utf-8
from cash.database import db

from flask import Blueprint

blueprint = Blueprint('healthcheck', __name__)


@blueprint.route('/', methods=('GET',))
def healthy():
    return ''
