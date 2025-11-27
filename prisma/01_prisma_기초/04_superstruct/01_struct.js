import * as s from 'superstruct';
import isEmail from 'is-email';
import isUuid from 'is-uuid';

const CATEGORIES = [
  'FASHION',
  'BEAUTY',
  'SPORTS',
  'ELECTRONICS',
  'HOME_INTERIOR',
  // ← prisma enum과 정확히 일치하게 유지! (추가 항목 있으면 enum에도 추가)
];

const STATUSES = ['PENDING', 'COMPLETE'];
const Uuid = s.define('Uuid', (v) => isUuid.v4(v));

export const CreateUser = s.object({
  email: s.define('Email', isEmail),
  firstName: s.size(s.string(), 1, 30),
  lastName: s.size(s.string(), 1, 30),
  address: s.string(),
  userPreference: s.object({
    receiveEmail: s.boolean(),
  }),
});
export const PatchUser = s.partial(CreateUser);

// 모델에서 description이 String? 이면 여기서도 optional로 맞추는 게 안전
export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 60),
  description: s.optional(s.string()),
  category: s.enums(CATEGORIES),
  price: s.min(s.number(), 0),
  stock: s.min(s.integer(), 0),
});
export const PatchProduct = s.partial(CreateProduct);

// ✅ 주문 입력 스키마 추가
const OrderItemInput = s.object({
  productId: Uuid,
  unitPrice: s.min(s.number(), 0),
  quantity: s.min(s.integer(), 1),
});

export const CreateOrder = s.object({
  userId: Uuid, // Order.userId가 optional이면 s.optional(Uuid)로
  orderItems: s.size(s.array(OrderItemInput), 1, Infinity),
});

export const PatchOrder = s.object({
  status: s.enums(STATUSES),
});

export const PostSavedProduct = s.object({
  productId: Uuid,
});
