# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "fidetia"
app_title = "Fidetia"
app_publisher = "PFG"
app_description = "Fidetia"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "pedro@hispalisdigital.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
#app_include_css = "/assets/fidetia/css/fidetia.css"
app_include_js = "/assets/js/common.js"

# include js, css files in header of web template
web_include_css = [ "/assets/css/fidetia.css"]
web_include_js = ["/assets/js/common.js", "/assets/js/fidetia.js"]

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "fidetia.utils.get_home_page"

website_route_rules = [
    {"from_route": "/noticias", "to_route": "Noticias Web"},
    {"from_route": "/noticias/<category>", "to_route": "Noticias Web"},
    {"from_route": "/areas-i-d-i", "to_route": "Equipos de Trabajo"}
]

# Generators
# ----------

# automatically create page for each record of this doctype
website_generators = ["Noticias Web", "Equipos de Trabajo"]

# Installation
# ------------

# before_install = "fidetia.install.before_install"
# after_install = "fidetia.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "fidetia.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"fidetia.tasks.all"
# 	],
# 	"daily": [
# 		"fidetia.tasks.daily"
# 	],
# 	"hourly": [
# 		"fidetia.tasks.hourly"
# 	],
# 	"weekly": [
# 		"fidetia.tasks.weekly"
# 	]
# 	"monthly": [
# 		"fidetia.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "fidetia.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "fidetia.event.get_events"
# }

