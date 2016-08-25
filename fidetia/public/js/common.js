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