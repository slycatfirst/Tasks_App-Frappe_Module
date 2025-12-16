# Copyright (c) 2025, n and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

# def get_permission_query_conditions(user):
#     if not user or user == "Administrator":
#         return ""

#     # пример: пользователь видит ТОЛЬКО записи, где поле owner == user
#     return f"`tabTaskCustom`.owner = '{user}'"



class TaskCustom(Document):
    def validate(self):
        self.update_child_tasks()
        self.update_depends() 
    # Поиск всех родительских задач и вывод их в таблицу   
    def update_depends(self):
        task_list = [row.task for row in self.depends_on if row.task]
        self.depends_on_tasks = ",".join(task_list)  

    # Поиск всех дочерних задач и вывод их в таблицу
    def update_child_tasks(self):
        # найти все задачи, где В depends_on указана текущая
        children = frappe.get_all(
            "Tasks Depends Custom",
            filters={
                "task": self.name,
                "parenttype": "TaskCustom",
                "parentfield": "depends_on"
            },
            pluck="parent"
        )


        # очистить child table
        self.child_tasks = []

        for task_name in children:
            self.append("child_tasks", {
                "task": task_name
            })

    # def update_child_tasks(self):
    #     children = frappe.get_all(
    #         "Tasks Depends Custom",
    #         filters={
    #             "task": self.name,
    #             "parenttype": "TaskCustom",
    #             "parentfield": "depends_on"
    #         },
    #         pluck="parent"
    #     )

    #     self.child_tasks = []

    #     for task_name in children:
    #         self.append("child_tasks", {
    #             "task": task_name
    #         })

    
    # def update_parent_tasks(self):
    #     parents = frappe.get_all(
    #         "TaskCustom",

    #     )

def get_permission_query_conditions(user):
    if not user or user == "Administrator":
        return ""

    # пользователь = владелец
    conditions = [f"`tabTaskCustom`.owner = '{user}'"]

    # пользователь назначен
    conditions.append(
        f"`tabTaskCustom`.assigned_to = '{user}'"
    )

    return " OR ".join(conditions)
