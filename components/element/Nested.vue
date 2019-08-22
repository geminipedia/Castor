<template>
  <span v-if="context.type === 'NORMAL'">{{ context.text }}</span>
  <strong v-else-if="context.type === 'STRONG'">{{ context.text }}</strong>
  <italic v-else-if="context.type === 'ITALIC'">{{ context.text }}</italic>
  <a
    v-else-if="context.type === 'LINK'"
    :href="context.href"
    :title="context.text"
    target="_blank"
    rel="noopener noreferrer"
  >{{ context.text }}</a>
</template>

<script>
export default {
  props: {
    context: {
      type: Object,
      default: null
    }
  }
}
</script>
