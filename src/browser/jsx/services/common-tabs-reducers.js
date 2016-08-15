import _ from 'lodash';

function addItem(state, action, item) {
  const groupId = action.groupId,
    groupIndex = _.findIndex(state, {groupId});

  state = state.updateIn([groupIndex, 'tabs'], tabs => {
    return tabs.push(item);
  });

  state = state.setIn([groupIndex, 'active'], item.id);

  return state;
}

/**
 * @param {Immutable} state
 * @param {Action} action
 * @returns {Immutable}
 */
function focus(state, action) {
  const groupId = action.groupId,
    groupIndex = _.findIndex(state, {groupId});

  // if we own the group
  if (groupIndex !== -1) {
    const id = action.id,
      tabIndex = _.findIndex(state[groupIndex].tabs, {id});

    if (tabIndex !== -1) {
      state = state.setIn([groupIndex, 'active'], id);
    }
  }

  return state;
}

/**
 * @param {Array} state
 * @param {object} action
 * @returns {Array}
 */
function close(state, action) {
  const groupId = action.groupId,
    id = action.id,
    groupIndex = _.findIndex(state, {groupId}),
    tabs = state[groupIndex].tabs,
    tabIndex = _.findIndex(state[groupIndex].tabs, {id});

  // only allow removal if they have more than one item
  if (tabs.length > 1) {
    state = state.updateIn([groupIndex, 'tabs'], tabs => {
      return tabs.filter(tab => tab.id !== id);
    });

    if (state[groupIndex].active === id) {
      let newActive;

      if (tabIndex === 0 && tabs[1]) {
        newActive = tabs[1].id;
      } else {
        newActive = tabs[tabIndex - 1].id;
      }

      state = state.setIn([groupIndex, 'active'], newActive);
    }
  }

  return state;
}

export default {
  addItem,
  close,
  focus
};