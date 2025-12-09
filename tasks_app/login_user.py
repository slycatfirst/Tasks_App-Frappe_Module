import frappe
from frappe.auth import LoginManager
from frappe.utils.password import update_password

@frappe.whitelist(allow_guest=True)
def login():
    # Отключаем CSRF для гостевого входа
    frappe.local.flags.ignore_csrf = True
    
    data = frappe.local.request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email:
        return {"status": "error", "message": "Введите email"}
    if not password:
        return {"status": "error", "message": "Введите пароль"}

    # Создаём пользователя если не существует
    if not frappe.db.exists("User", email):
        doc = frappe.get_doc({
            "doctype": "User",
            "email": email,
            "enabled": 1,
            "first_name": email,
            "roles": [{"role": "Website User"}]
        })
        doc.insert(ignore_permissions=True)
        update_password(user=email, pwd=password)

    # Логиним
    login_manager = LoginManager()
    try:
        login_manager.authenticate(user=email, pwd=password)
        login_manager.post_login()
        return {"status": "ok", "user": email}
    except frappe.AuthenticationError:
        return {"status": "error", "message": "Неверный логин или пароль"}
