import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('ruada-events')

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
    return {
        'statusCode': 201,
        'body': json.dumps(item)
    }
