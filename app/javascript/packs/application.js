import ReactOnRails from 'react-on-rails';
import Home from '../components/Pages';
import Races from '../components/Races';
import Race from '../components/Races/race';
import Standings from '../components/Pages/standings';
import NextRace from '../components/Races/next_race';
import GroupedQualify from '../components/Races/grouped_qualify';
import UserInfo from '../components/UserInfo';

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  Home,
  Races,
  Race,
  Standings,
  NextRace,
  GroupedQualify,
  UserInfo
});
