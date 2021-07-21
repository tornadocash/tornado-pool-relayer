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
const arrayType = { type: 'array', pattern: '^0x[a-fA-F0-9]{64}$' };

const recipientType = {
  type: 'object',
  properties: {
    recipient: addressType,
    relayer: addressType,
    encryptedOutput1: bytes32Type,
    encryptedOutput2: bytes32Type,
  },
};

const withdrawSchema = {
  type: 'object',
  properties: {
    proof: proofType,
    args: {
      type: 'array',
      maxItems: 9,
      minItems: 9,
      items: [bytes32Type, bytes32Type, arrayType, bytes32Type, bytes32Type, bytes32Type, bytes32Type, recipientType, bytes32Type],
    },
  },
  additionalProperties: false,
  required: ['proof', 'args'],
};

const validateTornadoWithdraw = ajv.compile(withdrawSchema);

function getInputError(validator: ValidateFunction, data: typeof withdrawSchema) {
  validator(data);
  if (validator.errors) {
    const [error] = validator.errors;
    return error.message;
  }
  return null;
}

function validateWithdrawRequest(data: typeof withdrawSchema) {
  return getInputError(validateTornadoWithdraw, data);
}

export { validateWithdrawRequest };
