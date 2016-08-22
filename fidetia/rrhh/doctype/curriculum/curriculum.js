// Copyright (c) 2016, PFG and contributors
// For license information, please see license.txt

frappe.provide("fidetia.rrhh");

frappe.ui.form.on('Curriculum', {
	refresh: function(frm) {
		
	}
});

fidetia.rrhh.Curriculum = frappe.ui.form.Controller.extend({
	onload: function() {
	},
	professional_experience_on_form_rendered: function (doc, grid_row) {
	},
	set_time_in_job: function() {
		
	}
});
cur_frm.script_manager.make(fidetia.rrhh.Curriculum);

frappe.ui.form.on('Curriculum Experiencia Profesional', {
	form_render: function (frm, cdt, cdn) {
		cur_frm.cscript.set_time_in_job(frm, cdt, cdn);
	},
	date_init: function(frm, cdt, cdn) {
		cur_frm.cscript.set_time_in_job(frm, cdt, cdn);
	},
	date_finish: function(frm, cdt, cdn) {
		cur_frm.cscript.set_time_in_job(frm, cdt, cdn);
	},
	in_progress: function(frm, cdt, cdn) {
		cur_frm.cscript.set_time_in_job(frm, cdt, cdn);
	}
});

cur_frm.cscript.set_time_in_job = function(frm, cdt, cdn) {
	//var d = locals[cdt][cdn];
	var d = frappe.get_doc(cdt, cdn);

	var df = frappe.meta.get_docfield("Curriculum Experiencia Profesional", "date_finish", frm.doc.name);
	if (d.in_progress == 1) {
		d.date_finish = undefined;
		df.reqd = false;
	} else {
		var df = frappe.meta.get_docfield("Curriculum Experiencia Profesional", "date_finish", frm.doc.name);
		df.reqd = true;
	}
	cur_frm.refresh_fields();

	frappe.call({
		type: "GET",
		method: "fidetia.rrhh.doctype.curriculum.curriculum.date_diference",
		args: {
			"date_init": d.date_init,
			"date_finish": d.date_finish,
			"in_progress": d.in_progress
		},
		callback: function(r) {
			if (!r.message.exc) {
				d.time_in_job = r.message.response;
				refresh_field("time_in_job", cdn, "professional_experience");
			} else {
				$('[data-fieldname="' + r.message.data_has_error + '"]').addClass("has-error");
			}
		}
	});
}

frappe.ui.form.on('Curriculum formacion reglada', {
	form_render: function (frm, cdt, cdn) {
		cur_frm.cscript.check_course_province(frm, cdt, cdn);
	},
	title: function(frm, cdt, cdn) {
		cur_frm.cscript.check_course_province(frm, cdt, cdn);
	}
});

cur_frm.cscript.check_course_province = function(frm, cdt, cdn) {
	var d = frappe.get_doc(cdt, cdn);
	if (d.title !== null && d.title !== undefined) {
		var tit = frappe.get_doc("Titulaciones", d.title);
		alert(tit);
		frappe.db.get_value("Titulaciones", d.title, 'universitaria', cur_frm.cscript.toggle_course_province);

	}
}

cur_frm.cscript.toggle_course_province = function (msg) {
	var df = frappe.meta.get_docfield("Curriculum Experiencia Profesional", "province_studies", me.frm.doc.name);
	if (msg.universitaria === null && msg.universitaria === undefined && msg.universitaria === "0") {
		df.hidden = true;
	} else {
		df.hidden = false;
	}
	cur_frm.refresh_fields();
}