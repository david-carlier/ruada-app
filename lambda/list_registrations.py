import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('ruada-registrations')

def handler(event, context):
    event_id = event['pathParameters']['id']
    result = table.query(KeyConditionExpression=Key('eventId').eq(event_id))
    return {'statusCode': 200, 'body': json.dumps(result['Items'])}
