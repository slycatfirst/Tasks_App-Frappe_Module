# Copyright (c) 2025, n and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

def get_permission_query_conditions(user):
    if not user or user == "Administrator":
        return ""

    # пример: пользователь видит ТОЛЬКО записи, где поле owner == user
    return f"`tabTask Custom`.owner = '{user}'"

class TaskCustom(Document):
	pass
