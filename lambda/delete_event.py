import json
import boto3

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('ruada-events')

def handler(event, context):
    id = event['pathParameters']['id']
    date = event['pathParameters']['date']
    table.delete_item(Key={'id': id, 'date': date})
    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin': 'http://localhost:4200' },
        'body': json.dumps({'deleted': id})
    }
