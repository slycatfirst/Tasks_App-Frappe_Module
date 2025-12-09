frappe.views.calendar["TaskCustom"] = {
    field_map: {
        start: 'date_start',
        end: 'date_end',
        id: 'name',
        title: 'title',
        allDay: 'allDay',
        progress: 'progress',
        depends_task: 'parent_task',
    },
    gantt: {
        field_map: {
            start: 'date_start',
            end: 'date_end',
            id: 'name',
            title: 'title',
            allDay: 'allDay',
            progress: 'progress',
            depends_task: 'parent_task',
	    },
        order_by: 'date_start'
    },
    filters: [],
};
