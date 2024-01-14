import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import NotificationGrid from 'flarum/forum/components/NotificationGrid';

import addDislikeAction from './addDislikeAction';
import addDislikesList from './addDislikesList';
import PostDislikedNotification from './components/PostDislikedNotification';
import addDislikesTabToUserProfile from './addDislikesTabToUserProfile';

export { default as extend } from './extend';

app.initializers.add('nodeloc-dislikes', () => {
  app.notificationComponents.postDisliked = PostDislikedNotification;

  addDislikeAction();
  addDislikesList();
  addDislikesTabToUserProfile();

  extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
    items.add('postDisliked', {
      name: 'postDisliked',
      icon: 'far fa-thumbs-down',
      label: app.translator.trans('nodeloc-dislikes.forum.settings.notify_post_disliked_label'),
    });
  });
});
