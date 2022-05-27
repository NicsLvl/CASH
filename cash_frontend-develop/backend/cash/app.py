# -*- coding: utf-8 -*-
from flask import Flask

from flask_cors import CORS


from . import financials, healthcheck
from .settings import ProdConfig
from .extensions import cache, db, migrate


def create_app(config_object=ProdConfig):
    application = Flask(__name__.split('.')[0])
    application.url_map.strict_slashes = False
    application.config.from_object(config_object)
    register_extensions(application)
    register_blueprints(application)
    return application


def register_extensions(app):
    cache.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)


def register_blueprints(app):
    CORS(app)
    # origins = app.config.get('CORS_ORIGIN_WHITELIST', '*')
    # cors.init_app(financials.views.blueprint, origins=origins)
    # cors.init_app(financials.calculate.blueprint, origins=origins)
    # cors.init_app(healthcheck.views.blueprint, origins=origins)

    app.register_blueprint(financials.calculate.blueprint)
    app.register_blueprint(healthcheck.views.blueprint)
