frappe.views.calendar["TaskCustom"] = {
    field_map: {
        start: 'date_start',
        end: 'date_end',
        id: 'name',
        title: 'title',
        allDay: 'allDay',
        progress: 'progress',
        depends_task: 'depends_on',
    },
    gantt: {
        field_map: {
            start: 'date_start',
            end: 'date_end',
            id: 'name',
            title: 'title',
            allDay: 'allDay',
            progress: 'progress',
            depends_task: 'depends_on',
	    },
        order_by: 'date_start'
    },
    filters: [],
};
