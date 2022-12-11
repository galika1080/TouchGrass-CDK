import { Stack, StackProps, RemovalPolicy, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code } from 'aws-cdk-lib/aws-lambda';

import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import { LambdaHttpApi } from './lambda-http-api';


export class TouchGrassCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const javaLambdaBucket = new s3.Bucket(this, 'TouchGrassJavaLambdaBucket');
    const javaLambdaCode = Code.fromBucket(javaLambdaBucket, 'TouchGrassJavaLambda.jar');


    // Lambda-backed HTTP APIs

    const getTagsForUrl = new LambdaHttpApi(this, 'GetTagsForUrl', {
      name: 'GetTagsForUrl',
      route: '/tag-url',
      handler: 'com.touchgrass.lambda.GetTagsForUrl',
      code: javaLambdaCode,
      memorySize: 512,
      timeout: Duration.seconds(16)
    });

    const setUserTags = new LambdaHttpApi(this, 'SetUserTags', {
      name: 'SetUserTags',
      route: '/set-user-tags',
      handler: 'com.touchgrass.lambda.SetUserTags',
      code: javaLambdaCode,
      memorySize: 512,
      timeout: Duration.seconds(16)
    });

    const getUserTags = new LambdaHttpApi(this, 'GetUserTags', {
      name: 'GetUserTags',
      route: '/get-user-tags',
      handler: 'com.touchgrass.lambda.GetUserTags',
      code: javaLambdaCode,
      memorySize: 512,
      timeout: Duration.seconds(16)
    });

    const getAllEvents = new LambdaHttpApi(this, 'GetAllEvents', {
      name: 'GetAllEvents',
      route: '/get-all-events',
      handler: 'com.touchgrass.lambda.GetEvents',
      code: javaLambdaCode,
      memorySize: 512,
      timeout: Duration.seconds(16)
    });

    const getSuggestedEvents = new LambdaHttpApi(this, 'GetSuggestedEvents', {
      name: 'GetSuggestedEvents',
      route: '/get-suggested-events',
      handler: 'com.touchgrass.lambda.GetSuggestedEvents',
      code: javaLambdaCode,
      memorySize: 512,
      timeout: Duration.seconds(16)
    });


    // Event-scraping Lambda
    const scrapeEvents = new lambda.Function(this, 'ScrapeEvents', {
      functionName: 'ScrapeEvents',
      runtime: lambda.Runtime.JAVA_11,
      handler: 'com.touchgrass.lambda.ScrapeEvents',
      code: javaLambdaCode,
      memorySize: 512,
      timeout: Duration.seconds(16)
    });


    // DynamoDB tables

    const profiles = new dynamodb.Table(this, 'Profiles', {
      tableName: 'Profiles',
      partitionKey: { name: 'Email', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const events = new dynamodb.Table(this, 'Events', {
      tableName: 'Events',
      partitionKey: { name: 'Date', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'Name', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    });
  }

}
