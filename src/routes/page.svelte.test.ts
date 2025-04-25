import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('Home Page', () => {
	beforeEach(() => {
		render(Page);
	});

	describe('rendering', () => {
		it('should display the main heading', () => {
			expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
		});

		it('should display the grid layout', () => {
			const grid = document.querySelector('.grid');
			expect(grid).toBeInTheDocument();
		});

		it('should display all three columns', () => {
			const columns = document.querySelectorAll('.grid > div');
			expect(columns).toHaveLength(3);
		});

		it('should display the input field in the middle column', () => {
			const input = screen.getByPlaceholderText('I fill the gap');
			expect(input).toBeInTheDocument();
		});
	});
});
