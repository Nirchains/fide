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
