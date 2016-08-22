frappe.listview_settings['Noticias Web'] = {
	onload: function(listview) {
		frappe.route_options = {
			"published": "Yes"
		};
	},
	refresh: function(me) {
		// Set published status
		me.page.add_sidebar_item(__("No publicado"), function() {
			var publish_filter = me.filter_list.get_filter("published");
			publish_filter && publish_filter.remove(true);

			me.filter_list.add_filter(me.doctype, "published", '=', "No");
			me.run();
		}, ".assigned-to-me");
	}
}