<script>
  import {
    currentChannelInfo,
    decrementChannel,
    incrementChannel,
  } from '../modules/tv.js'

  const LABELS = {
    en: {
      channel: 'CHANNEL',
      previous: 'previous channel',
      next: 'next channel',
    },
    'pt-BR': {
      channel: 'CANAL',
      previous: 'canal anterior',
      next: 'próximo canal',
    },
  }

  function readLabels() {
    return LABELS[document.documentElement.lang] ?? LABELS.en
  }

  let labels = $state(readLabels())

  $effect(() => {
    const update = () => {
      labels = readLabels()
    }
    document.addEventListener('astro:page-load', update)
    return () => document.removeEventListener('astro:page-load', update)
  })
</script>

<div class="channel-controller">
  <button
    class="previous"
    aria-label={labels.previous}
    onclick={decrementChannel}
  >
    ◄
  </button>
  <div class="channel">
    {labels.channel} <span>{$currentChannelInfo.displayName}</span>
  </div>
  <button class="next" aria-label={labels.next} onclick={incrementChannel}>
    ►
  </button>
</div>

<style>
  .channel-controller {
    display: flex;
    width: 15ch;
    align-items: center;
    justify-content: space-between;
  }

  button {
    position: relative;
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    color: inherit;
    text-shadow: inherit;
    font-family: inherit;
    font-size: 0.9rem;
    cursor: var(--cursor-pointer);

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
    }
  }
</style>
