import app from 'flarum/admin/app';

app.initializers.add('flarum-dislikes', () => {
  app.extensionData
    .for('flarum-dislikes')
    .registerPermission(
      {
        icon: 'far fa-thumbs-down',
        label: app.translator.trans('flarum-dislikes.admin.permissions.dislike_posts_label'),
        permission: 'discussion.dislikePosts',
      },
      'reply'
    )
    .registerSetting({
      setting: 'flarum-dislikes.dislike_own_post',
      type: 'bool',
      label: app.translator.trans('flarum-dislikes.admin.settings.dislike_own_posts_label'),
      help: app.translator.trans('flarum-dislikes.admin.settings.dislike_own_posts_help'),
    });
});
