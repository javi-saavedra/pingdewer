import { createGlobalState } from 'react-hooks-global-state';
import _ from 'lodash';

const userToken = localStorage.getItem("token");

const { setGlobalState, useGlobalState } = createGlobalState({
  signedIn: _.isNil(userToken) ? false : true,
});

export { useGlobalState, setGlobalState }