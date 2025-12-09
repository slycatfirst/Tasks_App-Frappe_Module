import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def create_task(title, username, project, dateClose, description):
    doc = frappe.get_doc({
        "doctype": "tasks",
        "title": title,
        "user": username,
        "project": project,
        "date_close": dateClose,
        "description": description
    })
    doc.insert(ignore_permissions=True)
    return {"status": "ok", "name": doc.name}