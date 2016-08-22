# -*- coding: utf-8 -*-
# Copyright (c) 2015, PFG and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

from frappe.utils import flt, getdate

from frappe.model.document import Document

class CurriculumExperienciaProfesional(Document):
	def validate(self):
		frappe.throw(_("End Date can not be less than Start Date"))
		self.validate_dates()

	def validate_dates(self):
		frappe.throw(_("End Date can not be less than Start Date"))