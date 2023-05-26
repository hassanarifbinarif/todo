import json
import os
import requests
import base64
from django.conf import settings as django_settings


# Helper methods for project
def requestAPI(method:str, url:str, headers:dict, data:dict):
    status = 400
    try:
        response = requests.request(method, url, headers=headers, data=data, verify=False)
        return response.status_code, response.json()
    except Exception as e:
        return status, str(e)


def check_user_login(request):
    user_access_token = request.COOKIES.get('user_access_token')
    headers = {"Authorization": f"Bearer {user_access_token}"}
    status, response = requestAPI('GET', f'{django_settings.API_URL}/me', headers, {})
    # print(status, response)
    return status, response


def confirm_user_email(data_dict):
    status, response = requestAPI('PATCH', f'{django_settings.API_URL}/users/confirm', {}, data_dict)
    return status, response


def get_dict_from_token(token):
    data = base64.urlsafe_b64decode(token.encode("utf-8")).decode("utf-8")
    data = data.replace("'", "\"")
    data_dict =json.loads(data)
    return data_dict