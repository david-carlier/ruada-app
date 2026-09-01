import json
import boto3
from datetime import datetime, timezone

dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
table = dynamodb.Table('ruada-registrations')
cognito = boto3.client('cognito-idp', region_name='eu-west-1')

USER_POOL_ID = 'eu-west-1_yTLDLeVlw'

def get_user_name(user_id, fallback):
    try:
        resp = cognito.list_users(
            UserPoolId=USER_POOL_ID,
            Filter=f'sub = "{user_id}"',
            Limit=1
        )
        if resp['Users']:
            attrs = {a['Name']: a['Value'] for a in resp['Users'][0]['Attributes']}
            return attrs.get('name') or fallback
    except Exception:
        pass
    return fallback

def handler(event, context):
    event_id = event['pathParameters']['id']
    authorizer = event['requestContext']['authorizer']
    claims = authorizer.get('claims') or authorizer.get('jwt', {}).get('claims', {})
    parent_id = claims['sub']

    body = json.loads(event.get('body') or '{}')
    child_name = body.get('childName', '').strip()

    if child_name:
        user_id = f'child#{parent_id}#{child_name}'
        user_name = child_name
    else:
        user_id = parent_id
        fallback = claims.get('cognito:username') or claims.get('email', '')
        user_name = get_user_name(parent_id, fallback)

    table.put_item(Item={
        'eventId': event_id,
        'userId': user_id,
        'userName': user_name,
        'registeredAt': datetime.now(timezone.utc).isoformat(),
    })
    return {'statusCode': 200, 'body': json.dumps({'registered': True})}
