<script>
	let sidebarCollapsed = false;

	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed; 
	}

	function checkWindowSize() {
		if (window.innerWidth <= 1024) {
			sidebarCollapsed = true;
		} else {
			sidebarCollapsed = false;
		}
	}
	window.addEventListener('resize', checkWindowSize);
	window.addEventListener('load', checkWindowSize);

</script>

<div class="sidebar" class:collapsed={sidebarCollapsed}>
	<button on:click={toggleSidebar}>
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
		height: 100%;
		width: 160px; 
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2.5%;
		top: 10%;
		transition: transform 0.3s ease; 
		overflow: hidden;
		z-index: 100;
		box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
	}

	.sidebar.collapsed {
		transform: translateX(-78%);
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

	.sidebar a:hover {
		color: var(--color-text-secondary);
        background-color: var(--color-background-primary);
        transition: color 0.3s ease 0s;
	}

	button {
	background: none;
	border: none;
	color: var(--color-text-primary);
	font-size: 1.5rem;
	cursor: pointer;
	margin-bottom: 10px;
	display: flex;
	justify-content: center; 
	align-items: center;
	position: relative;
	width: 100%; 
	padding-left: 170px;
	}

</style>
