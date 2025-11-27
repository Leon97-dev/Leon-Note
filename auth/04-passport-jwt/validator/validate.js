// TODO) Validate: req.body가 스키마에 맞는지 검사
import { assert } from 'superstruct';
import { ValidationError } from '../core/error/error-handler.js';

export default function validate(schema) {
  return (req, _res, next) => {
    try {
      assert(req.body, schema);
      next();
    } catch (error) {
      // *) superstruct는 어떤 필드가 잘못됐는지 path 정보가 있음
      const path = error.path?.join('.') || null;
      throw new ValidationError(path, '요청 데이터가 올바르지 않습니다');
    }
  };
}
