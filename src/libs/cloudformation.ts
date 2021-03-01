export const logicalId = <R extends Record<string, unknown>>(
  resource: R,
): keyof R => {
  if (Object.keys(resource).length !== 1) {
    throw new Error('logicalId can only be used on one resource');
  }
  const [resourceName] = Object.keys(resource) as (keyof R)[];
  return resourceName;
};

export const ref = <R extends Record<string, unknown>>(
  resource: R,
): Record<'Ref', keyof R> => {
  if (Object.keys(resource).length !== 1) {
    throw new Error('Ref can only be used on one resource');
  }
  const [resourceName] = Object.keys(resource) as (keyof R)[];
  return { Ref: resourceName };
};

interface CloudFormationImportValue {
  'Fn::ImportValue': string;
}

export const getAttribute = <
  R extends Record<string, unknown>,
  A extends 'Arn' | 'RootResourceId' | 'StreamArn'
>(
  resource: R,
  attribute: A,
): Record<'Fn::GetAtt', [keyof R, A]> => {
  if (Object.keys(resource).length !== 1) {
    throw new Error('Fn:GetAtt can only be used on one resource');
  }
  const [resourceName] = Object.keys(resource) as (keyof R)[];
  return { 'Fn::GetAtt': [resourceName, attribute] };
};

export const importValue = (output): CloudFormationImportValue => {
  if (!output.Export) {
    throw new Error(
      'The value you are referencing is not exported, please use Export.Name property to do so',
    );
  }

  return {
    'Fn::ImportValue': output.Export.Name,
  };
};

// LAMBDAS

export const getHandlerPath = (
  dirName: string,
  handlerRelativePath = 'handler.main',
): string => {
  const PATH_SEPARATOR = process.platform === 'win32' ? '\\' : '/';

  return [
    dirName.split(['safetracker', 'backend', ''].join(PATH_SEPARATOR))[1],
    handlerRelativePath,
  ].join(PATH_SEPARATOR);
};

export enum ServiceName {
  CORE = 'safetracker-backend',
  FILES = 'safetracker-backend-files-api',
  INCIDENTS_COMMANDS = 'safetracker-incidents-commands-api',
  STAFFS_COMMANDS = 'safetracker-staffs-commands-api',
}

export const SAFETRACKER_LAMBDAS = {
  dispatchNewUserConnected: {
    service: ServiceName.CORE,
    shortName: 'dispatchNewUserConnected',
  },
  getFileDownloadUrl: {
    service: ServiceName.FILES,
    shortName: 'getDownloadUrl',
  },
  getIncidentAggregate: {
    service: ServiceName.INCIDENTS_COMMANDS,
    shortName: 'getIncidentAggregate',
  },
  getStaffAggregate: {
    service: ServiceName.STAFFS_COMMANDS,
    shortName: 'getStaffAggregate',
  },
};

interface SafetrackerLambda {
  service: ServiceName;
  shortName: string;
}

export const getLambdaLongName = ({
  service,
  shortName,
}: SafetrackerLambda): string =>
  [service, '${self:provider.stage}', shortName].join('-');

export const getLambdaArn = (safetrackerLambda: SafetrackerLambda): string =>
  [
    'arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function',
    getLambdaLongName(safetrackerLambda),
  ].join(':');
