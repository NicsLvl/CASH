"""Create an application instance."""
from flask.helpers import get_debug_flag

from cash.settings import DevConfig, ProdConfig
from cash.app import create_app

CONFIG = DevConfig if get_debug_flag() else ProdConfig

application = create_app(CONFIG)

if __name__ == "__main__":
    application.run(host='0.0.0.0')