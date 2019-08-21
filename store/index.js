export const actions = {
  async nuxtServerInit ({ dispatch }) {
    await dispatch('app/getSite')
    await dispatch('menu/getItem')
  }
}
