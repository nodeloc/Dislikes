import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import UserPage from 'flarum/forum/components/UserPage';
import LinkButton from 'flarum/common/components/LinkButton';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

export default function addDislikesTabToUserProfile() {
  extend(UserPage.prototype, 'navItems', function (items: ItemList<Mithril.Children>) {
    const user = this.user;
    items.add(
      'dislikes',
      <LinkButton href={app.route('user.dislikes', { username: user?.slug() })} icon="far fa-thumbs-down">
        {app.translator.trans('flarum-dislikes.forum.user.dislikes_link')}
      </LinkButton>,
      88
    );
  });
}
