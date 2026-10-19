<footer>
  <h2>Building things and <br />learning along the way</h2>
  <p>
    <span class="contact-line">I love building products and learning in public. I’d love to connect on</span>
    <span class="contact-line">
      <a class="social" href="https://linkedin.com/in/talalaamir" target="_blank" rel="noopener noreferrer"><span class="social-pill linkedin">LinkedIn</span></a>
      or
      <a class="social" href="https://github.com/talal95c" target="_blank" rel="noopener noreferrer"><span class="social-pill github">GitHub</span></a>,
      or you can send me an email at
      <a class="social" href="mailto:talalaamir958@gmail.com"><span class="social-pill email">talalaamir958@gmail.com</span></a>.
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
    color: #fff;
    pointer-events: none;
    transform-origin: 50%;
    transition: transform 0.18s var(--ease-out), opacity 0.18s ease;
    border-radius: 999px;
    padding: 1px 9px 2px;
    display: inline-block;
  }

  .linkedin {
    background: #1400ff;
  }

  .github {
    background: #000;
  }

  .email {
    background: #f3742b;
  }

  .social:focus-visible {
    outline-offset: 3px;
  }

  @media (hover: hover) and (pointer: fine) {
    .social:hover .social-pill {
      opacity: 0.85;
      transform: scale(0.95) rotate(-2deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .social-pill {
      transition: opacity 0.18s;
    }

    .social:hover .social-pill {
      transform: none;
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
