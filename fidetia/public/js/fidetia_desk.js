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

frappe.form.formatters.Link = function(value, docfield, options, doc) {
	var doctype = docfield._options || docfield.options;
	var original_value = value;
	if(value && value.match(/^['"].*['"]$/)) {
		value.replace(/^.(.*).$/, "$1");
	}

	if(options && options.for_print) {
		return value;
	}

	if(frappe.form.link_formatters[doctype]) {
		value = frappe.form.link_formatters[doctype](value, doc);
	}

	if(!value) {
		return "";
	}
	if(docfield && docfield.link_onclick) {
		return repl('<a onclick="%(onclick)s">%(value)s</a>',
			{onclick: docfield.link_onclick.replace(/"/g, '&quot;'), value:value});
	} else if(docfield && doctype) {
		return repl('<a class="grey" href="#Form/%(doctype)s/%(name)s" data-doctype="%(doctype)s" title="%(label)s">%(label)s</a>', {
			doctype: encodeURIComponent(doctype),
			name: encodeURIComponent(original_value),
			label: __(options && options.label || value)
		});
	} else {
		return value;
	}
}

frappe.form.link_formatters['Titulaciones'] = function(value, doc) {
	if(doc.nombre && doc.nombre !== value) {
		return value + ': ' + doc.nombre;
	} else {
		return value;
	}
}

