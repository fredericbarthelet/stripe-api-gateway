import type { AWS } from '@serverless/typescript';

import { StripeApiGateway, StripeApiGatewayDeployment, ApiGatewayAccounts, ApiGatewayProducts, ApiGatewayAccountsGetMethod, ApiGatewayProductsGetMethod, ApiGatewayProductsPostMethod, StripeApiGatewayStage } from '@resources/api-gateway';
import { StripeBus, StripeApiGatewayTarget } from "@resources/eventbridge";
import { EventBridgeDeadLetterQueue } from "@resources/sqs";

const serverlessConfiguration: AWS = {
  service: 'stripe-api-gateway',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'fredericb-programmatic',
    region: 'eu-west-1',
  },
  resources: {
    Resources: {
      StripeApiGateway,
      StripeApiGatewayDeployment,
      ApiGatewayAccounts,
      ApiGatewayProducts,
      ApiGatewayAccountsGetMethod,
      ApiGatewayProductsGetMethod,
      ApiGatewayProductsPostMethod,
      StripeApiGatewayStage,
      StripeBus,
      StripeApiGatewayTarget,
      EventBridgeDeadLetterQueue,
    }
  }
};

module.exports = serverlessConfiguration;
