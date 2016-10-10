# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

from __future__ import unicode_literals
import frappe
from frappe import throw, msgprint, _

@frappe.whitelist(allow_guest=True)
def sign_up_extended(email, first_name, last_name):
	user = frappe.db.get("User", {"email": email})
	if user:
		if user.disabled:
			return _("Registered but disabled.")
		else:
			return _("Already Registered")
	else:
		if frappe.db.sql("""select count(*) from tabUser where
			HOUR(TIMEDIFF(CURRENT_TIMESTAMP, TIMESTAMP(modified)))=1""")[0][0] > 200:
			frappe.msgprint("Login is closed for sometime, please check back again in an hour.")
			raise Exception, "Too Many New Users"
		from frappe.utils import random_string
		user = frappe.get_doc({
			"doctype":"User",
			"email": email,
			"first_name": first_name,
			"last_name": last_name,
			"full_name": get_fullname(first_name, last_name),
			"enabled": 1,
			"new_password": random_string(10),
			"user_type": "Website User"
		})
		user.flags.ignore_permissions = True
		user.insert()
		return _("Registration Details Emailed.")

@frappe.whitelist(allow_guest=True)
def test_password_strength(new_password, key=None, old_password=None):
	from fidetia.utils.password_strength import password_check
	from frappe.core.doctype.user.user import _get_user_for_update_password

	res = _get_user_for_update_password(key, old_password)
	if not res:
		return
	elif res.get('message'):
		return res['message']
	else:
		user = res['user']

	user_data = frappe.db.get_value('User', user, ['first_name', 'middle_name', 'last_name', 'email', 'birth_date'])

	if new_password:
		return password_check(new_password, user_inputs=user_data)

@frappe.whitelist(allow_guest=True)
def update_password(new_password, key=None, old_password=None):
	from frappe.core.doctype.user.user import _get_user_for_update_password
	from frappe.utils.password import update_password as _update_password
	
	pstrength = test_password_strength(new_password, key, old_password)

	if pstrength['exc'] == False:
		res = _get_user_for_update_password(key, old_password)
		if res.get('message'):
			return res['message']
		else:
			user = res['user']

		_update_password(user, new_password)

		user_doc, redirect_url = reset_user_data(user)

		frappe.local.login_manager.login_as(user)

		if user_doc.user_type == "System User":
			return "/desk"
		else:
			return redirect_url if redirect_url else "/"
	else:
		return pstrength['response']

def get_fullname(first_name, last_name):
	"""get first_name space last_name"""
	return (first_name or '') + \
		(first_name and " " or '') + (last_name or '')

def reset_user_data(user):
	user_doc = frappe.get_doc("User", user)
	redirect_url = user_doc.redirect_url
	user_doc.reset_password_key = ''
	user_doc.redirect_url = ''
	user_doc.save(ignore_permissions=True)

	return user_doc, redirect_url