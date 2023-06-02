from django.conf import settings as django_settings
from core.helpers import requestAPI


def check_admin_login(request):
    admin_access_token = request.COOKIES.get('admin_access')
    headers = {"Authorization": f"Bearer {admin_access_token}"}
    status, response = requestAPI('GET', f'{django_settings.API_URL}/admin/news', headers, {})
    return status, response