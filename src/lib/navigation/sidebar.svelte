<script>
	import { sidebar_collapsed } from "$lib";
	import { browser } from "$app/environment";

	function check_window_size() {
		if (browser) {
			sidebar_collapsed.update(() => window.innerWidth < 1024);
		}
	}

	if (browser) {
		window.addEventListener('resize', check_window_size);
		window.addEventListener('load', check_window_size);
	}
</script>

<div class="sidebar" class:collapsed={$sidebar_collapsed}>
	<div class="menu-links">
		<div class="section">
			<button>Home Page</button>
			<button>My Account</button>
		</div>
		<div class="section">
			<h4>Topics</h4>
			<button>Art</button>
			<button>Philosophy</button>
			<button>Nature</button>
			<button>Science</button>
		</div>
		<div class="section">
			<h4>More</h4>
			<button>Rules</button>
			<button>Github</button>
		</div>
	</div>
</div>

<style>

	.sidebar {
		height: 100vh;
		width: 12rem;

		padding: 1rem;

		display: flex;
		flex-direction: column;
		align-items: center;

		border-right: solid 1px var(--color-navigation-border);

		transition: width 0.3s ease, border-color 0.3s ease;
	}

	.collapsed {
		width: 0;
		border-color: transparent;
	}


	.menu-links {
		display: flex;
		flex-direction: column;
	}

	h4 {
		color: var(--color-text-secondary);
        background-color: var(--color-background-primary);
        transition: color 0.3s ease 0s;
	}

	.section {
		padding-bottom: 1rem;
		border-bottom: solid 1px var(--color-navigation-border);
	}

	.sidebar button {
		color: var(--color-text-primary);
		background-color: var(--color-background-primary);
				
		padding: 0.7rem 2rem;
		font-size: 1rem;
		width: 100%;

		border: none;
		border-radius: 1rem;

		cursor: pointer;
		
		text-align: left;

		transition: none;
	}

	.sidebar button:hover {
		background-color: var(--color-background-secondary);
		transition: background-color 0.3s ease;
	}

	.sidebar.collapsed button, .sidebar.collapsed h4 {
		display: none;
	}
</style> 
