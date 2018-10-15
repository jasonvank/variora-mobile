import { combineReducers } from 'redux';
import user from './reducer_user';
import documents from './reducer_documents';
import readlists from './reducer_readlists';
import explore from './reducer_explore';
import notifications from './reducer_notifications';
import search from './reducer_search';

const rootReducer = combineReducers({
  user,
  documents,
  readlists,
  explore,
  notifications,
  search
});

export default rootReducer;
