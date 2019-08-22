import * as _ from 'lodash'

export const actions = {
  parseMarkup ({ commit }, data) {
    const _text = data.text
    const result = []

    let _data = data.markup.map(rule => ({
      text: _text.slice(rule.start, rule.end),
      ...rule
    }))

    if (_data.length === 0) {
      return [{ text: _text, type: 'NORMAL' }]
    }

    _data = _.orderBy(_data, _data.start, 'asc')

    _data.forEach((ele, index) => {
      if (ele.type === 'IMAGE') {
        result.splice(0, 0, _data[index])
      } else {
        _text.split(ele.text).forEach((text) => {
          result.push({ text, type: 'NORMAL' })
        })
        result.splice(index + 1, 0, _data[index])
      }
    })

    return result
  }
}
