import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Link from 'flarum/common/components/Link';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import type { IInternalModalAttrs } from 'flarum/common/components/Modal';
import type Post from 'flarum/common/models/Post';
import type Mithril from 'mithril';
import PostDislikesModalState from '../states/PostDislikesModalState';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';

export interface IPostDislikesModalAttrs extends IInternalModalAttrs {
  post: Post;
}

export default class PostDislikesModal<CustomAttrs extends IPostDislikesModalAttrs = IPostDislikesModalAttrs> extends Modal<CustomAttrs, PostDislikesModalState> {
  oninit(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.oninit(vnode);

    this.state = new PostDislikesModalState({
      filter: {
        disliked: this.attrs.post.id()!,
      },
    });

    this.state.refresh();
  }

  className() {
    return 'PostDislikesModal Modal--small';
  }

  title() {
    return app.translator.trans('flarum-dislikes.forum.post_dislikes.title');
  }

  content() {
    return (
      <>
        <div className="Modal-body">
          {this.state.isInitialLoading() ? (
            <LoadingIndicator />
          ) : (
            <ul className="PostDislikesModal-list">
              {this.state.getPages().map((page) =>
                page.items.map((user) => (
                  <li>
                    <Link href={app.route.user(user)}>
                      {avatar(user)} {username(user)}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        {this.state.hasNext() ? (
          <div className="Modal-footer">
            <div className="Form Form--centered">
              <div className="Form-group">
                <Button className="Button Button--block" onclick={() => this.state.loadNext()} loading={this.state.isLoadingNext()}>
                  {app.translator.trans('flarum-dislikes.forum.post_dislikes.load_more_button')}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}
