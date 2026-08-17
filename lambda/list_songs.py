import json
import boto3

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('ruada-songs')

def handler(event, context):
    result = table.scan()
    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin': 'http://localhost:4200' },
        'body': json.dumps(result['Items'])
    }
