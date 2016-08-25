frappe.ui.form.ControlPercent = frappe.ui.form.ControlFloat.extend({
	validate: function(value, callback) {
		if (value > 100) {
			msgprint (__("El valor del porcentaje no puede ser mayor de 100"));
			callback("");
			return;
		}
		return callback(value);
	}
});