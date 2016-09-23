# -*- coding: utf-8 -*-
# Copyright (c) 2015, PFG and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
from fidetia.utils.utils import dni_valid

STANDARD_USERS = ("Guest", "Administrator")

class Curriculum(Document):

	def onload(self):
		if not has_rrhh_permission():
			user = frappe.db.get_value("User", frappe.session.user, ["email", "first_name", "last_name"], as_dict=True)
			self.first_name = user.first_name or self.first_name
			self.last_name = user.last_name or self.last_name
			self.email = user.email or self.email
	
	def autoname(self):
		"""set name as email id"""
		user = frappe.session.user
		
		if not self.email:
			self.email = user.name

		if self.name not in STANDARD_USERS:
			self.email = self.email.strip()
			self.name = self.email
			
	def validate(self):
		if self.email:
			self.owner = self.email

		if self.tdoc == "NIF" or self.tdoc == "NIF Extranjero":
			if not dni_valid(self.ndoc):
				frappe.throw("El número de documento de indentidad introducido no es válido. Recuerde utilizar el formato 12345678X para DNI y X12345678Y para NIE.")

		if not self.data_protection:
			frappe.throw("Debe aceptar la política de protección de datos")

	#TODOPFG para no duplicar curriculum
	def validate_duplicate_user(self):
		employee = frappe.db.sql_list("""select name from `tabCurriculum` where
			user_id=%s and status='Active' and name!=%s""", (self.user_id, self.name))
		if employee:
			throw(_("User {0} is already assigned to Employee {1}").format(
				self.user_id, employee[0]), frappe.DuplicateEntryError)

@frappe.whitelist()
def has_rrhh_permission():
	return ('RRHH' in frappe.get_roles())

@frappe.whitelist()
def date_diference(date_init=None, date_finish=None, in_progress=None):
	from datetime import datetime

	diference = ""
	err_msg = ""
	data_has_error = ""
	formato = "%Y-%m-%d"

	if (date_init and int(in_progress or 0) == 0): #Solo se ha rellenado la fecha de inicio
		date_i = datetime.strptime(str(date_init), formato)
		if date_i > datetime.now():
			err_msg = "La fecha de inicio no puede ser superior a la fecha actual"
			data_has_error = "date_init"

	if (date_init and date_finish) or (date_init and int(in_progress or 0) == 1): #Se han rellenado todos los datos necesarios
		date_i = datetime.strptime(str(date_init), formato)
		if date_finish:
			date_f = datetime.strptime(str(date_finish), formato)
		else:
			date_f = datetime.now()

		seconds = (date_f - date_i).total_seconds()
		days = (date_f - date_i).days

		if date_i > datetime.now():
			err_msg = "La fecha de inicio no puede ser superior a la fecha actual"
			data_has_error = "date_init"
		elif date_f > datetime.now():
			err_msg = "La fecha de fin no puede ser superior a la fecha actual"
			data_has_error = "date_finish"
		elif days < 0:
			err_msg = "La fecha de fin no puede ser inferior a la fecha de inicio"
			data_has_error = "date_finish"

		if days < 7:
			diference = (_("{0} día").format(days))
			if days != 1:
				diference = diference + "s"
		elif days < 31:
			diference = (_("{0} semana").format(days // 7))
			if days // 7 != 1:
				diference = diference + "s"
		elif days < 365:
			mdiference = month_diference(date_i, date_f)
			diference = (_("{0} mes").format(mdiference))
			if mdiference > 1:
				diference = diference + "es"
		else:
			diference = year_diference(date_i, date_f)
	
	if err_msg != "":
		frappe.msgprint(err_msg)
		return {"exc": True, "response": "", "error": err_msg, "data_has_error": data_has_error}
	else:
		return {"exc": False, "response": diference}

def update_date_diferences():
	doctype = "Curriculum Experiencia Profesional"
	#TODOPFG: Actualizar consulta con estado
	exp_prof_db = frappe.db.sql((""" select date_init, date_finish, in_progress
		from `tab{0}` where in_progress=1 
		""").format(doctype), as_dict=True)
	for item in exp_prof_db:
		date_dif = date_diference(item.date_init, item.date_finish, item.in_progress)
		if not date_dif["exc"]:
			frappe.db.sql((""" update
				`tab{0}`
				set `time_in_job`='{1}' 
				""").format(doctype, date_dif["response"]))

def month_diference(d1, d2):
	from calendar import monthrange
	from datetime import timedelta
	delta = 0
	while True:
		mdays = monthrange(d1.year, d1.month)[1]
		d1 += timedelta(days=mdays)
		if d1 <= d2:
			delta += 1
		else:
			break
	return delta

def year_diference(d1, d2):
    months_totals = month_diference(d1, d2)
    years = months_totals // 12
    months = months_totals % 12
    if years != 1:
    	ret_years = (_("{0} años").format(years))
    else:
    	ret_years = (_("{0} año").format(years))
    if months == 1:
    	ret_months = (_(" y {0} mes").format(months))
    elif months > 1:
    	ret_months = (_(" y {0} meses").format(months))
    else:
    	ret_months = ""
    return ret_years + ret_months