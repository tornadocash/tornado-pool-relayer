import Ajv, { ValidateFunction } from 'ajv';
import { isAddress, toChecksumAddress } from '@/utilities';

const ajv = new Ajv();

ajv.addKeyword({
  keyword: 'isAddress',
  validate: (schema: any, address: string) => {
    return isAddress(address);
  },
  errors: true,
});

ajv.addKeyword({
  keyword: 'isKnownContract',
  validate: (schema: any, address: string) => {
    try {
      return address !== null;
    } catch (e) {
      return false;
    }
  },
  errors: true,
});

ajv.addKeyword({
  keyword: 'isFeeRecipient',
  validate: (schema: any, address: string) => {
    try {
      return toChecksumAddress('') === toChecksumAddress(address);
    } catch (e) {
      return false;
    }
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
const instanceType = { ...addressType, isKnownContract: true };
const relayerType = { ...addressType, isFeeRecipient: true };

const tornadoWithdrawSchema = {
  type: 'object',
  properties: {
    proof: proofType,
    contract: instanceType,
    args: {
      type: 'array',
      maxItems: 6,
      minItems: 6,
      items: [
        bytes32Type,
        bytes32Type,
        addressType,
        relayerType,
        bytes32Type,
        bytes32Type,
      ],
    },
  },
  additionalProperties: false,
  required: ['proof', 'contract', 'args'],
};

const validateTornadoWithdraw = ajv.compile(tornadoWithdrawSchema);

function getInputError(
  validator: ValidateFunction,
  data: typeof tornadoWithdrawSchema,
) {
  validator(data);
  if (validator.errors) {
    const [error] = validator.errors;
    return error.message;
  }
  return null;
}

function validateWithdrawRequest(data: typeof tornadoWithdrawSchema) {
  return getInputError(validateTornadoWithdraw, data);
}

export { validateWithdrawRequest };
