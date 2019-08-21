export const actions = {
  async nuxtServerInit ({ dispatch }) {
    await dispatch('item/getAll')
    await dispatch('app/getSite')
    await dispatch('menu/getItem')
  }
}
