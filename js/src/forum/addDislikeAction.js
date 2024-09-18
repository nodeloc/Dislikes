import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import CommentPost from 'flarum/forum/components/CommentPost';
import Modal from 'flarum/common/components/Modal';

// 更新确认对话框组件
class DislikeConfirmationModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);
    this.isDisliked = this.attrs.isDisliked;
  }

  className() {
    return 'DislikeConfirmationModal Modal--small';
  }

  title() {
    return app.translator.trans(this.isDisliked
      ? 'nodeloc-dislikes.forum.undislike_confirmation_title'
      : 'nodeloc-dislikes.forum.dislike_confirmation_title'
    );
  }

  content() {
    return (
      <div className="Modal-body">
        <p>{app.translator.trans(this.isDisliked
            ? 'nodeloc-dislikes.forum.undislike_confirmation_text'
            : 'nodeloc-dislikes.forum.dislike_confirmation_text'
        )}</p>
        <div className="Form-group">
          {Button.component({
            className: 'Button Button--primary Button--block',
            onclick: this.attrs.onconfirm,
          }, app.translator.trans(this.isDisliked
            ? 'nodeloc-dislikes.forum.confirm_undislike'
            : 'nodeloc-dislikes.forum.confirm_dislike'
          ))}
        </div>
      </div>
    );
  }
}

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
          // 假设能量消耗是固定的，您需要根据实际情况设置这个值
          const energyCost = 5;

          app.modal.show(DislikeConfirmationModal, {
            isDisliked: isDisliked,
            energyCost: energyCost,
            onconfirm: () => {
              isDisliked = !isDisliked;
              post.save({ isDisliked });

              // 更新关系数据
              const data = post.data.relationships.dislikes.data;
              if (isDisliked) {
                data.unshift({ type: 'users', id: app.session.user.id() });
              } else {
                const index = data.findIndex(dislike => dislike.id === app.session.user.id());
                if (index !== -1) {
                  data.splice(index, 1);
                }
              }

              app.modal.close();
            },
          });
        }}
      >
        {app.translator.trans(isDisliked ? 'nodeloc-dislikes.forum.post.undislike_link' : 'nodeloc-dislikes.forum.post.dislike_link')}
      </Button>
    );
  });
}
