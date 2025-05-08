<script lang="ts">
  import { goto } from '$app/navigation';

  export let communityName: string = "Kites Community";

  interface RuleItem {
    category: string;
    items: string[];
  }

  export let rules: RuleItem[] = [
    {
      category: "Respectful Conduct",
      items: [
        "Be respectful to all users. Treat everyone with kindness and courtesy.",
        "No personal attacks, harassment, or doxxing. Focus on the content, not the person.",
        "Avoid hate speech, discrimination, or any language that demeans individuals or groups based on their identity."
      ]
    },
    {
      category: "Content Guidelines",
      items: [
        "No spam or excessive self-promotion. Contribute meaningfully to the community.",
        "NSFW content must be clearly labeled and posted in designated areas (if applicable).",
        "Do not spread misinformation or engage in deliberate deception.",
        "Respect copyright and intellectual property. Do not post content that you do not have the right to share."
      ]
    },
    {
      category: "Posting Guidelines",
      items: [
        "Use clear and descriptive titles for your posts.",
        "Flair your posts appropriately to help others understand the content.",
        "Avoid excessive cross-posting. Choose the most relevant community for your post.",
        "Keep discussions civil and on-topic."
      ]
    },
    {
      category: "Voting and Engagement",
      items: [
        "Do not engage in vote manipulation or brigading.",
        "Contribute constructively to discussions through thoughtful comments.",
        "Report content that violates these rules."
      ]
    },
    {
      category: "Consequences",
      items: [
        "Violations of these rules may result in warnings, temporary bans, or permanent bans, depending on the severity and frequency of the offense.",
        "Moderators reserve the right to remove content that violates these rules or disrupts the community."
      ]
    }
  ];
</script>

<svelte:head>
  <title>{communityName} Rules</title>
</svelte:head>

<div class="rules-page">
  <h1>{communityName} Rules</h1>
  <p class="introduction">Welcome to the {communityName}! These rules are in place to ensure a positive and respectful environment for everyone. Please take a moment to read them carefully.</p>

  {#each rules as category}
    <div class="rule-category">
      <h2>{category.category}</h2>
      <ul>
        {#each category.items as rule}
          <li>{rule}</li>
        {/each}
      </ul>
    </div>
  {/each}

  <p class="contact">If you have any questions about these rules, please contact the moderators.</p>
</div>

<style>
  .rules-page {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid var(--color-navigation-border);
    border-radius: 8px;
    background-color: var(--color-background-secondary);
    line-height: 1.6;
  }

  h1 {
    font-size: 2.5em;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
    text-align: center;
  }

  .introduction {
    margin-bottom: 1.5rem;
    color: var(--color-text-secondary);
    text-align: center;
  }

  .rule-category {
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 1.8em;
    margin-bottom: 0.8rem;
    color: var(--color-text-primary);
    border-bottom: 2px solid var(--color-navigation-border);
    padding-bottom: 0.5rem;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    color: var(--color-text-primary);
  }

  li {
    margin-bottom: 0.5rem;
  }

  .contact {
    margin-top: 2rem;
    color: var(--color-text-secondary);
    text-align: center;
    font-style: italic;
  }
</style>