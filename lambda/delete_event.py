import json
import boto3
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('ruada-events')

def handler(event, context):
    id = event['pathParameters']['id']
    date = event['pathParameters']['date']
    body = json.loads(event.get('body') or '{}')
    delete_mode = body.get('deleteMode', 'single')

    if delete_mode == 'future':
        recurrence_id = body.get('recurrenceId')
        if recurrence_id:
            result = table.scan(FilterExpression=Attr('recurrenceId').eq(recurrence_id) & Attr('date').gte(date))
            with table.batch_writer() as batch:
                for item in result['Items']:
                    batch.delete_item(Key={'id': item['id'], 'date': item['date']})
        return {'statusCode': 200, 'body': json.dumps({'deleted': 'future'})}

    table.delete_item(Key={'id': id, 'date': date})
    return {'statusCode': 200, 'body': json.dumps({'deleted': id})}
