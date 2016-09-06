# -*- coding: utf-8 -*-
# Copyright (c) 2015, PFG and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document

STANDARD_USERS = ("Guest", "Administrator")

class Curriculum(Document):
	
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
			if not self.dni_valid(self.ndoc):
				frappe.throw("El número de documento de indentidad introducido no es válido. Recuerde utilizar el formato 12345678X para DNI y X12345678Y para NIE.")

	def dni_valid(self, dni):
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

@frappe.whitelist()
def date_diference(date_init=None, date_finish=None, in_progress=None):
	from datetime import datetime

	diference = ""

	if (date_init and date_finish) or (date_init and int(in_progress or 0) == 1):
		formato = "%Y-%m-%d"

		date_i = datetime.strptime(str(date_init), formato)
		if date_finish:
			date_f = datetime.strptime(str(date_finish), formato)
		else:
			date_f = datetime.now()

		seconds = (date_f - date_i).total_seconds()
		days = (date_f - date_i).days

		err_msg = ""
		data_has_error = ""
		if date_i > datetime.now():
			err_msg = "La fecha de inicio no puede ser superior a la fecha actual"
			data_has_error = "date_init"
		elif date_f > datetime.now():
			err_msg = "La fecha de fin no puede ser superior a la fecha actual"
			data_has_error = "date_finish"
		elif days < 0:
			err_msg = "La fecha de fin no puede ser inferior a la fecha de inicio"
			data_has_error = "date_finish"

		if err_msg != "":
			frappe.msgprint(err_msg)
			return {"exc": True, "response": "", "error": err_msg, "data_has_error": data_has_error}

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