def handler(event, context):
    children = event['request']['userAttributes'].get('custom:children', '')
    event['response']['claimsOverrideDetails'] = {
        'claimsToAddOrOverride': {
            'custom:children': children
        }
    }
    return event
