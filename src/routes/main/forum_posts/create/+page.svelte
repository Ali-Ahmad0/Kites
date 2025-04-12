<script lang="ts">
    let { form } = $props();
</script>

<div class="card">
    <form method="POST" action="?/create">
        <button class="confirm">Create Post</button>
    </form>
</div>
