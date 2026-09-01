import json
import boto3

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('ruada-registrations')

def handler(event, context):
    event_id = event['pathParameters']['id']
    authorizer = event['requestContext']['authorizer']
    claims = authorizer.get('claims') or authorizer.get('jwt', {}).get('claims', {})
    parent_id = claims['sub']

    body = json.loads(event.get('body') or '{}')
    child_name = body.get('childName', '').strip()

    user_id = f'child#{parent_id}#{child_name}' if child_name else parent_id

    table.delete_item(Key={'eventId': event_id, 'userId': user_id})
    return {'statusCode': 200, 'body': json.dumps({'unregistered': True})}
