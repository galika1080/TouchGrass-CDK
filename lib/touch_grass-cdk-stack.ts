import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code } from 'aws-cdk-lib/aws-lambda';

import * as s3 from 'aws-cdk-lib/aws-s3';

import { LambdaHttpApi } from './lambda-http-api';


export class TouchGrassCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const javaLambdaBucket = new s3.Bucket(this, 'TouchGrassJavaLambdaBucket');
    const javaLambdaCode = Code.fromBucket(javaLambdaBucket, 'TouchGrassJavaLambda.jar');
  }
}
