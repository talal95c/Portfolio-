<script>
  import { onMount } from 'svelte';

  let {
    src,
    width,
    height,
    alt,
    label,
    caption,
    background,
    eager = false
  } = $props();

  let figure;
  let link;
  let dialog;
  let lightboxImage;
  let scrim;
  let closeButton;
  let sourceRect = $state({ left: 0, top: 0, width: 0, height: 0 });
  let open = $state(false);
  let closing = false;
  let animation;
  let overlayAnimations = [];
  const easing = 'cubic-bezier(.4, 0, .2, 1)';
  const fullStyle = {
    transform: 'none',
    borderRadius: '4px',
    boxShadow: '0 2px 6px #0000001a, 0 16px 48px #00000033'
  };

  function reducedMotion() {
    return matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function fitRect() {
    const margin = innerWidth < 600 ? 16 : 48;
    const image = figure.querySelector('img');
    const imageWidth = width ?? image.naturalWidth;
    const imageHeight = height ?? image.naturalHeight;
    const scale = Math.min(
      (innerWidth - margin * 2) / imageWidth,
      (innerHeight - margin * 2) / imageHeight
    );
    const displayWidth = imageWidth * scale;
    const displayHeight = imageHeight * scale;

    return {
      left: (innerWidth - displayWidth) / 2,
      top: (innerHeight - displayHeight) / 2,
      width: displayWidth,
      height: displayHeight
    };
  }

  function thumbnailStyle() {
    const rect = figure.getBoundingClientRect();
    const scale = rect.width / sourceRect.width;
    const px = (value) => `${value / scale}px`;

    return {
      transform: `translate(${rect.left - sourceRect.left}px, ${rect.top - sourceRect.top}px) scale(${scale})`,
      borderRadius: px(4),
      boxShadow: `0 ${px(1)} ${px(2)} #0000000a, 0 ${px(2)} ${px(8)} #00000008`
    };
  }

  async function openLightbox(event) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      open
    ) {
      return;
    }

    event.preventDefault();
    sourceRect = fitRect();
    open = true;
    await Promise.resolve();
    dialog.showModal();
    link.classList.add('zoomed');
    const options = { duration: reducedMotion() ? 150 : 450, easing };
    overlayAnimations = [scrim, closeButton].map((element) =>
      element.animate([{ opacity: 0 }, { opacity: 1 }], options)
    );
    animation = lightboxImage.animate(
      reducedMotion() ? [{ opacity: 0 }, { opacity: 1 }] : [thumbnailStyle(), fullStyle],
      options
    );
  }

  async function closeLightbox(event) {
    if (!open || closing) return;

    if (event?.type === 'cancel') event.preventDefault();
    closing = true;
    if (animation?.playState === 'running') {
      animation.reverse();
      overlayAnimations.forEach((item) => item.reverse());
    } else {
      const options = {
        duration: reducedMotion() ? 120 : 400,
        easing,
        fill: 'forwards'
      };
      overlayAnimations = [scrim, closeButton].map((element) =>
        element.animate([{ opacity: 1 }, { opacity: 0 }], options)
      );
      animation = lightboxImage.animate(
        reducedMotion() ? [{ opacity: 1 }, { opacity: 0 }] : [fullStyle, thumbnailStyle()],
        options
      );
    }

    await animation.finished.catch(() => {});
    link.classList.remove('zoomed');
    dialog.close();
    open = false;
    closing = false;
  }

  function closeOnTouch(event) {
    if (event.touches.length === 1) closeLightbox(event);
  }

  onMount(() => {
    const closeOnResize = () => closeLightbox();
    window.addEventListener('resize', closeOnResize);

    return () => window.removeEventListener('resize', closeOnResize);
  });
</script>

<figure
  class="svelte-1rpafw1"
  bind:this={figure}
  style:flex={width && height ? `${width / height} 1 0` : undefined}
>
  {#if label}
    <p class="label svelte-1rpafw1">{label}</p>
  {/if}

  <a
    class="svelte-1rpafw1"
    href={src}
    aria-haspopup="dialog"
    aria-label={`View larger: ${alt ?? ''}`}
    style:background
    bind:this={link}
    onclick={openLightbox}
  >
    <img
      class="svelte-1rpafw1"
      {src}
      {alt}
      {width}
      {height}
      decoding="async"
      loading={eager ? undefined : 'lazy'}
    />
  </a>

  {#if caption}
    <figcaption class="svelte-1rpafw1">{caption}</figcaption>
  {/if}
</figure>

<dialog
  class="lightbox svelte-1rpafw1"
  aria-label={alt}
  bind:this={dialog}
  oncancel={closeLightbox}
  onclick={closeLightbox}
  onwheel={closeLightbox}
  ontouchmove={closeOnTouch}
>
  <div class="scrim svelte-1rpafw1" bind:this={scrim}></div>
  <img
    class="svelte-1rpafw1"
    {src}
    {alt}
    bind:this={lightboxImage}
    style:background
    style:left={`${sourceRect.left ?? ''}px`}
    style:top={`${sourceRect.top ?? ''}px`}
    style:width={`${sourceRect.width ?? ''}px`}
    style:height={`${sourceRect.height ?? ''}px`}
  />
  <button
    class="close svelte-1rpafw1"
    type="button"
    aria-label="Close image"
    bind:this={closeButton}
  >
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      aria-hidden="true"
    ><path d="M18 6 6 18M6 6l12 12"></path></svg>
  </button>
</dialog>
