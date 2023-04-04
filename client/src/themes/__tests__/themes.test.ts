import getTheme from 'themes/index'

describe('themes', () => {
  describe('getTheme', () => {
    it('should return default theme if requested', () => {
      expect(getTheme('default').name).toEqual('Dark Green')
    })

    it('should return light green theme if requested', () => {
      expect(getTheme('light').name).toEqual('Light Green')
    })

    it('should dark orange theme if requested', () => {
      expect(getTheme('darkOrange').name).toEqual('Dark Orange')
    })
  })
})
