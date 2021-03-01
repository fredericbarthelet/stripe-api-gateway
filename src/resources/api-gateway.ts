import { ref, getAttribute, logicalId } from '../libs/cloudformation';

export const StripeApiGateway = {
  Type: 'AWS::ApiGateway::RestApi',
  Properties: {
    Name: 'StripeApiGateway',
    // Policy: {
    //   Version: "2012-10-17",
    //   Statement: [
    //     {
    //       Effect: "Allow",
    //       Principal: "*",
    //       Action: [
    //         "execute-api:Invoke",
    //         "execute-api:ManageConnections",
    //       ],
    //       Resource: [
    //         "execute-api:/*"
    //       ]
    //     }
    //   ],
    // }
  },
};

export const ApiGatewayAccounts = {
  Type: 'AWS::ApiGateway::Resource',
  Properties: {
    RestApiId: ref({ StripeApiGateway }),
    ParentId: getAttribute({ StripeApiGateway }, 'RootResourceId'),
    PathPart: 'accounts',
  },
};

export const ApiGatewayProducts = {
  Type: 'AWS::ApiGateway::Resource',
  Properties: {
    RestApiId: ref({ StripeApiGateway }),
    ParentId: getAttribute({ StripeApiGateway }, 'RootResourceId'),
    PathPart: 'products',
  },
};

export const ApiGatewayAccountsGetMethod = {
  Type: 'AWS::ApiGateway::Method',
  Properties: {
    HttpMethod: 'GET',
    ResourceId: ref({ ApiGatewayAccounts }),
    RestApiId: ref({ StripeApiGateway }),
    AuthorizationType: 'NONE',
    Integration: {
      RequestParameters: {
        'integration.request.header.Authorization': '\'Bearer sk_test_51IPtlqEiv2Oj00NPjgzk55DwP4d9JrDbf3LpFGbJ4agU1Rm3s8ZrM2MSuoAUYhYUbeqgppkpWIpUaENIJ7aGLnIO000kzGBT2d\'',
      },
      IntegrationHttpMethod: 'GET',
      Type: 'HTTP_PROXY',
      Uri: 'https://api.stripe.com/v1/accounts',
      PassthroughBehavior: 'NEVER',
    },
  },
};

export const ApiGatewayProductsGetMethod = {
  Type: 'AWS::ApiGateway::Method',
  Properties: {
    HttpMethod: 'GET',
    ResourceId: ref({ ApiGatewayProducts }),
    RestApiId: ref({ StripeApiGateway }),
    AuthorizationType: 'NONE',
    Integration: {
      RequestParameters: {
        'integration.request.header.Authorization': '\'Bearer sk_test_51IPtlqEiv2Oj00NPjgzk55DwP4d9JrDbf3LpFGbJ4agU1Rm3s8ZrM2MSuoAUYhYUbeqgppkpWIpUaENIJ7aGLnIO000kzGBT2d\'',
      },
      IntegrationHttpMethod: 'GET',
      Type: 'HTTP_PROXY',
      Uri: 'https://api.stripe.com/v1/products',
      PassthroughBehavior: 'NEVER',
    },
  },
};

export const ApiGatewayProductsPostMethod = {
  Type: 'AWS::ApiGateway::Method',
  Properties: {
    HttpMethod: 'POST',
    ResourceId: ref({ ApiGatewayProducts }),
    RestApiId: ref({ StripeApiGateway }),
    AuthorizationType: 'NONE',
    Integration: {
      RequestParameters: {
        'integration.request.header.Authorization': '\'Bearer sk_test_51IPtlqEiv2Oj00NPjgzk55DwP4d9JrDbf3LpFGbJ4agU1Rm3s8ZrM2MSuoAUYhYUbeqgppkpWIpUaENIJ7aGLnIO000kzGBT2d\'',
        'integration.request.querystring.name': 'method.request.body.name'
      },
      IntegrationHttpMethod: 'POST',
      RequestTemplates: {
        "application/json": "{}"
      },
      Type: 'HTTP',
      Uri: 'https://api.stripe.com/v1/products',
      PassthroughBehavior: 'NEVER',
      IntegrationResponses: [
        {
          SelectionPattern: '2\\d{2}',
          StatusCode: 200,
        }
      ]
    },
    MethodResponses: [
      { StatusCode: 200 }
    ]
  },
};

export const StripeApiGatewayDeployment = {
  Type: 'AWS::ApiGateway::Deployment',
  Properties: {
    RestApiId: ref({ StripeApiGateway }),
  },
  DependsOn: [
    logicalId({ ApiGatewayAccountsGetMethod }),
    logicalId({ ApiGatewayProductsGetMethod }),
    logicalId({ ApiGatewayProductsPostMethod }),
  ],
};

export const StripeApiGatewayStage = {
  Type: 'AWS::ApiGateway::Stage',
  Properties: {
    DeploymentId: ref({ StripeApiGatewayDeployment }),
    RestApiId: ref({ StripeApiGateway }),
    StageName: 'dev',
  }
};
