<h1>Template for a new SvelteKit project with TailwindCSS in Electron</h1>
<div
	class="
      /*
      2rem
      gap on both axes */ grid grid-cols-[min-content_1fr_min-content] gap-8
      border
      border-gray-300
      bg-gray-100
      p-4
    "
>
	<!-- Left column (auto-width) -->
	<div class="bg-red-300 p-4">Left</div>

	<!-- Middle column fills remaining space -->
	<div class="min-w-0 bg-green-300 p-4">
		<input type="text" class="w-full border border-gray-500 p-2" placeholder="I fill the gap" />
	</div>

	<!-- Right column (auto-width) -->
	<div class="bg-blue-300 p-4">Right</div>
</div>
