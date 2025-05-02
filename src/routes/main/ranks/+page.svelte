<script>
	import { RankCard } from "$lib";
</script>

<div class="content">
    <RankCard rank="Bronze" price={1000}/>
    <RankCard rank="Silver" price={3000}/>
    <RankCard rank="Golden" price={5000}/>
</div>

<style>
    .content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        place-items: center;
        
        min-height: 60vh;
        padding: 2rem;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        
        overflow-x: hidden;
    }

    @media screen and (max-width: 1450px) {
        .content {
            grid-template-columns: repeat(2, 1fr);
            max-width: 900px;
        }
    }

    @media screen and (max-width: 1024px) {
        .content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            width: 100%; 
            box-sizing: border-box;
        }
    }
</style>