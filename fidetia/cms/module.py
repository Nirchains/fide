# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

from __future__ import unicode_literals

class Module:
    def __init__(self, module_type, position, show_title, title, include = "", css_class = ""):
        self.module_type = module_type
        self.position = position
        self.show_title = show_title
        self.title = title
        self.include = include
        self.css_class = css_class