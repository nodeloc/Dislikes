<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Dislikes;

use Flarum\Api\Controller;
use Flarum\Api\Serializer\BasicUserSerializer;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Extend;
use Flarum\Dislikes\Api\LoadDislikesRelationship;
use Flarum\Dislikes\Event\PostWasDisliked;
use Flarum\Dislikes\Event\PostWasUndisliked;
use Flarum\Dislikes\Notification\PostDislikedBlueprint;
use Flarum\Dislikes\Query\DislikedByFilter;
use Flarum\Dislikes\Query\DislikedFilter;
use Flarum\Post\Filter\PostFilterer;
use Flarum\Post\Post;
use Flarum\User\Filter\UserFilterer;
use Flarum\User\User;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    (new Extend\Model(Post::class))
        ->belongsToMany('dislikes', User::class, 'post_dislikes', 'post_id', 'user_id'),

    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\Notification())
        ->type(PostDislikedBlueprint::class, PostSerializer::class, ['alert']),

    (new Extend\ApiSerializer(PostSerializer::class))
        ->hasMany('dislikes', BasicUserSerializer::class)
        ->attribute('canDislike', function (PostSerializer $serializer, $model) {
            return (bool) $serializer->getActor()->can('dislike', $model);
        })
        ->attribute('dislikesCount', function (PostSerializer $serializer, $model) {
            return $model->getAttribute('dislikes_count') ?: 0;
        }),

    (new Extend\ApiController(Controller\ShowDiscussionController::class))
        ->addInclude('posts.dislikes')
        ->loadWhere('posts.dislikes', [LoadDislikesRelationship::class, 'mutateRelation'])
        ->prepareDataForSerialization([LoadDislikesRelationship::class, 'countRelation']),

    (new Extend\ApiController(Controller\ListPostsController::class))
        ->addInclude('dislikes')
        ->loadWhere('dislikes', [LoadDislikesRelationship::class, 'mutateRelation'])
        ->prepareDataForSerialization([LoadDislikesRelationship::class, 'countRelation']),
    (new Extend\ApiController(Controller\ShowPostController::class))
        ->addInclude('dislikes')
        ->loadWhere('dislikes', [LoadDislikesRelationship::class, 'mutateRelation'])
        ->prepareDataForSerialization([LoadDislikesRelationship::class, 'countRelation']),
    (new Extend\ApiController(Controller\CreatePostController::class))
        ->addInclude('dislikes')
        ->loadWhere('dislikes', [LoadDislikesRelationship::class, 'mutateRelation'])
        ->prepareDataForSerialization([LoadDislikesRelationship::class, 'countRelation']),
    (new Extend\ApiController(Controller\UpdatePostController::class))
        ->addInclude('dislikes')
        ->loadWhere('dislikes', [LoadDislikesRelationship::class, 'mutateRelation'])
        ->prepareDataForSerialization([LoadDislikesRelationship::class, 'countRelation']),

    (new Extend\Event())
        ->listen(PostWasDisliked::class, Listener\SendNotificationWhenPostIsDisliked::class)
        ->listen(PostWasUndisliked::class, Listener\SendNotificationWhenPostIsUndisliked::class)
        ->subscribe(Listener\SaveDislikesToDatabase::class),

    (new Extend\Filter(PostFilterer::class))
        ->addFilter(DislikedByFilter::class),

    (new Extend\Filter(UserFilterer::class))
        ->addFilter(DislikedFilter::class),

    (new Extend\Settings())
        ->default('flarum-dislikes.dislike_own_post', true),

    (new Extend\Policy())
        ->modelPolicy(Post::class, Access\DislikePostPolicy::class),
];
