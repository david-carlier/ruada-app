import json
import boto3

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('ruada-events')

def handler(event, context):
    id = event['pathParameters']['id']
    body = json.loads(event['body'])

    table.update_item(
        Key={'id': id, 'date': body['date']},
        UpdateExpression='SET title = :title, startTime = :startTime, endTime = :endTime, color = :color, #loc = :location, allDay = :allDay, description = :description',
        ExpressionAttributeNames={'#loc': 'location'},
        ExpressionAttributeValues={
            ':title': body['title'],
            ':startTime': body.get('startTime', ''),
            ':endTime': body.get('endTime', ''),
            ':color': body.get('color', 'oefenen'),
            ':location': body.get('location', ''),
            ':allDay': body.get('allDay', False),
            ':description': body.get('description', ''),
        }
    )

    return {
        'statusCode': 200,
        'body': json.dumps({'updated': id})
    }
