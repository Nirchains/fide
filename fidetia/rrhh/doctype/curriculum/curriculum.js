// Copyright (c) 2016, PFG and contributors
// For license information, please see license.txt

frappe.provide("fidetia.rrhh");

frappe.ui.form.on('Curriculum', {
	refresh: function(frm) {
		cur_frm.cscript.curriculum.set_toggle(frm, 0)
		frappe.call({
			type: "GET",
			method: "fidetia.rrhh.doctype.curriculum.curriculum.has_rrhh_permission",
			args: {},
			callback: function(r) {
				if (r.message) {
					cur_frm.cscript.curriculum.set_toggle(frm, 1);
				}
			}
		});
	}
});

cur_frm.cscript.curriculum = {
	set_toggle: function(frm, value) {
		frm.toggle_enable("email", value);
		frm.toggle_enable("first_name", value);
		frm.toggle_enable("last_name", value);
	}
}

fidetia.rrhh.Curriculum = frappe.ui.form.Controller.extend({
	onload: function(frm) {
		
	},
	validate: function (frm) {
		
	},
	professional_experience_on_form_rendered: function (doc, grid_row) {
	},
	set_time_in_job: function() {
		
	},
	data_protection: function(frm) {
		if (!frm.data_protection) {
			var msg = {
				message: "Debe aceptar la política de protección de datos",
				title: "Mensaje de validación",
				indicator: "red"
			}
			frappe.msgprint(msg);
		}
	}
});
cur_frm.script_manager.make(fidetia.rrhh.Curriculum);


frappe.ui.form.on('Curriculum formacion reglada', {
	form_render: function (frm, cdt, cdn) {
		cur_frm.cscript.curriculum_formacion_reglada.check_course_province(frm, cdt, cdn);
	},
	title: function(frm, cdt, cdn) {
		cur_frm.cscript.curriculum_formacion_reglada.check_course_province(frm, cdt, cdn);
	},
	in_progress: function(frm, cdt, cdn) {
		cur_frm.cscript.curriculum_formacion_reglada.check_in_progress(frm, cdt, cdn);
	}
});

cur_frm.cscript.curriculum_formacion_reglada = {
	check_course_province: function(frm, cdt, cdn) {
		var d = frappe.get_doc(cdt, cdn);
		if (!fidetia.help.StringIsNullOrEmpty(d.title)) {
			var tit = frappe.get_doc("Titulaciones", d.title);
			fidetia.db.get_value_frm("Titulaciones", d.title, 'universitaria', this.toggle_course_province, frm, cdt, cdn);

		}
	},

	toggle_course_province: function (msg, frm, cdt, cdn) {
		var df = frappe.meta.get_docfield("Curriculum formacion reglada", "province_studies", frm.doc.name);
		if (fidetia.help.NumberIsNullOrZero(msg.universitaria)) {
			//Ciclo Formativo
			df.hidden = false;
			df.reqd = true;
		} else {
			//Universitaria
			df.hidden = true;
			df.reqd = false;
		}
		cur_frm.refresh_fields();
	},

	check_in_progress: function(frm, cdt, cdn) {
		var d = frappe.get_doc(cdt, cdn);
		var dyearf = frappe.meta.get_docfield("Curriculum formacion reglada", "year_finish", frm.doc.name);
		var dpercent = frappe.meta.get_docfield("Curriculum formacion reglada", "percent_complete", frm.doc.name);
		var dcourse = frappe.meta.get_docfield("Curriculum formacion reglada", "course", frm.doc.name);
		if (d.in_progress == 1) {
			dyearf.reqd = false;
			dpercent.reqd = true;
			dcourse.reqd = true;
		} else {
			dyearf.reqd = true;
			dpercent.reqd = false;
			dcourse.reqd = false;
		}
		cur_frm.refresh_fields();
	}
}


frappe.ui.form.on('Curriculum Experiencia Profesional', {
	form_render: function (frm, cdt, cdn) {
		cur_frm.cscript.curriculum_experiencia_profesional.set_time_in_job(frm, cdt, cdn);
	},
	date_init: function(frm, cdt, cdn) {
		cur_frm.cscript.curriculum_experiencia_profesional.set_time_in_job(frm, cdt, cdn);
	},
	date_finish: function(frm, cdt, cdn) {
		cur_frm.cscript.curriculum_experiencia_profesional.set_time_in_job(frm, cdt, cdn);
	}
});

cur_frm.cscript.curriculum_experiencia_profesional = {
	set_time_in_job: function(frm, cdt, cdn) {
		//var d = locals[cdt][cdn];
		var d = frappe.get_doc(cdt, cdn);

		var df = frappe.meta.get_docfield("Curriculum Experiencia Profesional", "date_finish", frm.doc.name);
		if (d.in_progress == 1) {
			d.date_finish = undefined;
			df.reqd = false;
		} else {
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
}