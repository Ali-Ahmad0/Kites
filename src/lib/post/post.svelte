<script lang="ts">
    import { Icon, Tooltip, is_dark_mode } from "$lib";

    // Dynamic icon folder based on dark mode
    let folder: string = $state("dark_mode_icons");

    // Post like/dislike states
    let liked_post = $state(false);
    let disliked_post = $state(false);
    let post_like_count = $state(0);
    let post_dislike_count = $state(0);

    // Simulated comment data from DB
    let comments = $state([
        {
            id: 1,
            author: "Abeha",
            text: "This is so helpful!",
            liked: false,
            disliked: false,
            like_count: 3,
            dislike_count: 0
        },
        {
            id: 2,
            author: "Ali",
            text: "Interesting perspective, I like it!",
            liked: false,
            disliked: false,
            like_count: 1,
            dislike_count: 1
        },
        {
            id: 3,
            author: "Zainab",
            text: "I have a question...",
            liked: false,
            disliked: false,
            like_count: 0,
            dislike_count: 0
        }
    ]);

    // Update folder on dark mode change
    $effect(() => {
        folder = $is_dark_mode ? "dark_mode_icons" : "light_mode_icons";
    });

    // Toggle like for post
    function toggleLikePost() {
        liked_post = !liked_post;
        if (liked_post) {
            post_like_count++;
            if (disliked_post) {
                post_dislike_count--;
                disliked_post = false;
            }
        } else {
            post_like_count--;
        }
    }

    // Toggle dislike for post
    function toggleDislikePost() {
        disliked_post = !disliked_post;
        if (disliked_post) {
            post_dislike_count++;
            if (liked_post) {
                post_like_count--;
                liked_post = false;
            }
        } else {
            post_dislike_count--;
        }
    }

    // Toggle like for comment
    function toggleLikeComment(index: number) {
        let comment = comments[index];
        if (!comment.liked) {
            comment.like_count++;
            if (comment.disliked) {
                comment.dislike_count--;
                comment.disliked = false;
            }
        } else {
            comment.like_count--;
        }
        comment.liked = !comment.liked;
    }

    // Toggle dislike for comment
    function toggleDislikeComment(index: number) {
        let comment = comments[index];
        if (!comment.disliked) {
            comment.dislike_count++;
            if (comment.liked) {
                comment.like_count--;
                comment.liked = false;
            }
        } else {
            comment.dislike_count--;
        }
        comment.disliked = !comment.disliked;
    }
</script>

<div class="container">
    <div class="details">
        <a href="-" class="author">
            <img class="profile-image" src="/profile.jpg" alt="user's profile">
            <p class="user-name">Username</p>
        </a>   
        <p class="topic">Art</p>
    </div>
    
    <div class="post">
        <h1 class="title">Title</h1>
        
        <p class="content">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus error, hic eveniet maiores magni veniam? Possimus accusantium eos sunt alias eveniet ratione, molestiae veritatis explicabo nihil. Magni iste totam delectus mollitia numquam repellendus eligendi quod et sapiente, repudiandae quas consectetur quaerat excepturi illo iure, molestias ducimus rerum deserunt vero, vitae nemo eum impedit nobis. Esse quos quas ducimus cupiditate consequuntur consectetur praesentium sunt sed?
        </p>
        
        <img src="/orange.jpeg" alt="" class="post-image">
    </div>
    <div class="post-reactions">
        <div class="post-reaction">
            <button class="icon" onclick={toggleLikePost}>
                <Icon mode={folder} name={liked_post ? "/thumb_up_filled" : "/thumb_up"} width={24} height={24} alt="like"/> 
                <p class="count">{post_like_count}</p>
            </button>
        </div>

        <div class="dislike">
            <button class="icon" onclick={toggleDislikePost}>
                <Icon mode={folder} name={disliked_post ? "/thumb_down_filled" : "/thumb_down"} width={24} height={24} alt="dislike"/>
                <span class="count">{post_dislike_count}</span>
            </button>
        </div>

        <div class="comment">
            <button class="icon">
                <Icon mode={folder} name="comment" width={24} height={24} alt="comment"/>
            </button>
        </div>

        <div class="share">
            <button class="icon">
                <Icon mode={folder} name="share" width={24} height={24} alt="share"/>
            </button>
        </div>
    </div>

    <!-- Main comment input -->
    <div class="comment-input-container">
        <input type="text" placeholder="Add a comment" class="comment-input">
        <button class="comment-button">Comment</button>
    </div>

    <!-- Comments List -->
    {#each comments as comment, index}
        <div class="comment">
            <div class="comment-wrapper">
                <img class="comment-avatar" src="/profile.jpg" alt="avatar" />
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">{comment.author}</span>
                        <span class="comment-time"> • 2d ago</span>
                    </div>
                    <div class="comment-text">{comment.text}</div>
                </div>
            </div>
        </div>
    {/each}
</div>

<style>

    .container{
        display: flex;
        flex-direction: column;
        width: 78rem;
    }

    .details{
        display: flex;
    }

    .author {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 1.2rem;
    }

    .profile-image {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        margin-left: 10rem;
        margin-top: 1rem;
    }

    .user-name {
        color: var(--color-text-primary);
        margin-top: 2.5rem;
    }

    .topic {
        margin-left: 33rem;
        margin-top: 2.5rem;
        color: var(--color-text-primary);
    }

    .title {
        color: var(--color-text-primary);
        margin-left: 10rem;
        margin-top: 1rem;
    }

    .post-image {
        width: 30rem;
        height: 35rem;
        border-radius: 0.5rem;
        margin-left: 16rem;
        margin-top: 2.5rem;
    }

    .content {
        margin-left: 10rem;
        margin-right: 23rem;
    }

    .post-reactions {
        display: flex;
        gap: 2rem;
        margin-top: 1rem;
        margin-bottom: 2rem;
        margin-left: 16rem;
    }

    .icon {
        transition: all 0.2s ease;
        cursor: pointer;
        background-color: transparent;
        border: none;
    }

    .icon:hover {
        opacity: 0.7;
        transform: translateY(-0.125rem);
    }

    .comment-input-container {
        width: 31rem;
        height: 3.5rem;
        margin-left: 15.5rem;
        display: flex;
    }

    .comment-input {
        width: 40rem;
        height: 2.5rem;
        background-color: var(--color-background-primary);
        border: 0.0625rem solid var(--color-navigation-border);
        border-radius: 1.25rem;
        color: var(--color-text-primary);
        padding: 0 0.9375rem;
        font-size: 0.875rem;
        outline: none;
    }

    .comment-button{
        background-color: var(--color-blue-primary);
        color: var(--color-text-button);
        border: none;
        border-radius: 5rem;
        width: 9rem;
        height: 2.5rem;
        margin-left:1rem;
        transition: all 0.3s ease;
    }

    .comment-button:hover{
        background-color: var(--color-blue-secondary);
        color: var(--color-text-button);
    }

    .comment {
        max-width: 61.25rem;
        margin-left: 10rem;
        margin-right:23rem;
        margin-top:2rem;
        font-size: 14px;
        padding: 0 1.25rem;
        max-height: 37.5rem;
        overflow-y: auto;
        margin-bottom: 1rem;
        padding-bottom: 1rem;

        border-bottom: 0.0625rem solid var(--color-navigation-border);
    }

    .comment:last-child {
        border-bottom: none;
    }

    .comment-wrapper {
        display: flex;
        gap: 1.2rem;
    }

    .comment-avatar {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        margin: 0;
    }

    .comment-content {
        flex: 1;
    }

    .comment-header {
        margin-bottom: 0.25rem;
        display: flex;
        align-items: center;
        gap: 1.2rem;
        flex-wrap: wrap;
    }

    .comment-author {
        font-weight: 500;
        margin-top: 0.4rem;
        color: var(--color-text-primary);
    }

    .comment-time {
        color: var(--color-text-secondary);
        font-size: 0.75rem;
        margin-top: 0.3rem;
    }

    .comment-text {
        margin-bottom: 0.5rem;
        margin-top: 1rem;
        color: var(--color-text-primary);
        line-height: 1.5;
    }

    .comment-actions {
        display: flex;
        color: var(--color-text-secondary);
        font-size: 0.75rem;
        gap: 2rem;
    }

    .comment-reaction{
        display: flex;
        gap: 0.6rem;
        margin-top: 0.5rem;
        background: transparent;
        border: none;
        background-color: var(--color-background-primary);
        transition: all 0.2s ease;
    }

    .comment-reaction:hover{
        opacity: 0.7;
        transform: translateY(-0.125rem);
    }

    .count{
        color: var(--color-text-primary);
    }

    
</style>