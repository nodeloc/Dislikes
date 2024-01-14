import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import CommentPost from 'flarum/forum/components/CommentPost';
import Link from 'flarum/common/components/Link';
import punctuateSeries from 'flarum/common/helpers/punctuateSeries';
import username from 'flarum/common/helpers/username';
import icon from 'flarum/common/helpers/icon';
import Button from 'flarum/common/components/Button';

import PostDislikesModal from './components/PostDislikesModal';

export default function () {
  extend(CommentPost.prototype, 'footerItems', function (items) {
    const post = this.attrs.post;
    const dislikes = post.dislikes();

    if (dislikes && dislikes.length) {
      const limit = 4;
      const overLimit = post.dislikesCount() > limit;

      // Construct a list of names of users who have disliked this post. Make sure the
      // current user is first in the list, and cap a maximum of 4 items.
      const names = dislikes
        .sort((a) => (a === app.session.user ? -1 : 1))
        .slice(0, overLimit ? limit - 1 : limit)
        .map((user) => {
          return (
            <Link href={app.route.user(user)}>
              {user === app.session.user ? app.translator.trans('flarum-dislikes.forum.post.you_text') : username(user)}
            </Link>
          );
        });

      // If there are more users that we've run out of room to display, add a "x
      // others" name to the end of the list. Clicking on it will display a modal
      // with a full list of names.
      if (overLimit) {
        const count = post.dislikesCount() - names.length;
        const label = app.translator.trans('flarum-dislikes.forum.post.others_link', { count });

        if (app.forum.attribute('canSearchUsers')) {
          names.push(
            <Button
              className="Button Button--ua-reset Button--text"
              onclick={(e) => {
                e.preventDefault();
                app.modal.show(PostDislikesModal, { post });
              }}
            >
              {label}
            </Button>
          );
        } else {
          names.push(<span>{label}</span>);
        }
      }

      items.add(
        'disliked',
        <div className="Post-dislikedBy">
          {icon('far fa-thumbs-down')}
          {app.translator.trans(`flarum-dislikes.forum.post.disliked_by${dislikes[0] === app.session.user ? '_self' : ''}_text`, {
            count: names.length,
            users: punctuateSeries(names),
          })}
        </div>
      );
    }
  });
}
