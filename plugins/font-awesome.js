import Vue from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Fontawesome Library
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fab)
library.add(far)
library.add(fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)
