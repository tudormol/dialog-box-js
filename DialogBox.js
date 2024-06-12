

/**

  Dialog box UI component.

  NOTE: supports multiple submit buttons, just check class = button id in onSubmit to add evt handler to btns.


  @see PARAMS:

  @param {string} id               id
  @param {string} title            title
  @param {string} text             text content
  @param {string} type             'alert', 'options', 'input'
  @param {boolean} modal           if clicking outside dismisses dialog
  @param {object} list             list of options for type 'options', of shape: { id : 'o1', label : 'option 1', selected : true }
  @param {string} inputValue       for type 'input', the initial value of the input
  @param {object} checkbox         {checked : true, label : ''} / false - if to show a checkbox with a label under the content (for type alert only) (e.g. for 'dont show again' usage) - returns checked val in submit fn - send obj
  @param {boolean} closeOnSubmit   true, false - if to close dialog on submit click
  @param {array} buttons           buttons array, of shape: { id : '', type : 'close', label : 'Cancel' } - id optional, types: 'close', 'submit', style: extra css class to apply to submit btn (optional)
  @param {boolean} overlay         if overlay is visible (always gets added regardless of the option)
  @param {function} eventHandlers  special evt handlers (normally you should use onOpen, onClose, onSubmit)
  @param {function} onOpen  (e, this, value) fn evt on dialog open
  @param {function} onClose (e, this)        fn evt on dialog close
  @param {function} onSubmit       fn evt on dialog submit click (sends selected options as 2nd param for type options, needs options list to have ids)

  @see METHODS:

  @method show
  @method hide
  @method getSelectedValues returns selected values for type 'options'

*/


class DialogBox {

  constructor (options) {

    var defaults = {
      id                     : '',
      title                  : '',
      text                   : '',
      type                   : 'alert',
      modal                  : true,
      list                   : [],
      inputValue             : '',
      checkbox               : false,
      closeOnSubmit          : true,
      buttons                : [{ type : 'submit', label : 'OK' }],
      overlay                : true,
      eventHandlers          : null,
      tpl                    : window.render ? window.render.dialogbox : null,
      onOpen                 : function () {},
      onClose                : function () {},
      onSubmit               : function () {}
    }

    var opts = Object.assign(defaults, options)
    var t = this


    // store props
    t.opts = opts
    t.isVisible = false
    t.isTabbed  = (typeof opts.tabs !== 'undefined')

    // create dom
    t.domElement = document.createElement('div')
    t.domElement.className = 'dialog-box ' + t.opts.id +  ' ' + t.opts.type
    document.body.appendChild(t.domElement)

    // set template
    var data = {
      title      : opts.title || '',
      text       : opts.text || '',
      inputValue : opts.inputValue || '',
      type       : opts.type,
      list       : opts.list,
      buttons    : opts.buttons
    }

    data.checkbox = opts.checkbox && opts.type === 'alert' ? opts.checkbox : false

    var template = opts.tpl

    if (!template) {
      console.error('Could not find dialog template ', opts.tpl)
      return
    }

		t.domElement.innerHTML = template(data)

    setTimeout( () => {
      t.domElement.querySelector('.dialog-container').focus()
    }, 10)

    t._addEventListeners()

  }


  // generic event handlers
  _addEventListeners () {

    var t = this

    if (t.opts.type === 'options') {

      var onListClick = function (e) {
        e.target.classList.toggle('selected')

        t._onSelectionChange(e, t)
      }

      t.domElement.querySelector('ul').removeEventListener('click', onListClick)
      t.domElement.querySelector('ul').addEventListener('click', onListClick)
    }

    var submitBtn  = t.domElement.querySelectorAll('button.submit')
    var dismissBtn = t.domElement.querySelector('button.close')
    var checkbox   = t.domElement.querySelector('div.checkbox')

    if (submitBtn.length !== 0) {
      for (var i = 0; i < submitBtn.length; i++) {
        submitBtn[i].addEventListener('click', function (e) {
          t._onSubmit(e, t)
        })
      }
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', function (e) {
        t._onDismiss(e, t)
      })
    }

    if (checkbox) {
      checkbox.addEventListener('click', function (e) {
        e.target.classList.toggle('checked')
      })
    }

    t.onKeyDown = function (e) {
      t._keyEvents(e, t)
    }

    document.body.addEventListener('keydown', t.onKeyDown)

    if (typeof eventHandlers === 'function') {
      t.opts.eventHandlers()
    }
  }

  _keyEvents (e, t) {

    switch (e.keyCode) {

      case 27: // esc

        t._onDismiss(e, t, true)

        e.preventDefault()
        e.stopPropagation()

        break

      case 32: //space

        var highlightedElement = t.domElement.querySelector('li.highlighted')

        // NOTE only prevent default if highlighted an element, otherwise allow, otherwise cant input space in dialog input (t #3948211)
        if (t.opts.type === 'options' && highlightedElement !== null) {
          highlightedElement.classList.toggle('selected')
          e.preventDefault()
          e.stopPropagation()
        }

        break

      case 13: // ent

        t._onSubmit(e, t, true)

        e.preventDefault()
        e.stopPropagation()

        break

      default:
        break
    }
  }


  _toggle () {

    var t = this

    if (!t.isVisible) {

      t.domElement.classList.add('show')

      // always add overlay, make it visible if overlay option is true
      t.ol = document.createElement('div')
      t.ol.className = 'dialog-ol'

      if (t.opts.overlay) {
        t.ol.classList.add('bg')
      }

      document.querySelector('body').appendChild(t.ol)

      setTimeout(function () {
        t.domElement.classList.toggle('anim')
        t.ol.classList.add('anim')

        var input = t.domElement.querySelector('input')

        if (t.opts.type === 'input' && input) {
          input.select()
          input.focus()
        }
      }, 50)

      t.ol.addEventListener('click', function (e) {
        if (e.target.classList.contains('dialog-ol')) {
          if (!t.opts.modal) {
            t._onDismiss(e, t)
          }

        }
      })

      t.opts.onOpen(t)

      t.ol.oncontextmenu = function (e) {
        if (!t.opts.modal) {
          t._onDismiss(e, t)
        }

        e.stopPropagation()
        e.preventDefault()
      }

    }

    t.isVisible = !t.isVisible
  }

  show () {

    var t = this

    if (!t.isVisible) {
      t._toggle()
    }
  }


  hide () {

    var t = this
    var delay = 0 // was 250

    t.domElement.classList.remove('anim')
    t.isVisible = false
    var ol = document.querySelector('.modal-ol')

    if (t.ol) {
      t.ol.classList.remove('anim')
    }

    document.body.removeEventListener('keydown', t.onKeyDown)

    setTimeout(function () {
      t.domElement.remove()

      if (t.ol) {
        t.ol.remove()
      }
    }, delay)
  }


  // returns obj with selected options
  getSelectedValues () {

    var t = this
    var els = t.domElement.querySelectorAll('ul li')
    var id
    var obj = []
    var selected

    for (var i = 0; i < els.length; i++) {
      id = els[i].getAttribute('data-id')
      selected = els[i].classList.contains('selected')

      if (selected) {
        obj.push(id)
      }

    }

    return obj
  }


  // triggers when options in type = options are toggled
  _onSelectionChange (e, t) {

    var t = this

    if (t.opts.type !== 'options') {
      return
    }

    var sel = t.getSelectedValues()
    var submitBtn = t.domElement.querySelector('button.submit')

    if (submitBtn) {
      if (sel.length === 0) {
        submitBtn.classList.add('disabled')
      } else {
        submitBtn.classList.remove('disabled')
      }
    }
  }


  _onSubmit (e, t, keyPressEvt) {

    var val

    // added to fix issue: tab nav to highlight close btn, press enter, expect dialog not to submit ()
    if (keyPressEvt && t.domElement.querySelector('.close.highlighted')) {
      // console.warn('enter with highlight on dismiss, wont submit')
      return
    } else {
      // console.warn('will submit on enter')
    }

    // send selected values if type=option
    if (t.opts.type === 'options') {
      val = t.getSelectedValues()
    } else if (t.opts.type === 'input') {
      val = t.domElement.querySelector('input').value
    } else if (t.opts.checkbox) {
      val = {
        checked : t.domElement.querySelector('.checkbox').classList.contains('checked')
      }
    }

    t.opts.onSubmit(e, val, t)

    var submitBtn = t.domElement.querySelector('button.submit')
    var delay = 1

    // if keypress show active on button and add a small delay before hiding dialog
    if (keyPressEvt && submitBtn) {
      delay = 150
      submitBtn.classList.add('active')
    }

    if (t.opts.closeOnSubmit) {
      setTimeout(function () {
        t._onDismiss(e, t)
      }, delay)
    }
  }


  _onDismiss (e, t, keyPressEvt) {

    var closeBtn = t.domElement.querySelector('button.close')
    var delay = 1

    // if keypress show active on button and add a small delay before hiding dialog
    if (keyPressEvt && closeBtn) {
      delay = 150
      closeBtn.classList.add('active')
    }

    setTimeout(function () {
      t.hide()
      t.opts.onClose(e, t)
    }, delay)
  }

}
