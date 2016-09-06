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

frappe.ui.Page = frappe.ui.Page.extend({
	add_sidebar_label: function(label, insert_after, prepend) {
		var parent = this.sidebar.find(".sidebar-menu.standard-actions");
		var li = $('<li>');
		var link = $('<h4>').html(label).appendTo(li);

		if(insert_after) {
			li.insertAfter(parent.find(insert_after));
		} else {
			if(prepend) {
				li.prependTo(parent);
			} else {
				li.appendTo(parent);
			}
		}
		return link;
	}
});

