import json
import boto3
import uuid
from datetime import datetime, timezone

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('ruada-events')
registrations_table = dynamodb.Table('ruada-registrations')
cognito = boto3.client('cognito-idp', region_name='eu-west-1')

USER_POOL_ID = 'eu-west-1_tJ18X0zlF'

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

def add_months(d, months):
    month = d.month - 1 + months
    year = d.year + month // 12
    month = month % 12 + 1
    import calendar
    day = min(d.day, calendar.monthrange(year, month)[1])
    return d.replace(year=year, month=month, day=day)

def next_date(d, rule):
    from datetime import timedelta
    if rule == 'weekly': return d + timedelta(weeks=1)
    if rule == 'monthly': return add_months(d, 1)
    if rule == 'every2months': return add_months(d, 2)
    if rule == 'every3months': return add_months(d, 3)
    return d

def handler(event, context):
    body = json.loads(event['body'])
    recurrence_rule = body.get('recurrenceRule')
    recurrence_count = int(body.get('recurrenceCount', 1))
    recurrence_id = str(uuid.uuid4()) if recurrence_rule else None

    base_date = datetime.strptime(body['date'], '%Y-%m-%d').date()

    def make_item(d):
        item = {
            'id': str(uuid.uuid4()),
            'title': body['title'],
            'date': d.isoformat(),
            'startTime': body.get('startTime', ''),
            'endTime': body.get('endTime', ''),
            'color': body.get('color', 'indigo'),
            'location': body.get('location', ''),
            'allDay': body.get('allDay', False),
            'description': body.get('description', ''),
        }
        if recurrence_id:
            item['recurrenceId'] = recurrence_id
            item['recurrenceRule'] = recurrence_rule
        return item

    dates = [base_date]
    d = base_date
    for _ in range(recurrence_count - 1):
        d = next_date(d, recurrence_rule)
        dates.append(d)

    items = [make_item(d) for d in dates]

    now = datetime.now(timezone.utc).isoformat()
    users = get_all_users() if items[0]['color'] == 'oefenen' else []

    with table.batch_writer() as batch:
        for item in items:
            batch.put_item(Item=item)

    if users:
        with registrations_table.batch_writer() as batch:
            for item in items:
                for user in users:
                    batch.put_item(Item={
                        'eventId': item['id'],
                        'userId': user['userId'],
                        'userName': user['userName'],
                        'registeredAt': now,
                    })

    return {
        'statusCode': 201,
        'body': json.dumps(items[0])
    }
