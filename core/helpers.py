import json
import requests
import base64


# Helper methods for project

def requestAPI(method:str, url:str, headers:dict, data:dict):
    status = 400
    try:
        response = requests.request(method, url, headers=headers, data=data)
        return response.status_code, response.json()
    except Exception as e:
        return status, str(e)


def check_user_login(request):
    user_access_token = request.COOKIES.get('user_access_token')
    headers = {"Authorization": f"Bearer {user_access_token}"}
    status, response = requestAPI('GET', 'http://3.140.78.251:8000/api/me', headers, {})
    return status, response


def confirm_user_email(data_dict):
    status, response = requestAPI('PATCH', 'http://3.140.78.251:8000/api/users/confirm', {}, data_dict)
    return status, response


def get_dict_from_token(token):
    data = base64.urlsafe_b64decode(token.encode("utf-8")).decode("utf-8")
    data = data.replace("'", "\"")
    data_dict =json.loads(data)
    return data_dict