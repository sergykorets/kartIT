import ReactOnRails from 'react-on-rails';
import Currencies from '../components/Currencies';
import Actions from '../components/Actions';
import Versions from '../components/Versions';
import Transactions from '../components/Transactions';

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  Currencies,
  Actions,
  Versions,
  Transactions
});
