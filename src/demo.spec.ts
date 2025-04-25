import { describe, it, expect } from 'vitest';

describe('Calculator', () => {
	describe('addition', () => {
		it('should add two positive numbers correctly', () => {
			expect(1 + 2).toBe(3);
		});

		it('should handle zero correctly', () => {
			expect(0 + 5).toBe(5);
		});

		it('should handle negative numbers correctly', () => {
			expect(-1 + 1).toBe(0);
		});
	});
});
