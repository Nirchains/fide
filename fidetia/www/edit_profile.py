# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from fidetia.core.user.user import get_fullname

no_cache = 1
no_sitemap = 1

def get_context(context):
	user = frappe.get_doc('User', frappe.session.user)
	#user.full_name = user.get_fullname()
	user.first_name = user.first_name
	user.last_name = user.last_name
	context.user = user
	context.show_sidebar=True

@frappe.whitelist()
def update_user(first_name, last_name, phone=None):
	error_msg = ""
	if not first_name:
		error_msg = _("Name is required")

	if not last_name:
		error_msg = _("Last name is required")

	user = frappe.get_doc('User', frappe.session.user)
	user.first_name = first_name
	user.last_name = last_name
	user.full_name = get_fullname(first_name, last_name)
	user.phone = phone
	user.save(ignore_permissions=True)

	frappe.local.cookie_manager.set_cookie("full_name", user.full_name)

	if error_msg == "":
		return {"exc": False, "response": _("Sus datos han sido actualizados")}
	else:
		return {"exc": True, "response": error_msg }

