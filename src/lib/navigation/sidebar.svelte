<script>

	let sidebarCollapsed = false;
	
	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}

</script>

<div class="sidebar" class:collapsed={sidebarCollapsed}>
	<button on:click={toggleSidebar} >
		☰
	</button>
	<div class="menu-links">
		<a href="#">Home</a>
		<a href="#">Art</a>
		<a href="#">Nature</a>
		<a href="#">Philosophy</a>
		<a href="#">Music</a>
		<a href="#">Blogs</a>
		<a href="#">Forum</a>
		<a href="#">About Us</a>
		<a href="#">Contact Us</a>
		<a href="#">Privacy Policy</a>
	</div>
</div>

<style>

	.sidebar {
		position: fixed;
		left: 0;
		top: 0;
		height: 100vh;
		width: 8vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2.5%;
		margin-top: 5%;
		transition: width 0.3s ease;
	}

	.sidebar.collapsed {
		width: 0;
	}

	.sidebar::before {
		content: "";
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
		width: 1px;
		background: rgba(255, 255, 255, 0.5);
	}

	.menu-links {
		margin-top: 20%;
		display: flex;
		flex-direction: column;
		gap: 30px;
		align-items: center;
	}

	.sidebar a {

		color: var(--color-text-primary);
		font-size: 1rem;
		text-decoration: none;
		transition: opacity 0.3s ease;
	}

	.sidebar.collapsed a {
		display: none; 
	}

	.sidebar a:hover {
		color: var(--color-text-secondary);
	}

	button {
		position: relative;
		background: none;
		border: none;
		color: var(--color-text-primary);
		font-size: 1.5rem;
		cursor: pointer;
	}

</style>
