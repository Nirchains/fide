# -*- coding: utf-8 -*-
# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
import zxcvbn

def check_desktop_permission(doctype):
    if frappe.db.get_value("User", frappe.session.user, "user_type")=="Website User" and doctype != "Curriculum":
        raise frappe.PermissionError

def dni_valid(dni):
    tabla = "TRWAGMYFPDXBNJZSQVHLCKE"
    dig_ext = "XYZ"
    reemp_dig_ext = {'X':'0', 'Y':'1', 'Z':'2'}
    numeros = "1234567890"
    dni = dni.upper()
    if len(dni) == 9:
        dig_control = dni[8]
        dni = dni[:8]
        if dni[0] in dig_ext:
            dni = dni.replace(dni[0], reemp_dig_ext[dni[0]])
        return len(dni) == len([n for n in dni if n in numeros]) \
            and tabla[int(dni)%23] == dig_control
    return False

@frappe.whitelist(allow_guest=True)
def throw_permission_error():
    frappe.throw(_("You are not permitted to access this page."), frappe.PermissionError)