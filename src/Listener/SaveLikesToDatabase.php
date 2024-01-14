<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Dislikes\Listener;

use Flarum\Dislikes\Event\PostWasDisliked;
use Flarum\Dislikes\Event\PostWasUndisliked;
use Flarum\Post\Event\Deleted;
use Flarum\Post\Event\Saving;
use Illuminate\Contracts\Events\Dispatcher;

class SaveDislikesToDatabase
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(Saving::class, [$this, 'whenPostIsSaving']);
        $events->listen(Deleted::class, [$this, 'whenPostIsDeleted']);
    }

    /**
     * @param Saving $event
     */
    public function whenPostIsSaving(Saving $event)
    {
        $post = $event->post;
        $data = $event->data;

        if ($post->exists && isset($data['attributes']['isDisliked'])) {
            $actor = $event->actor;
            $disliked = (bool) $data['attributes']['isDisliked'];

            $actor->assertCan('dislike', $post);

            $currentlyDisliked = $post->dislikes()->where('user_id', $actor->id)->exists();

            if ($disliked && ! $currentlyDisliked) {
                $post->dislikes()->attach($actor->id);

                $post->raise(new PostWasDisliked($post, $actor));
            } elseif ($currentlyDisliked) {
                $post->dislikes()->detach($actor->id);

                $post->raise(new PostWasUndisliked($post, $actor));
            }
        }
    }

    /**
     * @param Deleted $event
     */
    public function whenPostIsDeleted(Deleted $event)
    {
        $event->post->dislikes()->detach();
    }
}
