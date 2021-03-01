import { ref } from "@libs/cloudformation"
import { StripeApiGateway } from './api-gateway';

export const StripeBus = {
  Type: "AWS::Events::EventBus",
  Properties: {
    Name: "Stripe"
  }
}

export const StripeApiGatewayTarget = {
  Type: "AWS::Events::Rule",
  Properties: {
    EventBusName: ref({ StripeBus }),
    EventPattern: JSON.stringify({
      "detail-type": ["Stripe"]
    }),
    Targets: [
      {
        Arn: {
          "Fn::Sub": [
            "arn:aws:execute-api:${AWS::Region}:${AWS::AccountId}:${ApiId}/dev/POST/products",
            {
              ApiId: ref({ StripeApiGateway }),
            }
          ]
        },
        Id: "ApiGatewayStripeTargetId",
        InputPath: "$.detail",
        HttpParameters: {
          PathParameterValues: [],
          HeaderParameters: {},
          QueryStringParameters: {}
        }
      }
    ]
  }
}
