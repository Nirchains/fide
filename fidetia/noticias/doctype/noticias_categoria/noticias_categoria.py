# -*- coding: utf-8 -*-
# Copyright (c) 2015, Pedro Antonio Fernández Gómez and contributors
# For license information, please see license.txt

from __future__ import unicode_literals

from frappe.website.website_generator import WebsiteGenerator
from frappe.website.render import clear_cache

class NoticiasCategoria(WebsiteGenerator):
	def autoname(self):
		# to override autoname of WebsiteGenerator
		self.name = self.title
		self.route = self.scrub(self.title)

	def on_update(self):
		WebsiteGenerator.on_update(self)
		clear_cache()

	def validate(self):
		self.parent_website_route = "noticias"
		super(NoticiasCategoria, self).validate()