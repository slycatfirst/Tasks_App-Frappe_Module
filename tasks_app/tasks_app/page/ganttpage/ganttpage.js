frappe.pages['ganttpage'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Диаграмма Ганта',
        single_column: true
    });

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "http://tasks_mng.localhost:8000/assets/tasks_app/js/node_modules/frappe-gantt/src/styles/gantt.css";
    document.head.appendChild(link);

    const ganttPage = document.getElementById("page-ganttpage");
    const ganttDiv = document.createElement("div"); 

    frappe.require(["http://tasks_mng.localhost:8000/assets/tasks_app/js/node_modules/frappe-gantt/dist/frappe-gantt.umd.js"], () => { 
        load_gantt(); 
    }); 

    function load_gantt() { 
        frappe.db.get_list("Task", { 
            fields: ["name", "title", "user", "status", "creation", "date_close", "parent_task"], 
            limit: 500 
        }).then(result => { 
            console.log(result); 
            const tasks = result.map(task => {
                let percent = 0;
                if (task.status === "В работе") percent = 50;
                if (task.status === "Выполнена") percent = 100;
                if (task.status === "Отклонена") percent = 0;
                
                let dependencies = "";
                if (task.parent_task) dependencies = task.parent_task;

                return {
                    id: task.name, 
                    name: task.title, 
                    progress: percent,
                    start: task.creation, 
                    end: task.date_close,
                    dependencies: dependencies
                }
            }); 
            init_gantt(tasks);
        }); 
    } 

    function init_gantt(tasks) { 
        tasks.reverse();

        const gantt = new Gantt(ganttDiv, tasks, {
            view_mode: "Week",
            column_width: 100,
            infinite_padding: false,
            view_mode_select: true,
            language: "ru",
            scroll_to: "start",
            arrow_curve: 10,
            date_format: "YYYY-MM-DD",
            custom_popup_html: function(task) {
                return `<div">
                            <h5>${task.name}</h5>
                            <p>Start: ${task.start}</p>
                            <p>End: ${task.end}</p>
                            <p>Progress: ${task.progress}%</p>
                        </div>`;
            },
            // 🔹 Обработчик перемещения задачи
            on_date_change: function(task, start, end) {
                save_task_debounced(task, start, end);
            }
        });

        ganttDiv.style.width = "1260px";
        ganttDiv.style.margin = "0 auto";
        ganttDiv.classList = "border";
        ganttPage.appendChild(ganttDiv);
    }
	function clean_date(date_str) {
		if (!date_str) return null;

		// Если объект Date → преобразуем в YYYY-MM-DD
		if (date_str instanceof Date) {
			return date_str.toISOString().split("T")[0];
		}

		// Если строка → нормализуем
		if (typeof date_str === "string") {
			return date_str.split("T")[0];
		}

		// На случай неожиданных форматов
		try {
			return new Date(date_str).toISOString().split("T")[0];
		} catch (e) {
			console.error("Не удалось преобразовать дату:", date_str);
			return null;
		}
	}
	let save_timer = null;

function save_task_debounced(task, start, end) {
    clearTimeout(save_timer);

    save_timer = setTimeout(() => {
 		frappe.db.set_value("tasks", task.id, {
			creation: clean_date(start),
			date_close: clean_date(end)
		}).then(() => {
			frappe.show_alert({message:`Задача ${task.name} обновлена`, indicator:'green'});
		});
    }, 400);
}

}
