import json
import boto3

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('ruada-songs')

def handler(event, context):
    id = event['pathParameters']['id']
    table.delete_item(Key={'id': id})
    return {
        'statusCode': 200,
        'body': json.dumps({'deleted': id})
    }
