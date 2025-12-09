// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.views.calendar["tasks"] = {
	fields: [
        "name",
        "title",
        "date_start",
        "date_end",
        "progress"
    ],
	field_map: {
		start: "date_start",
		end: "date_end",
		id: "name",
		title: "title",
		allDay: "allDay",
		progress: "progress"
	},
	gantt: true,
	filters: [
		{
		},
	],
	get_events_method: "frappe.desk.calendar.get_events",
};
