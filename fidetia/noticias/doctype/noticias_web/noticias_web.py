# -*- coding: utf-8 -*-
# Copyright (c) 2015, Pedro Antonio Fernández Gómez and contributors
# For license information, please see license.txt

from __future__ import unicode_literals

import frappe
from frappe import _
from frappe.website.website_generator import WebsiteGenerator
from frappe.website.render import clear_cache
from frappe.utils import today, cint, global_date_format, strip_html_tags, markdown
from frappe.website.utils import find_first_image
from fidetia.noticias.utils import get_categories, get_news_list, get_category
from fidetia.cms.module import Module
from fidetia.cms.utils import load_module_positions, update_positions_size

class NoticiasWeb(WebsiteGenerator):
	save_versions = True
	website = frappe._dict(
		template = "templates/generators/noticia.html",
		condition_field = "published",
		order_by = "published_on desc",
		page_title_field = "title"
	)

	def validate(self):
		super(NoticiasWeb, self).validate()

		if not self.intro :
			self.intro = self.content[:600]
			self.intro = strip_html_tags(self.intro)

		#if self.intro and len(self.intro) > 600:
		#	self.intro = self.intro[:600] + "..."

		if self.published and not self.published_on:
			self.published_on = today()

		self.route = self.generate_alias_and_route()

	def generate_alias_and_route(self):
		if not self.alias:
			self.alias = self.scrub(self.title)
		return 'noticias/' + self.scrub(self.category) + '/' + self.scrub(self.alias)
	
	def on_update(self):
		WebsiteGenerator.on_update(self)
		#clear_cache("writers")
		clear_cache()
		
	def get_context(self, context):
		# this is for double precaution. usually it wont reach this code if not published
		if not cint(self.published):
			raise Exception, "La noticia no se  ha publicado aún"
		
		# temp fields
		context.header = "<h1><a href='/noticias'>" + _("Noticias") + "</a></h1>"
		context.updated = global_date_format(self.published_on)
	
		context.description = self.intro or self.content[:140]
	
		context.metatags = {
			"name": self.title,
			"description": context.description,
		}
	
		if "<!-- markdown -->" in context.content:
			context.content = markdown(context.content)
	
		image = find_first_image(self.content)
		if image:
			context.metatags["image"] = image
	
		context.children = get_categories()
		
		context.attachements_filtered = [elem for elem in context.attachements if elem.visible == 1]
	
		context.objcategory = frappe.db.get_value("Noticias Categoria", context.doc.category, ["title", "route"], as_dict=1)
		context.parents = [
						{"title": "Noticias", "name": "noticias"}, 
						{"title": context.objcategory.title, "name": "noticias/{0}".format(context.objcategory.route)}
		]
		
		page_modules = []
		include = "templates/includes/noticias/categorias.html"
		module = Module("Include", "Left", 0, "", include, "") 
		page_modules.append(module)
		context.module_positions = load_module_positions(page_modules)
		context.positions_size = update_positions_size(context.module_positions, 3, 0)
	
def get_list_context(context=None):
	list_context = frappe._dict(
		source = "templates/includes/noticias/noticias.html",
		row_template = "templates/includes/noticias/noticias_row.html",
		get_list = get_news_list,
		hide_filters = True,
		parents = [],
		show_breadcrumbs = True,
		children = get_categories(),
		page_title = _("Noticias"),
		header = "<h1>" + _("Noticias") + "</h1>"
	)

	if frappe.local.form_dict.category:
		list_context.categoryTitle = get_category(frappe.local.form_dict.category)
		list_context.page_title = list_context.categoryTitle
		list_context.header = "<h1><a href='/noticias'>" + _("Noticias") + "</a></h1>"
		list_context.parents.append({"title": _("Noticias"), "name": "noticias"})

	page_modules = []
	include = "templates/includes/noticias/categorias.html"
	module = Module("Include", "Left", 0, "", include, "") 
	page_modules.append(module)
	list_context.module_positions = load_module_positions(page_modules)
	list_context.positions_size = update_positions_size(list_context.module_positions, 3, 0)
	
	return list_context