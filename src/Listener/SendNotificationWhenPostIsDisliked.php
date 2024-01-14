<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Dislikes\Listener;

use Flarum\Dislikes\Event\PostWasDisliked;
use Flarum\Dislikes\Notification\PostDislikedBlueprint;
use Flarum\Notification\NotificationSyncer;

class SendNotificationWhenPostIsDisliked
{
    /**
     * @var NotificationSyncer
     */
    protected $notifications;

    /**
     * @param NotificationSyncer $notifications
     */
    public function __construct(NotificationSyncer $notifications)
    {
        $this->notifications = $notifications;
    }

    public function handle(PostWasDisliked $event)
    {
        if ($event->post->user && $event->post->user->id != $event->user->id) {
            $this->notifications->sync(
                new PostDislikedBlueprint($event->post, $event->user),
                [$event->post->user]
            );
        }
    }
}
