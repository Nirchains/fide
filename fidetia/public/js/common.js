fidetia = {};

fidetia.db = {
	get_value: function(doctype, filters, fieldname, callback) {
		frappe.call({
			method: "frappe.client.get_value",
			args: {
				doctype: doctype,
				fieldname: fieldname,
				filters: filters
			},
			callback: function(r, rt) {
				callback(r.message);
			}
		});
	}
}

fidetia.db = {
	get_value_frm: function(doctype, filters, fieldname, callback, frm, cdt, cdn) {
		frappe.call({
			method: "frappe.client.get_value",
			args: {
				doctype: doctype,
				fieldname: fieldname,
				filters: filters
			},
			callback: function(r, rt) {
				callback(r.message, frm, cdt, cdn);
			}
		});
	}
}

fidetia.curriculum = {
	set_full_name_from_curriculum: function (frm, cdt, cdn, docname, destin) {
		//Actualiza el nombre completo del usuario. Docname es el nombre del campo origen en el formulario, 
		//y destin el lugar donde colocará el nombre completo
		var d = frappe.get_doc(cdt, cdn);
		frappe.call({
			type: "GET",
			method: "frappe.client.get",
			args: {
				doctype: "Curriculum",
				name: d[docname]
			},
			callback: function(r) {
				if (!r.message.exc) {
					d[destin] = r.message.first_name + ' ' + r.message.last_name;
					refresh_field(destin, cdn, "members");
				} else {
					//error
				}
			}
		});
	}
}

fidetia.help = {
	IsNull: function (obj) {
        return (obj === null || obj === undefined || obj === 'undefined');
    },
    
    IsString: function (obj) {
        return typeof obj === 'string';
    },
    
    IsNumber: function (obj) {
        return typeof obj === 'number';
    },

    IsNullOrEmpty: function (obj) {
        return (this.IsNull(obj) || obj === {} || obj === '' || obj === 0 || obj === '0');
    },

    NumberIsNullOrZero: function (obj) {
        return (this.IsNull(obj) || obj === 0 || obj === '0');
    },

    StringIsNullOrEmpty: function (obj) {
        return (this.IsNull(obj) || obj === '');
    },

    ArrayIsNullOrEmpty: function (obj) {
        return (this.IsNull(obj) || obj.length === 0);
    },

    IsTrue: function (obj) {
        return (!this.IsNull(obj) && (obj === 'true' || obj === true || obj === 1));
    },

    IsFalse: function (obj) {
        return !this.IsTrue(obj);
    }
}