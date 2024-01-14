import app from 'flarum/admin/app';

app.initializers.add('nodeloc-dislikes', () => {
  app.extensionData
    .for('nodeloc-dislikes')
    .registerPermission(
      {
        icon: 'far fa-thumbs-down',
        label: app.translator.trans('nodeloc-dislikes.admin.permissions.dislike_posts_label'),
        permission: 'discussion.dislikePosts',
      },
      'reply'
    )
    .registerSetting({
      setting: 'nodeloc-dislikes.dislike_own_post',
      type: 'bool',
      label: app.translator.trans('nodeloc-dislikes.admin.settings.dislike_own_posts_label'),
      help: app.translator.trans('nodeloc-dislikes.admin.settings.dislike_own_posts_help'),
    });
});
