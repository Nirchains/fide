# -*- coding: utf-8 -*-
# Copyright (c) 2015, Pedro Antonio Fernández Gómez and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _

def get_categories():
    return frappe.db.sql("""select concat("/noticias/", route) as name,
        title,
        (select count(name) from `tabNoticias Web` where `tabNoticias Web`.category=`tabNoticias Categoria`.name and published=1) as contador
        from `tabNoticias Categoria`
        where published = 1
        and exists (select name from `tabNoticias Web`
            where `tabNoticias Web`.category=`tabNoticias Categoria`.name and published=1)
        order by `order` asc""", as_dict=1)
    
def get_latest_news(amount=10):
    return get_news_list("Noticias Web", None, None, 0, amount)

def get_category(route):
    return frappe.db.get_value("Noticias Categoria", {"route": route }) or route
    
def get_news_list(doctype, txt=None, filters=None, limit_start=0, limit_page_length=20):
    conditions = []
    if filters:
        if filters.category:
            conditions.append('t1.category="%s"' % frappe.db.escape(get_category(filters.category)))

    if txt:
        conditions.append('t1.content like "%{0}%"'.format(frappe.db.escape(txt)))

    if conditions:
        frappe.local.no_cache = 1

    query = """\
        select
            t1.title, t1.name, t1.category, t1.important,
                cat.route as category_route, 
                t1.route,
                t1.published_on as creation,t1.published_on,
                ifnull(t1.intro, t1.content) as content
        from `tabNoticias Web` t1
        left join `tabNoticias Categoria` cat on t1.category = cat.name
        where ifnull(t1.published,0)=1
        %(condition)s
        order by t1.important desc, t1.published_on desc, t1.creation desc
        limit %(start)s, %(page_len)s""" % {
            "start": limit_start, "page_len": limit_page_length,
                "condition": (" and " + " and ".join(conditions)) if conditions else ""
        }

    news = frappe.db.sql(query, as_dict=1)

    return news

def update_my_account_context(context):
    context["my_account_list"].extend([
        {"label": _("Curriculum"), "url": "orders"}
    ])