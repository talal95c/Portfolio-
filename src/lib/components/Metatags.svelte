<script>
  let {
    title = 'Sam Cheng',
    description = 'Sam Cheng is a designer & founder building impactful products with innovative design.',
    image = 'https://www.samfcheng.com/card.png'
  } = $props();
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="www.samfcheng.com" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
</svelte:head>
