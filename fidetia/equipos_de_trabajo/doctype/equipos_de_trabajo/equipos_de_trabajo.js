// Copyright (c) 2016, Pedro Antonio Fernández Gómez and contributors
// For license information, please see license.txt

frappe.ui.form.on('Equipos de Trabajo', {
	refresh: function(frm) {

	}
});

frappe.ui.form.on('Lista de Usuarios', {
	member: function(frm, cdt, cdn) {
		//Actualiza el nombre completo del usuario
		fidetia.curriculum.set_full_name_from_curriculum(frm, cdt, cdn, "member", "member_full_name");
	}
});