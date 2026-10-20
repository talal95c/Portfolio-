<footer>
  <h2>Building things and <br />learning along the way</h2>
  <p>
    <span class="contact-line">I love building products and learning in public. I’d love to connect on</span>
    <span class="contact-line">
      <a class="social" href="https://linkedin.com/in/talalaamir" target="_blank" rel="noopener noreferrer" style="--tilt: -12deg"><span class="social-pill linkedin">LinkedIn</span><svg class="sticker" viewBox="0 0 24 24" aria-hidden="true"><path fill="#0a66c2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.71 1.637-1.693 3.37-1.693 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg></a>
      or
      <a class="social" href="https://github.com/talal95c" target="_blank" rel="noopener noreferrer" style="--tilt: 10deg"><span class="social-pill github">GitHub</span><svg class="sticker" viewBox="0 0 24 24" aria-hidden="true"><path fill="#181717" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg></a>,
      or you can send me an email at
      <a class="social" href="mailto:talalaamir958@gmail.com" style="--tilt: -8deg"><span class="social-pill email">talalaamir958@gmail.com</span><svg class="sticker" viewBox="0 0 24 24" aria-hidden="true"><path fill="#ea4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /></svg></a>.
    </span>
  </p>
</footer>

<style>
  footer {
    padding: 88px var(--page-gutter) 96px;
    background: #fff;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    gap: 64px;
    display: flex;
  }

  h2 {
    letter-spacing: -0.02em;
    font-size: 48px;
    font-weight: 400;
    line-height: 1.22;
  }

  p {
    width: max-content;
    max-width: 100%;
    padding-top: 18px;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.55;
  }

  .contact-line {
    white-space: nowrap;
    display: block;
  }

  .social {
    white-space: nowrap;
    border-radius: 999px;
    margin: -4px -3px;
    padding: 4px 3px;
    line-height: 1.2;
    text-decoration: none;
    display: inline-block;
    position: relative;
  }

  .social-pill {
    pointer-events: none;
    transition: transform 0.3s var(--ease-out), background-color 0.2s ease;
    border-radius: 999px;
    padding: 1px 9px 2px;
    display: inline-block;
  }

  .linkedin {
    color: #2142b8;
    background: #dde6ff;
  }

  .github {
    color: #2b2b33;
    background: #ebe8f1;
  }

  .email {
    color: #a84d17;
    background: #ffe3d1;
  }

  .sticker {
    z-index: 2;
    pointer-events: none;
    opacity: 0;
    transform-origin: 50% 100%;
    width: 34px;
    height: 34px;
    transition:
      transform 0.18s ease-in,
      opacity 0.12s ease-in;
    filter: drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff)
      drop-shadow(1px 1px 0 #fff) drop-shadow(-1px -1px 0 #fff) drop-shadow(0 3px 5px #0000002e);
    position: absolute;
    bottom: calc(100% - 6px);
    right: -8px;
    transform: translateY(10px) scale(0.3) rotate(calc(var(--tilt) * -2.5));
  }

  .social:focus-visible {
    outline-offset: 3px;
  }

  @media (hover: hover) and (pointer: fine) {
    .social:hover .social-pill {
      transform: translateY(-1px);
    }

    .social:hover .linkedin {
      background: #cfdbff;
    }

    .social:hover .github {
      background: #e1dcea;
    }

    .social:hover .email {
      background: #ffd8bf;
    }

    .social:hover .sticker {
      opacity: 1;
      transition:
        transform 0.5s cubic-bezier(0.34, 1.7, 0.5, 1),
        opacity 0.15s ease-out;
      transform: translateY(0) scale(1) rotate(var(--tilt));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .social-pill,
    .sticker,
    .social:hover .sticker {
      transition: opacity 0.18s;
    }

    .sticker,
    .social:hover .sticker,
    .social:hover .social-pill {
      transform: rotate(var(--tilt));
    }
  }

  @media (width <= 600px) {
    footer {
      gap: 32px;
      padding: 56px 24px 64px;
    }

    h2 {
      text-wrap: balance;
      max-width: 100%;
      font-size: 32px;
      line-height: 1.2;
    }

    h2 br {
      display: none;
    }

    p {
      width: 100%;
      padding-top: 0;
    }

    .contact-line {
      white-space: normal;
      display: inline;
    }
  }
</style>
