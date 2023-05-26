import math
from django import template
from datetime import datetime

register = template.Library()


def convert_to_date(value):
    if not value:
        return ''
    try:
        date_obj = datetime.strptime(value, '%Y-%m-%dT%H:%M:%S.%fZ')
    except Exception as e:
        return value
    formatted_date = date_obj.strftime('%d/%m/%Y')
    return formatted_date


def get_page_numbers(value):
    if not value:
        return ''
    try:
        if value['count'] == 0:
            starting_record, ending_record, total_records = 0 
        else:
            starting_record = (value['currentPage'] - 1) * value['perPage'] + 1
            ending_record = value['currentPage'] * value['perPage']
            if ending_record > value['count']:
                ending_record = value['count']
            total_records = value['count']
            return f'{starting_record}-{ending_record} of {total_records}'
    except Exception as e:
        return value
    return value


register.filter("custom_date", convert_to_date)
register.filter("page_number", get_page_numbers)