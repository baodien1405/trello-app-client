// onKeyDown
export const saveContentAfterPressEnter = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    e.target.blur()
  }
}

// Select add input values when click
export const selectAllInlineText = (e) => {
  e.target.focus()
  e.target.select()
  // document.selectCommand('selectAll', false, null)
}
