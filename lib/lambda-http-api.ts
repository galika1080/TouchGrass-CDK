import { RemovalPolicy, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway_l2 from '@aws-cdk/aws-apigatewayv2-alpha';

import { HttpUrlIntegration, HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export interface LambdaHttpApiProps {
    name: string;
    route: string;
    handler: string;
    code: lambda.Code;
    memorySize: number;
    timeout: Duration;
}

export class LambdaHttpApi extends Construct {

    constructor(scope: Construct, id: string, props: LambdaHttpApiProps) {
        super(scope, id);
        
        // restate prop members for clarity
        const handler = props.handler;
        const code = props.code;
        const routeName = props.route;

        const fnName = props.name + 'Lambda';
        const integrationName = props.name + 'Integration';
        const apiName = props.name + 'Api';

        const memorySize = props.memorySize;
        const timeout = props.timeout;

        // instantiate resources
        const fn = new lambda.Function(this, fnName, {
            functionName: fnName,
            runtime: lambda.Runtime.JAVA_11,
            handler: handler,
            code: code,
            memorySize: memorySize,
            timeout: timeout
        });

        const integration = new HttpLambdaIntegration(integrationName, fn);
        const api = new apigateway_l2.HttpApi(this, apiName);

        api.addRoutes({
            path: routeName,
            methods: [ apigateway_l2.HttpMethod.POST ],
            integration: integration
        });
    }
}