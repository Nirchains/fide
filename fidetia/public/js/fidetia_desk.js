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

_f.Frm.prototype.setup = function() {

	var me = this;
	this.fields = [];
	this.fields_dict = {};
	this.state_fieldname = frappe.workflow.get_state_fieldname(this.doctype);

	// wrapper
	this.wrapper = this.parent;
	var singlecolumn = this.meta.hide_toolbar;
	if (frappe.boot.user.user_type=="Website User") {
		singlecolumn = 1;
	}
	frappe.ui.make_app_page({
		parent: this.wrapper,
		single_column: singlecolumn
	});
	this.page = this.wrapper.page;
	this.layout_main = this.page.main.get(0);

	this.toolbar = new frappe.ui.form.Toolbar({
		frm: this,
		page: this.page
	});

	// print layout
	this.setup_print_layout();

	// 2 column layout
	this.setup_std_layout();

	// client script must be called after "setup" - there are no fields_dict attached to the frm otherwise
	this.script_manager = new frappe.ui.form.ScriptManager({
		frm: this
	});
	this.script_manager.setup();
	this.watch_model_updates();

	if(!this.meta.hide_toolbar) {
		this.footer = new frappe.ui.form.Footer({
			frm: this,
			parent: $('<div>').appendTo(this.page.main.parent())
		})
		$("body").attr("data-sidebar", 1);	
	}
	this.setup_drag_drop();

	this.setup_done = true;
}

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

