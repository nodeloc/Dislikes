import app from 'flarum/forum/app';
import PostsUserPage from 'flarum/forum/components/PostsUserPage';

/**
 * The `DislikesUserPage` component shows posts which user the user disliked.
 */
export default class DislikesUserPage extends PostsUserPage {
  /**
   * Load a new page of the user's activity feed.
   *
   * @param offset The position to start getting results from.
   * @protected
   */
  loadResults(offset: number) {
    return app.store.find('posts', {
      filter: {
        type: 'comment',
        dislikedBy: this.user.id(),
      },
      page: { offset, limit: this.loadLimit },
      sort: '-createdAt',
    });
  }
}
