import json
import boto3

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('ruada-songs')

ALLOWED_FIELDS = {'title', 'genre', 'artist', 'spotify', 'youtube', 'lyrics'}

def handler(event, context):
    id = event['pathParameters']['id']
    body = {k: v for k, v in json.loads(event['body']).items() if k in ALLOWED_FIELDS}
    if not body:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'No valid fields provided'})
        }
    expressions = [f'#{k}=:{k}' for k in body]
    table.update_item(
        Key={'id': id},
        UpdateExpression='SET ' + ', '.join(expressions),
        ExpressionAttributeNames={f'#{k}': k for k in body},
        ExpressionAttributeValues={f':{k}': v for k, v in body.items()},
    )
    return {
        'statusCode': 200,
        'body': json.dumps({'id': id, **body})
    }
