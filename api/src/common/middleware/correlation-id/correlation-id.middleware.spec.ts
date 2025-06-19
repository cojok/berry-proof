import { CorrelationIdMiddleware } from './correlation-id.middleware';

describe('CorrelationIdMiddlewareTsMiddleware', () => {
  it('should be defined', () => {
    expect(new CorrelationIdMiddleware()).toBeDefined();
  });
});
