import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import CommentPost from 'flarum/forum/components/CommentPost';

export default function () {
  extend(CommentPost.prototype, 'actionItems', function (items) {
    const post = this.attrs.post;

    if (post.isHidden() || !post.canDislike()) return;

    const dislikes = post.dislikes();

    let isDisliked = app.session.user && dislikes && dislikes.some((user) => user === app.session.user);

    items.add(
      'dislike',
      <Button
        className="Button Button--link"
        onclick={() => {
          isDisliked = !isDisliked;

          post.save({ isDisliked });

          // We've saved the fact that we do or don't dislike the post, but in order
          // to provide instantaneous feedback to the user, we'll need to add or
          // remove the dislike from the relationship data manually.
          const data = post.data.relationships.dislikes.data;
          data.some((dislike, i) => {
            if (dislike.id === app.session.user.id()) {
              data.splice(i, 1);
              return true;
            }
          });

          if (isDisliked) {
            data.unshift({ type: 'users', id: app.session.user.id() });
          }
        }}
      >
        {app.translator.trans(isDisliked ? 'flarum-dislikes.forum.post.undislike_link' : 'flarum-dislikes.forum.post.dislike_link')}
      </Button>
    );
  });
}
