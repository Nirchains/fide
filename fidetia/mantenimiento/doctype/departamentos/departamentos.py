# -*- coding: utf-8 -*-
# Copyright (c) 2015, PFG and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.website.website_generator import WebsiteGenerator
from frappe.website.utils import cleanup_page_name

class Departamentos(Document):
	def validate(self):
		self.name = cleanup_page_name(self.title).replace('_', '-')
