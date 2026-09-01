import json
import boto3
import uuid
from datetime import datetime, timezone

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('ruada-events')
registrations_table = dynamodb.Table('ruada-registrations')
cognito = boto3.client('cognito-idp', region_name='eu-west-1')

USER_POOL_ID = 'eu-west-1_yTLDLeVlw'

def get_all_users():
    users = []
    kwargs = {'UserPoolId': USER_POOL_ID}
    while True:
        resp = cognito.list_users(**kwargs)
        for u in resp['Users']:
            attrs = {a['Name']: a['Value'] for a in u['Attributes']}
            parent_id = attrs['sub']
            user_name = attrs.get('name') or u.get('Username') or attrs.get('email', '')
            users.append({'userId': parent_id, 'userName': user_name})
            for child in filter(None, [c.strip() for c in attrs.get('custom:children', '').split(',')]):
                users.append({'userId': f'child#{parent_id}#{child}', 'userName': child})
        if 'PaginationToken' not in resp:
            break
        kwargs['PaginationToken'] = resp['PaginationToken']
    return users

def handler(event, context):
    body = json.loads(event['body'])
    item = {
        'id': str(uuid.uuid4()),
        'title': body['title'],
        'date': body['date'],
        'startTime': body.get('startTime', ''),
        'endTime': body.get('endTime', ''),
        'color': body.get('color', 'indigo'),
        'location': body.get('location', ''),
        'allDay': body.get('allDay', False),
        'description': body.get('description', ''),
    }
    table.put_item(Item=item)

    if item['color'] == 'oefenen':
        now = datetime.now(timezone.utc).isoformat()
        with registrations_table.batch_writer() as batch:
            for user in get_all_users():
                batch.put_item(Item={
                    'eventId': item['id'],
                    'userId': user['userId'],
                    'userName': user['userName'],
                    'registeredAt': now,
                })

    return {
        'statusCode': 201,
        'body': json.dumps(item)
    }
