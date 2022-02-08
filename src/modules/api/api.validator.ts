import Ajv, { ValidateFunction } from 'ajv';
import { isAddress } from '@/utilities';

const ajv = new Ajv();

ajv.addKeyword({
  keyword: 'isAddress',
  validate: (schema: any, address: string) => {
    return isAddress(address);
  },
  errors: true,
});

const addressType = {
  type: 'string',
  pattern: '^0x[a-fA-F0-9]{40}$',
  isAddress: true,
};

const proofType = { type: 'string', pattern: '^0x[a-fA-F0-9]{512}$' };
const bytes32Type = { type: 'string', pattern: '^0x[a-fA-F0-9]{64}$' };
const externalAmountType = { type: 'string', pattern: '^(0x[a-fA-F0-9]{64}|-0x[a-fA-F0-9]{63})$' };
const encryptedOutputType = { type: 'string', pattern: '^0x[a-fA-F0-9]{312}$' };
const arrayType = { type: 'array', items: bytes32Type };
const booleanType = { type: 'boolean' };

const transactionSchema = {
  type: 'object',
  properties: {
    extData: {
      type: 'object',
      properties: {
        encryptedOutput1: encryptedOutputType,
        encryptedOutput2: encryptedOutputType,
        extAmount: externalAmountType,
        fee: bytes32Type,
        recipient: addressType,
        relayer: addressType,
        isL1Withdrawal: booleanType,
        l1Fee: bytes32Type,
      },
    },
    args: {
      type: 'object',
      properties: {
        extDataHash: bytes32Type,
        inputNullifiers: arrayType,
        outputCommitments: arrayType,
        proof: proofType,
        publicAmount: bytes32Type,
        root: bytes32Type,
      },
    },
  },
  additionalProperties: false,
  required: ['extData', 'args'],
};

const validateTornadoTransaction = ajv.compile(transactionSchema);

function getInputError(validator: ValidateFunction, data: typeof transactionSchema) {
  validator(data);
  if (validator.errors) {
    const [error] = validator.errors;
    return error.message;
  }
  return null;
}

function validateTransactionRequest(data: typeof transactionSchema) {
  return getInputError(validateTornadoTransaction, data);
}

export { validateTransactionRequest };
