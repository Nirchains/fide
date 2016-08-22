# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"module_name": "Fidetia",
			"color": "#599CE1",
			"icon": "octicon octicon-file-directory",
			"type": "module",
			"label": _("Fidetia")
		},
		{
			"module_name": "Noticias",
			"color": "#3498db",
			"icon": "octicon octicon-repo",
			"type": "module",
			"label": _("Noticias")
		},
		{
			"module_name": "Mantenimiento",
			"color": "#3498db",
			"icon": "octicon octicon-repo",
			"type": "module",
			"label": _("Mantenimiento")
		},
		{
			"module_name": "Equipos de trabajo",
			"color": "#3498db",
			"icon": "octicon octicon-repo",
			"type": "module",
			"label": _("Equipos de trabajo")
		},
		{
			"module_name": "RRHH",
			"color": "#3498db",
			"icon": "octicon octicon-repo",
			"type": "module",
			"label": _("Recursos Humanos")
		}
	]
