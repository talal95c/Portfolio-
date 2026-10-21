<script>
  let { stages = [], accent } = $props();
</script>

<div class="architecture-diagram reveal" style={`--diagram-accent:${accent}`}>
  <div class="stages">
    {#each stages as stage, stageIndex (stageIndex)}
      <div
        class="stage"
        class:flow-stage={stage.flow}
        style={`--node-count:${stage.nodes.length}`}
      >
        {#each stage.nodes as node, nodeIndex (`${stageIndex}-${node.label}`)}
          <div class="node-wrap">
            <article class="node" class:accent={node.accent}>
              <span class="tag">{node.tag}</span>
              <span class="label">{node.label}</span>
              <span class="note">{node.note}</span>
            </article>
            {#if stage.flow && nodeIndex < stage.nodes.length - 1}
              <span class="flow-arrow" aria-hidden="true"></span>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .architecture-diagram {
    width: 100%;
    padding: 28px;
    border-radius: 12px;
    background: #fff;
  }

  .stages {
    display: grid;
    gap: 42px;
  }

  .stage {
    position: relative;
    min-width: 0;
    display: grid;
    place-items: center;
  }

  .stage:not(:last-child)::after {
    position: absolute;
    top: calc(100% + 10px);
    left: 50%;
    width: 1px;
    height: 20px;
    background: rgba(0, 0, 0, 0.25);
    content: '';
  }

  .stage:not(:last-child)::before {
    position: absolute;
    z-index: 1;
    top: calc(100% + 25px);
    left: calc(50% - 3px);
    width: 5px;
    height: 5px;
    border-right: 1px solid rgba(0, 0, 0, 0.25);
    border-bottom: 1px solid rgba(0, 0, 0, 0.25);
    transform: rotate(45deg);
    content: '';
  }

  .flow-stage {
    grid-template-columns: repeat(var(--node-count), minmax(0, 1fr));
    gap: 28px;
  }

  .node-wrap {
    position: relative;
    min-width: 0;
    width: 100%;
  }

  .stage:not(.flow-stage) .node-wrap {
    width: 60%;
  }

  .node {
    display: flex;
    min-width: 0;
    min-height: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
    padding: 14px 16px;
    border-radius: 12px;
    background: #f5f5f5;
  }

  .node.accent {
    background: var(--diagram-accent);
  }

  .tag {
    color: rgba(0, 0, 0, 0.45);
    font-size: 10.5px;
    font-weight: 400;
    letter-spacing: 0.06em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .label {
    color: #111;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.3;
  }

  .note {
    color: rgba(0, 0, 0, 0.55);
    font-size: 13px;
    font-weight: 400;
    line-height: 1.35;
  }

  .flow-arrow {
    position: absolute;
    top: 50%;
    right: -21px;
    width: 14px;
    height: 1px;
    background: rgba(0, 0, 0, 0.25);
  }

  .flow-arrow::after {
    position: absolute;
    top: -2px;
    right: 0;
    width: 4px;
    height: 4px;
    border-top: 1px solid rgba(0, 0, 0, 0.25);
    border-right: 1px solid rgba(0, 0, 0, 0.25);
    transform: rotate(45deg);
    content: '';
  }

  @media (max-width: 700px) {
    .architecture-diagram {
      padding: 20px;
    }

    .flow-stage {
      grid-template-columns: minmax(0, 1fr);
      gap: 26px;
    }

    .stage:not(.flow-stage) .node-wrap {
      width: 60%;
    }

    .flow-arrow {
      top: calc(100% + 7px);
      right: auto;
      left: 50%;
      width: 1px;
      height: 12px;
      transform: translateX(-50%);
    }

    .flow-arrow::after {
      top: auto;
      right: -2px;
      bottom: 0;
      border-top: 0;
      border-right: 1px solid rgba(0, 0, 0, 0.25);
      border-bottom: 1px solid rgba(0, 0, 0, 0.25);
      border-left: 0;
      transform: rotate(45deg);
    }
  }
</style>
