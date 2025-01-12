import os
import yaml
import logging
import logging.config


def load_log_conf(file):
    """
    Returns:
        logger: Logger
    """
    with open(file, 'r') as f:
        log_config = yaml.safe_load(f.read())
        logging.config.dictConfig(log_config)
        logger = logging.getLogger('basicLogger')

    return logger