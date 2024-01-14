import Extend from 'flarum/common/extenders';
import Post from 'flarum/common/models/Post';
import User from 'flarum/common/models/User';
import DislikesUserPage from './components/DislikesUserPage';

export default [
  new Extend.Routes() //
    .add('user.dislikes', '/u/:username/dislikes', DislikesUserPage),

  new Extend.Model(Post) //
    .hasMany<User>('dislikes')
    .attribute<number>('dislikesCount')
    .attribute<boolean>('canDislike'),
];
