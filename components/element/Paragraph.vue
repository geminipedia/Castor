<template>
  <h1
    v-if="paragraph.type === 'HEADING'"
    :key="paragraph.id"
    class="title highlightable"
  >
    <Nested
      v-for="(context, index) in paragraph.nested"
      :key="index"
      :context="context"
    />
  </h1>
  <h2
    v-else-if="paragraph.type === 'SUBHEADING'"
    :key="paragraph.id"
    class="subtitle highlightable"
  >
    <Nested
      v-for="(context, index) in paragraph.nested"
      :key="index"
      :context="context"
    />
  </h2>
  <p
    v-else-if="paragraph.type === 'PARAGRAPH'"
    :key="paragraph.id"
    class="paragraph highlightable"
  >
    <Nested
      v-for="(context, index) in paragraph.nested"
      :key="index"
      :context="context"
    />
  </p>
  <hr
    v-else-if="paragraph.type === 'PART'"
    :key="paragraph.id"
  >
  <blockquote
    v-else-if="paragraph.type === 'QUOTE'"
    :key="paragraph.id"
    class="quote highlightable"
  >
    <Nested
      v-for="(context, index) in paragraph.nested"
      :key="index"
      :context="context"
    />
  </blockquote>
  <figure
    v-else-if="paragraph.type === 'IMAGE'"
    :key="paragraph.id"
    class="figure-container"
  >
    <img :src="paragraph.markup.filter(ele => (ele.type === 'IMAGE'))[0].src">
    <figcaption class="figure-image-caption">
      <span>
        <Nested
          v-for="(context, index) in paragraph.nested"
          :key="index"
          :context="context"
        />
      </span>
    </figcaption>
  </figure>
</template>

<script>
import Nested from './Nested'

export default {
  components: {
    Nested
  },
  props: {
    paragraph: {
      type: Object,
      default: null
    }
  }
}
</script>
