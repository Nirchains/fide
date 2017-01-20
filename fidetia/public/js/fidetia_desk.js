$(document).on("page_load_complete", function(event) {
	setPageDefault();
});

function setPageDefault() {
	if (frappe.boot.user.user_type=="System User") {
		$(".navbar-fixed-top").removeClass("hidden");
	} else {
		$(".navbar-fixed-top").remove();
		$(".menu-btn-group").hide();
		$(".page-container").css("margin-top", "0");
		$(".page-head").css("top", "0");
	}
}


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
	make: function() {
		this.wrapper = $(this.parent);

		$(frappe.render_template("page", {})).appendTo(this.wrapper);

		if(this.single_column) {
			// nesting under col-sm-12 for consistency
			this.add_view("main", '<div class="row layout-main">\
					<div class="col-md-12 layout-main-section-wrapper">\
						<div class="layout-main-section"></div>\
						<div class="layout-footer hide"></div>\
					</div>\
				</div>');
		} else {
			var main = this.add_view("main", '<div class="row layout-main">\
				<div class="col-md-2 layout-side-section"></div>\
				<div class="col-md-10 layout-main-section-wrapper">\
					<div class="layout-main-section"></div>\
					<div class="layout-footer hide"></div>\
				</div>\
			</div>');
			// this.wrapper.find('.page-title')
			// 	.removeClass('col-md-7').addClass('col-md-offset-2 col-md-5')
			// 	.css({'padding-left': '45px'});
		}

		this.$title_area = this.wrapper.find("h1");

		this.$sub_title_area = this.wrapper.find("h6");

		if(this.set_document_title!==undefined)
			this.set_document_title = this.set_document_title;

		if(this.title)
			this.set_title(this.title);

		if(this.icon)
			this.get_main_icon(this.icon);

		this.body = this.main = this.wrapper.find(".layout-main-section");
		this.sidebar = this.wrapper.find(".layout-side-section");
		this.footer = this.wrapper.find(".layout-footer");
		this.indicator = this.wrapper.find(".indicator");

		this.page_actions = this.wrapper.find(".page-actions");

		this.checked_items_status = this.page_actions.find(".checked-items-status");

		this.btn_primary = this.page_actions.find(".primary-action");
		this.btn_secondary = this.page_actions.find(".btn-secondary");

		this.menu = this.page_actions.find(".menu-btn-group .dropdown-menu");
		this.menu_btn_group = this.page_actions.find(".menu-btn-group");

		this.actions = this.page_actions.find(".actions-btn-group .dropdown-menu");
		this.actions_btn_group = this.page_actions.find(".actions-btn-group");

		this.page_form = $('<div class="page-form row hide"></div>').prependTo(this.main);
		this.inner_toolbar = $('<div class="form-inner-toolbar hide"></div>').prependTo(this.main);
		this.icon_group = this.page_actions.find(".page-icon-group");
		$(document).trigger("page_load_complete");
	},
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

frappe.ui.form.ControlLink = frappe.ui.form.ControlData.extend({
	make_input: function() {
		var me = this;
		$('<div class="link-field ui-front" style="position: relative;">\
			<input type="text" class="input-with-feedback form-control" autocomplete="off">\
			<span class="link-btn">\
				<a class="btn-open no-decoration" title="' + __("Open Link") + '">\
					<i class="octicon octicon-arrow-right"></i></a>\
			</span>\
		</div>').prependTo(this.input_area);
		this.$input_area = $(this.input_area);
		this.$input = this.$input_area.find('input');
		this.$link = this.$input_area.find('.link-btn');
		this.$link_open = this.$link.find('.btn-open');
		this.set_input_attributes();
		this.$input.on("focus", function() {
			setTimeout(function() {
				if(me.$input.val() && me.get_options()) {
					if (frappe.boot.user.user_type=="System User") {
						me.$link.toggle(true);
					}
					me.$link_open.attr('href', '#Form/' + me.get_options() + '/' + me.$input.val());
				}

				if(!me.$input.val()) {
					me.$input.autocomplete("search", "");
				}
			}, 500);
		});
		this.$input.on("blur", function() {
			// if this disappears immediately, the user's click
			// does not register, hence timeout
			setTimeout(function() {
				me.$link.toggle(false);
			}, 500);
		});
		this.input = this.$input.get(0);
		this.has_input = true;
<<<<<<< HEAD
		this.translate_values = true;
=======
>>>>>>> dbc4408da194cdf7ea2cbda957e073eadb7a3a7f
		var me = this;
		this.setup_buttons();
		this.setup_autocomplete();
		if(this.df.change) {
			this.$input.on("change", function() {
				me.df.change.apply(this);
			});
		}
	},
<<<<<<< HEAD
	get_options: function() {
		return this.df.options;
	},
=======
>>>>>>> dbc4408da194cdf7ea2cbda957e073eadb7a3a7f
	setup_buttons: function() {
		var me = this;

		if(this.only_input && !this.with_link_btn) {
			this.$input_area.find(".link-btn").remove();
		}
	},
<<<<<<< HEAD
	open_advanced_search: function() {
		var doctype = this.get_options();
		if(!doctype) return;
		new frappe.ui.form.LinkSelector({
			doctype: doctype,
			target: this,
			txt: this.get_value()
		});
		return false;
	},
	new_doc: function() {
		var doctype = this.get_options();
		var me = this;

		if(!doctype) return;

		// set values to fill in the new document
		if(this.df.get_route_options_for_new_doc) {
			frappe.route_options = this.df.get_route_options_for_new_doc(this);
		} else {
			frappe.route_options = {};
		}

		// partially entered name field
		frappe.route_options.name_field = this.get_value();

		// reference to calling link
		frappe._from_link = this;
		frappe._from_link_scrollY = $(document).scrollTop();

		frappe.ui.form.quick_entry(doctype, function(doc) {
			if(me.frm) {
				me.parse_validate_and_set_in_model(doc.name);
			} else {
				me.set_value(doc.name);
			}
		});

		return false;
=======
	get_options: function() {
		return this.df.options;
>>>>>>> dbc4408da194cdf7ea2cbda957e073eadb7a3a7f
	},
	setup_autocomplete: function() {
		var me = this;
		this.$input.on("blur", function() {
			if(me.selected) {
				me.selected = false;
				return;
			}
			var value = me.get_value();
			if(me.doctype && me.docname) {
				if(value!==me.last_value) {
					me.parse_validate_and_set_in_model(value);
				}
			} else {
				me.set_mandatory(value);
			}
		});

		this.$input.cache = {};
		this.$input.autocomplete({
			minLength: 0,
			autoFocus: true,
			source: function(request, response) {
				var doctype = me.get_options();
				if(!doctype) return;
				if (!me.$input.cache[doctype]) {
					me.$input.cache[doctype] = {};
				}

				if (me.$input.cache[doctype][request.term]!=null) {
					// immediately show from cache
					response(me.$input.cache[doctype][request.term]);
				}

				var args = {
					'txt': request.term,
					'doctype': doctype,
				};

				me.set_custom_query(args);

				return frappe.call({
					type: "GET",
					method:'frappe.desk.search.search_link',
					no_spinner: true,
					args: args,
					callback: function(r) {
						if(!me.$input.is(":focus")) {
							return;
						}

						if(!me.df.only_select) {
							if(frappe.model.can_create(doctype)
								&& me.df.fieldtype !== "Dynamic Link") {
								// new item
								r.results.push({
									value: "<span class='text-primary link-option'>"
										+ "<i class='icon-plus' style='margin-right: 5px;'></i> "
										+ __("Create a new {0}", [__(me.df.options)])
										+ "</span>",
									action: me.new_doc
								});
							};
							// advanced search
							r.results.push({
								value: "<span class='text-primary link-option'>"
									+ "<i class='icon-search' style='margin-right: 5px;'></i> "
									+ __("Advanced Search")
									+ "</span>",
								action: me.open_advanced_search
							});
						}

						me.$input.cache[doctype][request.term] = r.results;
						response(r.results);
					},
				});
			},
			open: function(event, ui) {
				me.$wrapper.css({"z-index": 101});
				me.autocomplete_open = true;
			},
			close: function(event, ui) {
				me.$wrapper.css({"z-index": 1});
				me.autocomplete_open = false;
			},
			focus: function( event, ui ) {
				event.preventDefault();
				if(ui.item.action) {
					return false;
				}
			},
			select: function(event, ui) {
				me.autocomplete_open = false;

				// prevent selection on tab
				var TABKEY = 9;
				if(event.keyCode === TABKEY) {
					event.preventDefault();
					me.$input.autocomplete("close");
					return false;
				}

				if(ui.item.action) {
					ui.item.value = "";
					ui.item.action.apply(me);
				}

<<<<<<< HEAD
				// if remember_last_selected is checked in the doctype against the field, 
				// then add this value
				// to defaults so you do not need to set it again
				// unless it is changed.
				if(me.df.remember_last_selected_value) {
=======
				// if remember_selected hook is set, add this value
				// to defaults so you do not need to set it again
				// unless it is changed.
				if(frappe.boot.remember_selected
						&& frappe.boot.remember_selected.indexOf(me.df.options)!==-1) {
>>>>>>> dbc4408da194cdf7ea2cbda957e073eadb7a3a7f
					frappe.boot.user.last_selected_values[me.df.options] = ui.item.value;
				}

				if(me.frm && me.frm.doc) {
					me.selected = true;
					me.parse_validate_and_set_in_model(ui.item.value);
					setTimeout(function() {
						me.selected = false;
					}, 100);
				} else {
					me.$input.val(ui.item.value);
					me.$input.trigger("change");
					me.set_mandatory(ui.item.value);
				}
			}
		})
		.on("blur", function() {
			$(this).autocomplete("close");
		})
		.data('ui-autocomplete')._renderItem = function(ul, d) {
<<<<<<< HEAD
			var _value = d.value;
			if(me.translate_values) {
				_value = __(d.value)
			}
			var html = "<strong>" + _value + "</strong>";
=======
			var html = "<strong>" + __(d.value) + "</strong>";
>>>>>>> dbc4408da194cdf7ea2cbda957e073eadb7a3a7f
			if(d.description && d.value!==d.description) {
				html += '<br><span class="small">' + __(d.description) + '</span>';
			}
			return $('<li></li>')
				.data('item.autocomplete', d)
				.html('<a><p>' + html + '</p></a>')
				.appendTo(ul);
		};
		// remove accessibility span (for now)
		this.$wrapper.find(".ui-helper-hidden-accessible").remove();
	},
	set_custom_query: function(args) {
		var set_nulls = function(obj) {
			$.each(obj, function(key, value) {
				if(value!==undefined) {
					obj[key] = value;
				}
			});
			return obj;
		}
		if(this.get_query || this.df.get_query) {
			var get_query = this.get_query || this.df.get_query;
			if($.isPlainObject(get_query)) {
<<<<<<< HEAD
				var filters = null;
				if(get_query.filters) {
					// passed as {'filters': {'key':'value'}}
					filters = get_query.filters;
				} else if(get_query.query) {

					// passed as {'query': 'path.to.method'}
					args.query = get_query;
				} else {

					// dict is filters
					filters = get_query;
				}

				if (filters) {
					var filters = set_nulls(filters);

					// extend args for custom functions
					$.extend(args, filters);

					// add "filters" for standard query (search.py)
					args.filters = filters;
				}
			} else if(typeof(get_query)==="string") {
				args.query = get_query;
			} else {
				// get_query by function
				var q = (get_query)(this.frm && this.frm.doc, this.doctype, this.docname);

				if (typeof(q)==="string") {
					// returns a string
					args.query = q;
				} else if($.isPlainObject(q)) {
					// returns a plain object with filters
					if(q.filters) {
						set_nulls(q.filters);
					}

					// turn off value translation
					if(q.translate_values !== undefined) {
						this.translate_values = q.translate_values;
					}

=======
				var filters = set_nulls(get_query);

				// extend args for custom functions
				$.extend(args, filters);

				// add "filters" for standard query (search.py)
				args.filters = filters;
			} else if(typeof(get_query)==="string") {
				args.query = get_query;
			} else {
				var q = (get_query)(this.frm && this.frm.doc, this.doctype, this.docname);

				if (typeof(q)==="string") {
					args.query = q;
				} else if($.isPlainObject(q)) {
					if(q.filters) {
						set_nulls(q.filters);
					}
>>>>>>> dbc4408da194cdf7ea2cbda957e073eadb7a3a7f
					// extend args for custom functions
					$.extend(args, q);

					// add "filters" for standard query (search.py)
					args.filters = q.filters;
				}
			}
		}
		if(this.df.filters) {
			set_nulls(this.df.filters);
			if(!args.filters) args.filters = {};
			$.extend(args.filters, this.df.filters);
		}
	},
	validate: function(value, callback) {
		// validate the value just entered
		var me = this;

		if(this.df.options=="[Select]") {
			callback(value);
			return;
		}

		if(this.frm) {
			this.frm.script_manager.validate_link_and_fetch(this.df, this.get_options(),
				this.docname, value, callback);
		}
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

	if(!this.meta.hide_toolbar && !frappe.boot.user.user_type=="Website User") {
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



frappe.upload.make = function(opts) {
	if(!opts.args) opts.args = {};
	var $upload = $(frappe.render_template("upload", {opts:opts})).appendTo(opts.parent);
	var $file_input = $upload.find(".input-upload-file");

	// bind pseudo browse button
	$upload.find(".btn-browse").on("click",
		function() { $file_input.click(); });

	$file_input.on("change", function() {
		if (this.files.length > 0) {
			$upload.find(".web-link-wrapper").addClass("hidden");
			$upload.find(".btn-browse").removeClass("btn-primary").addClass("btn-default");

			var $uploaded_file_display = $(repl('<div class="btn-group" role="group">\
				<button type="button" class="btn btn-default btn-sm \
					text-ellipsis uploaded-filename-display">%(filename)s\
				</button>\
				<button type="button" class="btn btn-default btn-sm uploaded-file-remove">\
					&times;</button>\
			</div>', {filename: this.files[0].name}))
			.appendTo($upload.find(".uploaded-filename").removeClass("hidden").empty());

			$uploaded_file_display.find(".uploaded-filename-display").on("click", function() {
				$file_input.click();
			});

			$uploaded_file_display.find(".uploaded-file-remove").on("click", function() {
				$file_input.val("");
				$file_input.trigger("change");
			});

			if(opts.on_select) {
				opts.on_select();
			}

			if ( !("is_private" in opts.options) ) {
				// show Private checkbox
				$upload.find(".private-file").removeClass("hidden");
			}

		} else {
			$upload.find(".uploaded-filename").addClass("hidden")
			$upload.find(".web-link-wrapper").removeClass("hidden");
			$upload.find(".private-file").addClass("hidden");
			$upload.find(".btn-browse").removeClass("btn-default").addClass("btn-primary");
		}
	});


	if(!opts.btn) {
		opts.btn = $('<button class="btn btn-default btn-sm">' + __("Attach")
			+ '</div>').appendTo($upload);
	} else {
		$(opts.btn).unbind("click");
	}

	// get the first file
	opts.btn.click(function() {
		// convert functions to values

		if(opts.get_params) {
			opts.args.params = opts.get_params();
		}

		opts.args.file_url = $upload.find('[name="file_url"]').val();
		opts.args.is_private = $upload.find('.private-file input').prop('checked') ? 1 : 0;

		var fileobj = $upload.find(":file").get(0).files[0];
		frappe.upload.upload_file(fileobj, opts.args, opts);
	});
};