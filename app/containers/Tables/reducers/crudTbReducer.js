import {fromJS, List, Map} from 'immutable';
import notif from 'dan-api/ui/notifMessage';
import {CLOSE_NOTIF} from 'dan-redux/constants/notifConstants';
import {
    FETCH_DATA,
    ADD_EMPTY_ROW,
    UPDATE_ROW,
    REMOVE_ROW,
    EDIT_ROW,
    SAVE_ROW
} from '../constants/crudTbConstants';

const initialState = {
    dataTable: List([]),
    dataInit: List([
        {
            id: 0,
            category: '',
            price: '',
            date: '',
            time: '',
            name: '',
            available: false,
            edited: true,
        }
    ]),
    notifMsg: '',
};

const initialItem = (keyTemplate, anchor) => {
    const [...rawKey] = keyTemplate.keys();
    console.log(keyTemplate);
    const staticKey = {
        id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
    };
    for (let i = 0; i < rawKey.length; i += 1) {
        if (rawKey[i] !== 'id' && rawKey[i] !== 'edited') {
            console.log(anchor[i]?.initialValue)
            // staticKey[rawKey[i]] = anchor[i]?.initialValue;
        }
    }
    // Push another static key
    staticKey.edited = true;

    return Map(staticKey);
};

const initialImmutableState = fromJS(initialState);

export default function reducer(state = initialImmutableState, action = {}) {
    const {branch} = action;
    switch (action.type) {
        case `${branch}/${FETCH_DATA}`:
            return state.withMutations((mutableState) => {
                const items = fromJS(action.items);
                console.log(action.items);
                mutableState.set('dataTable', items);
            });
        case `${branch}/${ADD_EMPTY_ROW}`:
            return state.withMutations((mutableState) => {
                const raw = fromJS(state.get('dataInit').last());
                const initial = initialItem(raw, action.anchor);
                mutableState.update('dataTable', dataTable => dataTable.unshift(initial));
            });
        case `${branch}/${REMOVE_ROW}`:
            return state.withMutations((mutableState) => {
                const index = state.get('dataTable').indexOf(action.item);
                mutableState
                    .update('dataTable', dataTable => dataTable.splice(index, 1))
                    .set('notifMsg', notif.removed);
            });
        case `${branch}/${UPDATE_ROW}`:
            return state.withMutations((mutableState) => {
                const index = state.get('dataTable').indexOf(action.item);
                const cellTarget = action.event.target.name;
                const newVal = type => {
                    if (type === 'checkbox') {

                        return action.event.target.checked;
                    }
                    return action.event.target.value;
                };
                console.log(state.get('dataTable'));
                mutableState.update('dataTable', dataTable => dataTable
                    .setIn([index, cellTarget], newVal(action.event.target.type))
                );
            });
        case `${branch}/${EDIT_ROW}`:
            return state.withMutations((mutableState) => {
                const index = state.get('dataTable').indexOf(action.item);
                mutableState.update('dataTable', dataTable => dataTable
                    .setIn([index, 'edited'], true)
                );
            });
        case `${branch}/${SAVE_ROW}`:
            return state.withMutations((mutableState) => {
                const index = state.get('dataTable').indexOf(action.item);
                mutableState
                    .update('dataTable', dataTable => dataTable
                        .setIn([index, 'edited'], false)
                    )
                    .set('notifMsg', notif.saved);
            });
        case `${branch}/${CLOSE_NOTIF}`:
            return state.withMutations((mutableState) => {
                mutableState.set('notifMsg', '');
            });
        default:
            return state;
    }
}
