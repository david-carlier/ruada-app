import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('ruada-songs')

def handler(event, context):
    body = json.loads(event['body'])
    item = {
        'id': str(uuid.uuid4()),
        'title': body['title'],
        'genre': body['genre'],
        'artist': body.get('artist', ''),
        'spotify': body.get('spotify', ''),
        'youtube': body.get('youtube', ''),
        'lyrics': body.get('lyrics', ''),
    }
    table.put_item(Item=item)
    return {
        'statusCode': 201,
        'headers': { 'Access-Control-Allow-Origin': 'http://localhost:4200' },
        'body': json.dumps(item)
    }
