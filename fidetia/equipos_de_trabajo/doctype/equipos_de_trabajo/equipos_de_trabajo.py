# -*- coding: utf-8 -*-
# Copyright (c) 2015, Pedro Antonio Fernández Gómez and contributors
# For license information, please see license.txt

from __future__ import unicode_literals

import frappe
from frappe import _
from frappe.website.website_generator import WebsiteGenerator
from frappe.website.render import clear_cache
from frappe.utils import today, cint, strip_html_tags

class EquiposdeTrabajo(WebsiteGenerator):
	save_versions = True
	website = frappe._dict(
		source = "templates/generators/equipo.html",
		condition_field = "published",
		order_by = "title asc",
		page_title_field = "title"
	)

	def validate(self):
		super(EquiposdeTrabajo, self).validate()
		self.route = self.generate_alias_and_route()

	def generate_alias_and_route(self):
		if not self.alias:
			self.alias = self.scrub(self.title)
		return 'areas-i-d-i/' + self.scrub(self.alias)
	
	def on_update(self):
		WebsiteGenerator.on_update(self)
		#clear_cache("writers")
		clear_cache()
		
	def get_context(self, context):
		# this is for double precaution. usually it wont reach this code if not published
		if not cint(self.published):
			raise Exception, "No se  ha publicado aún"
		
		context.metatags = {
			"name": self.title,
			"description": self.title,
		}
	
		context.lines_filtered = [elem for elem in context.lines if elem.visible == 1]
		context.attachements_filtered = [elem for elem in context.attachements if elem.visible == 1]
	
		context.parents = [
			{"title": "Áreas I+D+I", "name": "areas-i-d-i"}
		]
	
def get_list_context(context):
	list_context = frappe._dict(
		header = "<h1>" + _("Áreas I+D+I") + "</h1>",
		page_title = _("Áreas I+D+I"),
		source = "templates/includes/equipos/equipos.html",
		row_template = "templates/includes/equipos/equipos_row.html",
		get_list = get_team_list,
		parents = [],
		show_breadcrumbs = True
	)

	return list_context

def get_team_list(doctype, txt=None, filters=None, limit_start=0, limit_page_length=20):
	conditions = []
	
	query = """\
		select
			t1.title, t1.name, route
		from `tabEquipos de Trabajo` t1
		where ifnull(t1.published,0)=1
		%(condition)s
		order by title asc, name asc
		limit %(start)s, %(page_len)s""" % {
			"start": limit_start, "page_len": limit_page_length,
				"condition": (" and " + " and ".join(conditions)) if conditions else ""
		}

	teams = frappe.db.sql(query, as_dict=1)

	return teams