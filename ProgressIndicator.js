
/**

  Adds / removes infinite spinner.

  WARNING parent needs to have position absolute/relative
  or TODO extend this fn to add it if not existing


  METHODS:
  @method add (parent, theme, offset)
  @method hide (parent, showCheck)


*/


const progressIndicator = {
  /**
   * adds a spinner to parent
   * 
   * @param {string} parent css selector string / dom object
   * @param {string} theme 'light', 'dark', 'dark blue', 'light small nobg' (small is used in infinite scroll and settings), blue/light makes circle blue, light has light bg, dark has $viewBg, nobg is transparent
   * @param {array} offset e.g. [0,1] = [x,y]
   */
  add : function (parent, theme, offset) {

    var theme       = (typeof theme !== 'undefined') ? theme : 'dark'
    var strokeColor = (theme === 'dark' || theme.match(/blue/) === null) ? 'rgb(32, 39, 48)' : 'rgb(31, 99, 201)'
    var addClass    = ''

    if (theme.match(/white/)) {
      strokeColor = 'rgb(255, 255, 255)'
    }

    var styles = ''

    if (!parent) {
      console.error('Not sent parent, cant add spinner')
      return
    }

    parent = typeof parent === 'string' ? document.querySelector(parent) : parent

    if (!parent) {
      console.error('parent element not found, cant add spinner')
      return
    }

    if (offset) {
      styles = 'margin-top: ' + offset[0] + 'px; margin-left: ' + offset[1] + 'px;'
    }

    if (parent.classList.contains('content')) {
      addClass = 'margin-top'
    }

    var html =
    '<div class="spinner ' + theme + ' ' + addClass + '" style="' + styles + '">' +
      '<svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">' +
        '<circle fill="none" stroke="' + strokeColor + '" cx="15" cy="15" r="14"></circle>' +
      '</svg>' +
    '</div>'

    parent.insertAdjacentHTML('afterbegin', html)
  },


  /**
   * 
   *
   * @param {string} parent 
   * @param {boolean} failed 
   * @param {offset} offset 
   * @param {hide} hide 
   */
  showCheck : function (parent, failed, offset, hide) {

    if (!parent) {
      console.error('Not sent parent, cant add spinner')
      return
    }

    parent = typeof parent === 'string' ? document.querySelector(parent) : parent

    if (!parent) {
      console.error('parent element not found, cant add spinner')
      return
    }

    if (!offset) {
      offset = [0, 0]
    }

    var hide = (typeof hide === 'undefined') ? true : hide

    var html = '<div class="checkmark-sm" style="top:' + offset[0] + 'px; left:' + offset[1] + 'px;">' +
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" + width="24" height="24">' +
        '<path d=" M 6.1 12.429 L 9.519 16 L 17.9 8" fill="none" vector-effect="non-scaling-stroke" stroke-width="1.5" stroke="rgb(255,255,255)" stroke-opacity="100" stroke-linejoin="round" stroke-linecap="square" stroke-miterlimit="3"/></svg>' +
    '</div>'

    parent.insertAdjacentHTML('afterbegin', html)


    setTimeout(function () {

      var checkmark = parent.querySelector('.checkmark-sm')

      checkmark.classList.add('anim')

      if (hide) {
        setTimeout(function () {
          checkmark.classList.add('animOut')
          checkmark.classList.remove('anim')

          setTimeout(function () {
            checkmark.classList.remove('animOut')
          }, 1500)
        }, 2000)
      }
    }, 5)

  },

  /**
   * remove spinner in parent
   * @param {string} parent 
   * @param {boolean} showCheck 
   */
  hide : function (parent, showCheck) {

    var t = this

    if (!parent) {
      console.error('Not sent parent / parent not found, cant remove spinner')
      return
    }

    parent = typeof parent === 'string' ? document.querySelector(parent) : parent

    if (!parent) {
      return
    }

    var spinner = parent.querySelector('.spinner')

    if (spinner) {
      spinner.remove()
    }

    // if to show a checkmark in place of the spinner (used in settings)
    if (showCheck === true) {
      t.showCheck(parent, false)

      setTimeout(function () {
        parent.querySelector('.checkmark-sm').remove()
      }, 3600)
    }
  }
}
